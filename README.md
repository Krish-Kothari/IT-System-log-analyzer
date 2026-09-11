# CRPF Central Log Analyzer

A lightweight Node.js command-line application for analyzing IT system logs and identifying repeated suspicious activity by source IP address. The analyzer reads a log file, extracts useful metadata, applies a simple brute-force detection rule, and writes the results as JSON.

## Features

- Reads log files line by line with a stream, avoiding the need to load the entire file into memory at once.
- Evaluates payloads against advanced cybersecurity threat signatures to dynamically classify attacks, including SQL Injection (SQLi), Cross-Site Scripting (XSS), and brute-force authentication failures.
- Extracts IPv4 addresses from unstructured log messages.
- Flags a potential brute-force attack when one IP produces more than three suspicious entries.
- Displays detected threats in the terminal and saves a machine-readable report.
- Generates a SHA-256 cryptographic hash of the log file and appends it to an immutable ledger, simulating blockchain integrity verification.
- Provides basic network threat intelligence by categorizing source IP addresses as either Internal/Insider threats (e.g., 192.168.x.x, 10.x.x.x) or External/Foreign network threats.
- Automatically compresses analyzed log files using Node.js native zlib streams (.gz) for secure, space-efficient forensic archiving.

## Prerequisites

- Node.js 14 or later.
- No external npm packages are required.

## Installation

1. Clone this repository.
2. Open a terminal in the project directory.

```bash
git clone <repository-url>
cd IT-System-log-analyzer
```

## Usage

The repository includes `system.log` for testing. Start the application with:

```bash
node index.js
```

When prompted, enter the path to a log file:

```text
Enter the path to the log file (e.g., ./system.log): ./system.log
```

The sample file contains four failed login entries from `192.168.1.50`, so it produces one potential brute-force threat. The report is written to `threat_report.json` in the project directory.

## Input Format

The parser accepts plain-text logs with one event per line. A line is treated as suspicious when it contains `error` or `failed`. Any IPv4 address in the line is used as the source IP.

Example:

```text
ERROR: Failed password for root from 192.168.1.50 port 22
INFO: User admin logged in from 10.0.0.5
```

Lines without an IP address are still parsed, but they cannot be grouped into a threat. Blank lines are ignored by the file reader.

## Detection Logic

1. `reader.js` streams the input file and collects non-empty lines.
2. parser.js scans lines for generic error flags and specific regex signatures (SQLi, XSS), extracting the first IPv4 address.
3. `analyzer.js` counts suspicious entries for each known IP using a JavaScript `Map`.
4. An IP is reported as `Potential Brute Force` when its suspicious-entry count is greater than `3`.
5. `reporter.js` appends the final report asynchronously with `fs.promises`.
6. archiver.js automatically compresses the raw log file into a .gz archive to save disk space while preserving forensic data.

## Output

The application prints the number of detected threats and a table in the terminal. It also appends one JSON object per run to `threat_report.json` using the JSON Lines format. Existing reports are preserved.

```jsonl
{"generatedAt":"2026-09-07T12:00:00.000Z","crpfUnit":"CRPF-DELHI-01","totalThreats":1,"details":[{"ip":"192.168.1.50","origin":"Internal / Insider Threat","attempts":4,"type":"Potential Brute Force"}]}
```

Each line is a separate report, and `generatedAt` is generated at runtime, so its value will differ on each execution. To process the history, read the file line by line and parse each non-empty line as JSON.

Additionally, a cryptographic record is appended to blockchain_ledger.txt containing the timestamp, CRPF Unit ID, and the SHA-256 hash of the processed log file.

## Project Structure

| File | Responsibility |
| --- | --- |
| `index.js` | CLI prompt and analysis workflow |
| `reader.js` | Asynchronous line-by-line file reading |
| `parser.js` | Suspicious-entry and IPv4 extraction |
| `analyzer.js` | Per-IP counting and threat classification |
| `reporter.js` | JSON report generation |
| `system.log` | Sample input log |
| `blockchain_ledger.txt` | Immutable record of analyzed file hashes |
| `archiver.js` | zlib-based log file compression |

## Current Limitations

- Detection is heuristic and does not validate whether an event is a real attack.
- Only IPv4 addresses are extracted.
- The threshold and suspicious keywords are currently fixed in the source code.
