const fs = require('fs');
const zlib = require('zlib');

function archiveLog(filePath) {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip();
    const source = fs.createReadStream(filePath);
    const destination = fs.createWriteStream(`${filePath}.gz`);

    source.pipe(gzip).pipe(destination)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err));
  });
}

module.exports = { archiveLog };