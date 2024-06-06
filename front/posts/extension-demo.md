---
title: crx插件项目搭建
tags: ['monorepo', 'vite', 'web']
ctime: 2024-6-6 17:34
mtime: 2024-6-6 17:34

---

`monorepo` + `pnpm` + `typescript` + `vite` 搭建chrome插件的开发环境✨

<!-- more -->

## 前言

最近在做浏览器插件相关部分的开发，用于集成文件传输工具。第一次做，记录一下开发的过程。

由于`crx`的部分是由`tauri`的前端代码直接迁移来的，但是web端无法执行`tauri`的`command`，只能通过http的接口来进行交互。于是就导致有大量的重复，因此这里想利用`monorepo`，抽离出公共的部分。让代码更好维护📝

## 项目结构划分

```
├─apps
│  └─trans-crx      
│      ├─dist       
│      │  └─assets  
│      ├─images     
│      ├─public     
│      └─src        
│          ├─assets 
│          │  ├─imgs
│          │  └─styles
│          ├─components
│          │  └─Launch
│          ├─hooks
│          ├─lib
│          ├─pages
│          │  ├─App
│          │  └─Popup
│          ├─store
│          └─utils
└─packages
    ├─chrome-tool
    ├─common
    │  ├─assets
    │  │  └─imgs
    │  ├─components
    │  │  ├─FileChooserBtn
    │  │  └─TaskItem
    │  ├─constants
    │  ├─types
    │  └─utils
    └─wpscore
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
  - 'apps/**'

```

### packages

#### wpscore

wpscore封装了安全客户端提供的相关能力，这里采用了单例模式

```typescript
export default class WpsCore {
  private static instance: WpsCore

  /**
   * 获取云文档的host，包括webpath
   *
   * eg:
   *   - https://v7.wpseco.cn
   *   - http://open.wpsyunlite.cn:9001/path
   */
  public async getWebpath() {
    let { webpath } = await chrome.wpscore.getCustomConfig()
    if (webpath.endsWith('/')) {
      webpath = webpath.slice(0, -1)
    }
    return webpath
  }

  /**
   * 获取安全浏览器的exe文件可执行路径
   *
   * eg:
   *  - C:\Users\Administrator\AppData\Local\Kingsoft\SecureDesktop\Application\1.0.50\secureclient.exe
   */
  public async getExecutablePath() {
    return (await chrome.wpscore.getExcutableInfo()).path
  }

  /**
   * 执行命令行
   *
   * eg:
   *  - `trans-server --host ${webpath} --port ${PORT} --url ${url} --path ${path}`
   */
  public async execCommand(command_line: string) {
    return chrome.wpscore.crxLaunchProcess({ command_line })
  }

  public static getInstance(): WpsCore {
    if (!WpsCore.instance) {
      WpsCore.instance = new WpsCore()
    }
    return WpsCore.instance
  }
}

```

#### chrome-tool

chrome-tool这个模块包括chrome自身能力的调用，以及封装了store，用于在content script、popup.html、以及background script中进行相应的调用

#### common

common模块包括前端的公共组件、工具函数等

### apps

#### trans-crx

浏览器插件相关

## 导入模块

一个模块安装另一个模块，只需要配置依赖来源为：workspace:*即可，包名及对应的另一个模块中package.json中设置的name属性，例如：

```json
// 模块chrome-tool
{
    "name": "chrome-tool",
}
```

```json
// trans-crx
{
    "dependencies": {
    "chrome-tool": "workspace:^",
    "common": "workspace:^",
    "wpscore": "workspace:^"
  },
}
```

## vite打包

vite.config.ts

核心部分主要包括两个部分，

### manifest.json的配置

写一个插件，用于修改并拷贝manifest.json文件

### 多入口

popup、background、content需要不同的入口，需要配置build.rollupOptions

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import svgr from 'vite-plugin-svgr'
import { fileURLToPath } from 'url'
import pkg from './package.json'
import manifest from './manifest.json'

const join = (...paths: string[]) => path.resolve(__dirname, ...paths)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    {
      name: 'copy_files_plugin',
      writeBundle(options, bundle) {
        const cssList = manifest['content_scripts'][0].css as string[]
        for (const bundleName in bundle) {
          if (bundleName.endsWith('.css')) {
            cssList.push(bundleName)
          }
        }
        // 复制manifest.json
        manifest.version = pkg.version
        fs.writeFileSync(
          join('./dist/manifest.json'),
          JSON.stringify(manifest, null, 2)
        )
        fs.copyFileSync(join(`./images/logo.png`), join('./dist', 'logo.png'))
        // 复制icons
        for (const name of Object.values(manifest.icons)) {
          fs.copyFileSync(join(`./images/${name}`), join('./dist', name))
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('index.html', import.meta.url)),
        popup: fileURLToPath(new URL('popup.html', import.meta.url)),
        content: fileURLToPath(new URL('./src/content.ts', import.meta.url)),
        contentCore: fileURLToPath(
          new URL('./src/contentCore.tsx', import.meta.url)
        ),
        background: fileURLToPath(
          new URL('./src/background.ts', import.meta.url)
        )
      },
      output: {
        inlineDynamicImports: false,
        entryFileNames(chunkInfo) {
          const normalList = ['popup', 'background', 'content', 'contentCore']
          if (normalList.includes(chunkInfo.name)) {
            return `[name].js`
          } else {
            return `[name].[hash].js`
          }
        }
      }
    }
  }
})

```

### 项目启动

开发阶段，使用watch模式

```json
 "scripts": {
    "build": "vite build",
    "dev": "vite build -w",
  },
```

## 子模块的typescript

配置tsconfig.json文件, 主要需要设置"moduleResolution": "bundler",

```json
{
  "compilerOptions": {
    "target": "es2016",                                  
    "module": "ES6",                                
    "esModuleInterop": true,                             
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "skipLibCheck": true ,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["index.ts", "wpscore.d.ts"],
}
