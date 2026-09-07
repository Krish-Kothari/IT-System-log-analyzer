const fs = require('fs').promises;

async function generateReport(threats) {
  const report = {
    generatedAt: new Date().toISOString(),
    totalThreats: threats.length,
    details: threats
  };

  try {
    await fs.appendFile('threat_report.json', `${JSON.stringify(report)}\n`);
    console.log(`[+] Report successfully saved to threat_report.json`);
  } catch (err) {
    console.error(`[!] Failed to write report:`, err);
  }
}

module.exports = { generateReport };