---
title: 围住神经猫h5小游戏
tags: ['wasm', 'game']
ctime: 2024-6-8 17:13
mtime: 2024-6-8 17:13

---

`wasm` + `canvas`的h5小游戏

<!-- more -->

`wasm` + `canvas` 复刻的经典小游戏

## 前言

学完wasm之后，由于现有的项目很难有发挥它的用途。在业余时间，简单写一些demo作为练习。

## 介绍

《围住神经猫》是一款益智小游戏，玩家需在9X9的点阵中通过点击把神经猫围在一定区域内。

![image-20240608171829720](./neurocat\image-20240608171829720.png)

## 简单分析

要做的大概包括三步

- 绘制n * n的矩阵，奇数列与偶数列有错位
- 不同颜色的实心圆来区分障碍物和非障碍物
- 每次点击之后，小猫根据最短路径，移动至下一位置，更新视图

先实现ts版本的，再将较为复杂的函数移动给wasm

## 代码实现

### Board类

采用面向对象的思想，将棋盘及其相关属性和方法封装至Board类，有利于代码的维护

```typescript
export type Props = {
  size: number
  canvas: HTMLCanvasElement
  padding: number
}

export default class Board {
  private size: number
  private board: boolean[][] = []
  private catPos: { x: number; y: number } = { x: 0, y: 0 }
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private padding: number
  private cellSize: number
  private xGap: number
  private yGap: number
  private cat: HTMLImageElement
  private timer: NodeJS.Timeout = null as any
}
```

#### 构造函数

需要传入棋盘的大小(size)，对应渲染的canvas元素(canvas)，以及棋盘的padding值

#### 单元格的大小计算

横向的xGap = 3px,

```typescript
this.xGap = 3
const cellSize = (this.canvas.width - this.padding * 2 - this.xGap * (this.size - 1)) / (this.size + 0.5)
const yGap = (this.canvas.width - this.padding * 2 - this.size * cellSize) / (this.size - 1)
```

#### 生成棋盘

在不同位置生成随机的障碍物，小猫最开始在棋盘的正中心

```typescript
  private generateBoard() {
    const size = this.size
    this.board = Array.from({ length: size }, () => Array.from({ length: size }, () => false))
    const catPos = Math.floor(size / 2)
    this.catPos = {
      x: catPos,
      y: catPos,
    }
    for (let i = 0; i < size + getRandomInt(0, 5); i++) {
      while (true) {
        const x = getRandomInt(0, size - 1)
        const y = getRandomInt(0, size - 1)
        if (x === catPos && y === catPos) {
          continue
        }
        this.board[y][x] = true
        break
      }
    }
  }
```

#### 处理点击事件

首先通过[bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)函数解决this指向问题

```typescript
  private addEventListener() {
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.canvas.addEventListener('mousemove', this.handleMousemove)
    this.canvas.addEventListener('click', this.handleClick)
  }
```

首先根据鼠标点击的(x, y)确定点击的是否是有效的单元格，以及对应单元格的(x,y)下标

公式推理：

```txt
0: padding <= y <= padding + cellSize
1: padding + cellSize + yGap <= y <= padding + cellSize * 2 + yGap
2: padding + cellSize * 2 + yGap * 2 <= y <= padding + cellSize * 3 + yGap * 2
x: padding + cellSize * x + yGap * x <= y <= padding + cellSize * (x + 1) + yGap * x
```

采用数学归纳法可知，给定任意纵向偏移距离y，纵向下标x有下列不等式

```txt
padding + cellSize * x + yGap * x <= y <= padding + cellSize * (x + 1) + yGap * x 
```

所以：

​    `x <= (y - padding) / (cellSize + yGap)`

且`x >= (y - padding - cellSize) / (cellSize + yGap)`

因为x为非负整数，于是可用`floor`和`ceil`函数计算得到x，判断二者是否相同，如果相同且在边界范围内，则说明有效。同理可计算出对应的x的下标(注意如果是奇数列，padding要加一半的cellSize)

```typescript
  private calcPosIndex(x: number, y: number): undefined | { x: number; y: number } {
    const numberY1 = Math.floor((y - this.padding) / (this.cellSize + this.yGap))
    const numberY2 = Math.ceil((y - this.padding - this.cellSize) / (this.cellSize + this.yGap))
    if (numberY1 === numberY2 && numberY1 >= 0 && numberY1 < this.size) {
      const isOdd = numberY1 % 2 === 1
      const extraX = isOdd ? this.cellSize / 2 : 0
      const numberX1 = Math.floor((x - this.padding - extraX) / (this.cellSize + this.xGap))
      const numberX2 = Math.ceil((x - this.padding - this.cellSize - extraX) / (this.cellSize + this.xGap))
      if (numberX1 === numberX2 && numberX1 >= 0 && numberX1 < this.size) {
        return { x: numberX1, y: numberY1 }
      }
    }
  }
```

#### bfs计算最短路径

每次点击之后，利用广度优先搜索算法来求得最短路径。

实现逻辑：首先将当前小猫的位置添加至队列中。循环中每次取出第一个元素，首先判断是否到达了边界，到达则说明该路径是可行的，返回下一步的位置(每一步的节点，记录parent的节点，来记录完整的行走路径)。不是边界点，则遍历所有的可选方向，将范围内的有效点添加至队列中。

注意：

- 可选方向包括6个方位，奇偶列的可选方向不同
- 为了防止死循环，需要将每次走过的点记录下来，防止重复

```typescript
interface Point {
  x: number
  y: number
  parent?: Point
}

export function bfs(board: boolean[][], x: number, y: number, boardSize: number) {
  const queue: Point[] = [{ x, y }]
  const map = new Map<string, boolean>()
  while (queue.length > 0) {
    const current = queue.shift()!
    const { x, y } = current
    map.set(`${x}:${y}`, true)
    if (x === 0 || x === boardSize - 1 || y === 0 || y === boardSize - 1) {
      let p = current
      let last = p
      while (p.parent) {
        last = p
        p = p.parent
      }
      return last
    }
    const v = y % 2 === 1 ? 1 : -1
    const directions = [
      [-1, 0],
      [-1, v],
      [0, -1],
      [0, 1],
      [1, 0],
      [1, v],
    ]
    for (const dir of directions) {
      const dy = y + dir[0]
      const dx = x + dir[1]
      if (0 <= dy && dy < boardSize && 0 <= dx && dx < boardSize && !board[dy][dx] && !map.get(`${dx}:${dy}`)) {
        queue.push({ x: dx, y: dy, parent: current })
      }
    }
  }
}
```

#### 绘制动态的小猫

现有如下的精灵图，每一个部分都是一个动作。通过不断循环绘制不同部分的小猫，实现让视觉上小猫左右晃动的效果。

```typescript
  private drawCat(idx: number) {
    const { x, y } = this.getCatRectStartXY()
    this.clearCatRect(x, y)
    this.drawCell(this.catPos.x, this.catPos.y, BoardColor.ChessEmpty)
    const { width, height } = imageItem
    const imageItemX = width * (idx % 4)
    const imageItemY = height * Math.floor(idx / 4)
    this.ctx.drawImage(this.cat, imageItemX, imageItemY, width, height, x, y, this.cellSize, this.cellSize)
    this.timer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.drawCat((idx + 1) % 15)
      })
    }, 100)
  }
```

## 效果图

![动画1](./neurocat\动画1.gif)

## 打包后的html

[html](./neurocat/index.html)