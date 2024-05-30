const axios = require('axios')
const fs = require('fs')

async function download(url, cookie, outputPath) {
  const resp = await axios.get(url, {
    headers: {
      cookie,
    },
    responseType: 'stream',
  })
  const writer = fs.createWriteStream(outputPath)
  resp.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = {
  download,
}
