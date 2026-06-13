const fs = require('fs').promises;
const path = require('path');
const Papa = require('papaparse');

async function ensureCsvFile(filePath, headers) {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!exists) {
      const headerLine = headers.join(',') + '\n';
      await fs.writeFile(filePath, headerLine, 'utf8');
    }
  } catch (err) {
    throw new Error(`Cannot ensure CSV file ${filePath}: ${err.message}`);
  }
}

async function readCsv(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    return parsed.data;
  } catch (err) {
    throw new Error(`Cannot read CSV file ${filePath}: ${err.message}`);
  }
}

async function appendCsv(filePath, row, headers) {
  try {
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!exists) {
      await ensureCsvFile(filePath, headers);
    }
    const stringified = Papa.unparse([row], { header: false });
    await fs.appendFile(filePath, stringified + '\n', 'utf8');
  } catch (err) {
    throw new Error(`Cannot append to CSV file ${filePath}: ${err.message}`);
  }
}

async function writeCsv(filePath, rows, headers) {
  try {
    const stringified = Papa.unparse(rows, { columns: headers });
    await fs.writeFile(filePath, stringified + '\n', 'utf8');
  } catch (err) {
    throw new Error(`Cannot write CSV file ${filePath}: ${err.message}`);
  }
}

module.exports = {
  ensureCsvFile,
  readCsv,
  appendCsv,
  writeCsv
};
