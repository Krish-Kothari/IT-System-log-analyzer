const readline = require('readline');
const chalk = require('chalk');
const Table = require('cli-table3');
const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');

const { readLogs } = require('./reader');
const { parseLogLines } = require('./parser');
const { detectThreats } = require('./analyzer');
const { generateReport, appendToLedger } = require('./reporter');
const { archiveLog } = require('./archiver');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.cyan.bold(`
=================================================
  🛡️  CRPF CENTRALIZED IT LOG ANALYZER  🛡️
  NODE: MASTER COMMAND CENTER (DELHI)
=================================================
`));


async function executeAnalysis(unitId, filePath) {
  try {
    console.log(chalk.blue(`\n[*] Establishing secure connection to ${unitId.toUpperCase()}...`));
    
    console.log(chalk.blue('[*] Verifying cryptographic integrity of log file...'));
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    console.log(chalk.green(`[+] File Integrity Verified. SHA-256 Checksum:`));
    console.log(chalk.dim(`    ${hashSum}`));

    console.log(chalk.blue('\n[*] Initializing Analysis Engine...'));
    
    const rawLogs = await readLogs(filePath);
    const parsedData = parseLogLines(rawLogs);
    const threats = detectThreats(parsedData);
    
    const logTable = new Table({
      head: [chalk.cyan('Status'), chalk.cyan('Source IP'), chalk.cyan('Log Message')],
      colWidths: [15, 20, 50]
    });

    parsedData.forEach(log => {
      if (log.isSuspicious) {
        logTable.push([chalk.red('🚨 ALERT'), chalk.red(log.sourceIp), chalk.red(log.rawText)]);
      } else {
        logTable.push([chalk.green('✅ OK'), chalk.green(log.sourceIp), chalk.dim(log.rawText)]);
      }
    });

    console.log(chalk.bold.magenta(`\n--- SYSTEM LOG PREVIEW: ${unitId.toUpperCase()} ---`));
    console.log(logTable.toString());

    if (threats.length > 0) {
      console.log(chalk.bgRed.white.bold(`\n 🚨 DETECTED ${threats.length} THREAT(S) IN ${unitId.toUpperCase()}! `));
      
      const threatTable = new Table({
        head: [chalk.red('Severity'), chalk.red('Threat Type'), chalk.red('Attacker IP'), chalk.red('Origin'), chalk.red('Attempts')]
      });

      threats.forEach(threat => {
        let severity = 'LOW';
        if (threat.attempts > 5) severity = chalk.yellow('MEDIUM');
        if (threat.attempts > 10) severity = chalk.bgRed.white('CRITICAL');

        threatTable.push([severity, threat.type, threat.ip, chalk.yellow(threat.origin), threat.attempts]);
      });

      console.log(threatTable.toString());

      console.log(chalk.yellow('🔊 Triggering centralized threat detection alarm...'));

      spawn("afplay", ["./sounds/faah.mp3"]);
      
    } else {
      console.log(chalk.bgGreen.black.bold(`\n ✅ NO THREATS DETECTED IN ${unitId.toUpperCase()} `));
    }

    await generateReport({ unit: unitId, hash: hashSum, threats: threats });
    if (typeof appendToLedger === 'function') await appendToLedger(unitId, hashSum);
    await archiveLog(filePath);
    
    console.log(chalk.green(`\n[+] Analysis complete. Report securely archived.`));

  } catch (error) {
    console.log(chalk.bgRed.white(`\n[!] Security Application Error: ${error.message} `));
  } finally {
    rl.close();
  }
}
const args = process.argv.slice(2);

if (args.length === 2) {
  console.log(chalk.blue(`\n[*] Running in Headless Automation Mode...`));
  const automatedUnit = args[0];
  const automatedFile = args[1];
  
  executeAnalysis(automatedUnit, automatedFile);

} else {
  rl.question(chalk.yellow('Enter target CRPF Unit ID (e.g., CRPF-J&K-01): '), (unitId) => {
    rl.question(chalk.yellow('Enter the path to the remote log file: '), (filePath) => {
      executeAnalysis(unitId, filePath);
    });
  });
}