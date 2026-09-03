# CRPF Central Log Analyzer

A lightweight, interactive Node.js Command Line Interface (CLI) application designed to ingest and analyze IT system logs for threat detection.

## Prerequisites
* Node.js installed on your machine.

## Installation
1. Clone this repository to your local environment.
2. Navigate to the project directory.

## Usage
Run the main script to start the interactive prompt:
```bash
node index.js
```markdown
## System Architecture
### 1. Non-Blocking File Ingestion
The application utilizes Node.js `fs.createReadStream` and the `readline` module to read log files line-by-line. This asynchronous approach ensures the application can handle massive log files without consuming excessive RAM.

### 2. Regex Parsing Engine
Raw text lines are passed through a parsing module that uses Regular Expressions (Regex) to extract structured metadata. Currently, the parser identifies error flags and extracts source IP addresses from unstructured text.