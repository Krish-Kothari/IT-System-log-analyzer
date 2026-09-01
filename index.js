const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`🛡️  Welcome to the CRPF Central Log Analyzer 🛡️\n`);

rl.question('Enter the path to the log file (e.g., ./system.log): ', (filePath) => {
  console.log(`\n[*] Target set to: ${filePath}`);
  console.log(`[*] Initializing analysis...\n`);
  
  rl.close();
});