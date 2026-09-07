const readline = require('readline');
const { readLogs } = require('./reader');
const { parseLogLines } = require('./parser');
const { detectThreats } = require('./analyzer');
const { generateReport } = require('./reporter');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`🛡️  Welcome to the CRPF Central Log Analyzer 🛡️\n`);

rl.question('Enter the path to the log file (e.g., ./system.log): ', async (filePath) => {
  try {
    console.log(`\n[*] Reading logs...`);
    const rawLogs = await readLogs(filePath);
    
    console.log(`[*] Parsing data...`);
    const parsedData = parseLogLines(rawLogs);
    
    console.log(`[*] Analyzing threats...`);
    const threats = detectThreats(parsedData);
    
    console.log(`\n🚨 Found ${threats.length} threats!`);
    console.table(threats);
    
    await generateReport(threats);
  } catch (error) {
    console.error(`\n[!] Application Error: ${error.message}`);
  } finally {
    rl.close();
  }
});