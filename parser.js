function parseLogLines(rawLines) {
  const parsedData = [];
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
  
  const sqlRegex = /(\b(SELECT|UNION|INSERT|DELETE|UPDATE)\b|' OR 1=1)/i;
  const xssRegex = /(<script>|javascript:|onerror=)/i;

  rawLines.forEach((line) => {
    const isSuspicious = line.toLowerCase().includes('error') || line.toLowerCase().includes('failed');
    let threatType = isSuspicious ? 'Auth Failure' : 'Safe';
    
    if (sqlRegex.test(line)) threatType = 'SQL Injection Attempt';
    if (xssRegex.test(line)) threatType = 'XSS Payload Detected';

    const ipMatch = line.match(ipRegex);

    parsedData.push({
      rawText: line,
      isSuspicious: isSuspicious || threatType !== 'Safe',
      threatType: threatType,
      sourceIp: ipMatch ? ipMatch[0] : 'Unknown',
      timestamp: new Date().toISOString()
    });
  });

  return parsedData;
}