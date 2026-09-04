function detectThreats(parsedLogs) {
  const ipCounts = new Map();
  const threats = [];

  parsedLogs.forEach((log) => {
    if (log.isSuspicious && log.sourceIp !== 'Unknown') {
      const currentCount = ipCounts.get(log.sourceIp) || 0;
      ipCounts.set(log.sourceIp, currentCount + 1);
    }
  });
  ipCounts.forEach((count, ip) => {
    if (count > 3) {
      threats.push({
        ip: ip,
        attempts: count,
        type: 'Potential Brute Force'
      });
    }
  });

  return threats;
}

module.exports = { detectThreats };