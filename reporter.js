const fs = require('fs').promises;

async function generateReport(reportData) {
  const report = {
    generatedAt: new Date().toISOString(),
    crpfUnit: reportData.unit.toUpperCase(),
    fileIntegrityHash: reportData.hash,
    totalThreats: reportData.threats.length,
    details: reportData.threats
  };

  try {
    // Saves report with the unit name (e.g., CRPF-J&K-01_report.json)
    const fileName = `${reportData.unit.toUpperCase()}_threat_report.json`;
    await fs.writeFile(fileName, JSON.stringify(report, null, 2));
    console.log(`[+] Report successfully saved to ${fileName}`);
  } catch (err) {
    console.error(`[!] Failed to write report:`, err);
  }
}

async function appendToLedger(crpfUnit, fileHash) {
  const ledgerEntry = `${new Date().toISOString()} | UNIT: ${crpfUnit} | SHA-256: ${fileHash}\n`;
  try {
    await fs.writeFile('blockchain_ledger.txt', ledgerEntry, { flag: 'a' });
    console.log(`[+] Hash securely committed to immutable ledger.`);
  } catch (err) {
    console.error(`[!] Failed to update ledger:`, err);
  }
}

module.exports = { generateReport, appendToLedger };