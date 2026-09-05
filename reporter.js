const fs = require('fs').promises;

async function generateReport(threats) {
  const report = {
    generatedAt: new Date().toISOString(),
    totalThreats: threats.length,
    details: threats
  };

  try {
    await fs.writeFile('threat_report.json', JSON.stringify(report, null, 2));
    console.log(`[+] Report successfully saved to threat_report.json`);
  } catch (err) {
    console.error(`[!] Failed to write report:`, err);
  }
}

module.exports = { generateReport };