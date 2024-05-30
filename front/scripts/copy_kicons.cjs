const { download } = require('./downloadFile.cjs')
const path = require('path')
const fs = require('fs')

async function main() {
  const url = 'https://kdesign.kdocs.cn/icons/static/js/app.088d75611fccaa786757.js'
  const cookie = 'wps_sid=V02S5PycDbMSQXbkoHcViUzqIaKE6tE00a771589005a08feb7;'
  const jsFilePath = path.join(__dirname, 'result.js')
  try {
    await download(url, cookie, jsFilePath) // 下载文件
    const jsStr = await fs.promises.readFile(jsFilePath, { encoding: 'utf-8' })
    const regex = /.*?exports=(\[.*id:\d+,name:.*?\])},.*?function.*/
    const array = jsStr.match(regex)[1]
    const data = eval(array)
    const metaPath = path.join(__dirname, '../src/assets/k-icons')
    await fs.promises.mkdir(metaPath, { recursive: true })
    await fs.promises.writeFile(path.join(metaPath, 'meta.json'), JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  } finally {
    await fs.promises.unlink(jsFilePath)
  }
}

main()
