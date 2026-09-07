const readline = require('readline');
const chalk = require('chalk');
const Table = require('cli-table3');
const { spawn } = require('child_process'); // Imported for audio playback
const { readLogs } = require('./reader');
const { parseLogLines } = require('./parser');
const { detectThreats } = require('./analyzer');
const { generateReport } = require('./reporter');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.cyan.bold(`
=================================================
  🛡️  CRPF CENTRALIZED IT LOG ANALYZER  🛡️
=================================================
`));

rl.question(chalk.yellow('Enter the path to the log file (e.g., ./system.log): '), async (filePath) => {
  try {
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

    console.log(chalk.bold.magenta('\n--- SYSTEM LOG PREVIEW ---'));
    console.log(logTable.toString());

    if (threats.length > 0) {
      console.log(chalk.bgRed.white.bold(`\n 🚨 DETECTED ${threats.length} THREAT(S)! `));
      
      const threatTable = new Table({
        head: [chalk.red('Threat Type'), chalk.red('Attacker IP'), chalk.red('Failed Attempts')]
      });

      threats.forEach(threat => {
        threatTable.push([threat.type, threat.ip, threat.attempts]);
      });

      console.log(threatTable.toString());

      // Trigger the warning sound
      console.log(chalk.yellow('🔊 Playing threat detection alarm...'));
      spawn("afplay", ["./sounds/faah.mp3"]); 
      
    } else {
      console.log(chalk.bgGreen.black.bold('\n ✅ NO THREATS DETECTED '));
    }

    await generateReport(threats);
    console.log(chalk.green(`\n[+] Analysis complete. You can now close the application.`));

  } catch (error) {
    console.log(chalk.bgRed.white(`\n[!] Application Error: ${error.message} `));
  } finally {
    rl.close();
  }
});