const fs = require('fs')
const path = require('path')

// 将posts目录下的所有文件，复制到public目录
async function copyFiles(srcDir, destDir) {
  const list = await fs.promises.readdir(srcDir, { withFileTypes: true })
  for (const dirent of list) {
    const src = path.resolve(srcDir, dirent.name)
    const dest = path.resolve(destDir, dirent.name)
    if (dirent.isDirectory()) {
      await fs.promises.mkdir(dest, { recursive: true })
      await copyFiles(src, dest)
    } else if (dirent.isFile() && path.extname(src) !== '.md') {
      await fs.promises.copyFile(src, dest)
    }
  }
}

async function main() {
  const postsDir = path.resolve(__dirname, '../posts')
  const publicDir = path.resolve(__dirname, '../public')
  await copyFiles(postsDir, publicDir)
}

main()
