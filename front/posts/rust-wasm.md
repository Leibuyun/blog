---
title: rust-wasm项目搭建
tags: ['wasm', 'rust']
ctime: 2024-5-31 17:58
mtime: 2024-5-31 17:58
---

创建 rust 项目，并将其编译为 wasm，掌握最基本的流程 ✅。但是我参与的项目中，wasm 使用的非常少（几乎为 0），官网的教程一套走下来，也没觉得 wasm 有什么特别之处，对性能这部分感受不是很深刻 😅。后续得写点实际的 demo😋。

<!-- more -->

# rust-wasm

## 一. 前缀准备

1. [rust 工具链](https://www.rust-lang.org/tools/install) ， `rustc`、`rustup`、`cargo`

2. `wasm-pack`

   ```shell
   cargo install wasm-pack
   ```

3. `cargo-generate`

   ```
   cargo install cargo-generate
   ```

4. `npm`

## 二. 项目搭建

```
cargo new project_name
cargo wasm-bindgen
```

配置`cargo.toml`

```toml
[dependencies]
wasm-bindgen = "0.2.92"

[lib]
crate-type = ["cdylib", "rlib"]

# Tell `rustc` to optimize for small code size.
[profile.release]
opt-level = "s"

```

lib.rs

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-game-of-life!");
}
```



## 项目构建

```shell
wasm-pack build
```

## 前端使用

```shell
pnpm add vite-plugin-wasm
```

`vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { viteSingleFile } from 'vite-plugin-singlefile'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
  },
})

```

### bug

开发环境下调用下列代码会报错，但打包后正常

```typescript
import { Board } from 'wasm-cat'
import { memory } from 'wasm-cat/cat_wasm_bg.wasm'

const cells = new Uint8Array(memory.buffer, cellsPtr, row * col) // 报错
```



# rust 常用模块

## 随机数

```toml
getrandom = { version = "0.2.15", features = ["js"] }
rand = "0.8.5"
```

```rust
use rand::Rng;

pub fn generate_random_number(min: usize, max: usize) -> usize {
    let mut rng = rand::thread_rng();
    rng.gen_range(min..max)
}
```

