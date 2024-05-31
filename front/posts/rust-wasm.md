---
title: rust-wasm项目搭建
tags: ['wasm', 'rust']
ctime: 2024-5-31 17:58
mtime: 2024-5-31 17:58
---



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
[lib]
crate-type = ["cdylib", "rlib"]

# Tell `rustc` to optimize for small code size.
[profile.release]
opt-level = "s"
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
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [wasm()],
})

```

