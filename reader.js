const fs = require('fs');
const readline = require('readline');

async function readLogs(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const logs = [];

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.trim() !== '') {
      logs.push(line);
    }
  }
  
  return logs;
}

module.exports = { readLogs };