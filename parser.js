function parseLogLines(rawLines) {
  const parsedData = [];
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

  rawLines.forEach((line) => {
    const hasError = line.toLowerCase().includes('error') || line.toLowerCase().includes('failed');
    const ipMatch = line.match(ipRegex);

    parsedData.push({
      rawText: line,
      isSuspicious: hasError,
      sourceIp: ipMatch ? ipMatch[0] : 'Unknown',
      timestamp: new Date().toISOString()
    });
  });

  return parsedData;
}

module.exports = { parseLogLines };