/**
 * JSON Formatter & Validator Service (Deterministic - NO AI)
 */

function formatJson({ jsonInput, indent = '2 Spaces', sortKeys = false }) {
  if (typeof jsonInput !== 'string' || !jsonInput.trim()) {
    return {
      ok: false,
      error: 'Please provide a non-empty JSON string to format.'
    };
  }

  const raw = jsonInput.trim();

  // Try to parse JSON
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // Pinpoint error line and position
    const errorDetails = extractErrorPosition(raw, err.message);
    return {
      ok: false,
      error: `Invalid JSON syntax: ${err.message}`,
      errorLocation: errorDetails,
      valid: false
    };
  }

  // Optional sort keys recursively
  if (sortKeys === true || sortKeys === 'true') {
    parsed = sortObjectKeys(parsed);
  }

  // Determine indentation
  let spaceStr = 2;
  const ind = (indent || '').toLowerCase();
  if (ind.includes('4')) spaceStr = 4;
  else if (ind.includes('tab')) spaceStr = '\t';
  else if (ind.includes('0') || ind.includes('minify') || ind.includes('compact')) spaceStr = 0;

  const formatted = JSON.stringify(parsed, null, spaceStr);
  const rawBytes = Buffer.byteLength(raw, 'utf8');
  const formattedBytes = Buffer.byteLength(formatted, 'utf8');
  const lineCount = formatted.split('\n').length;

  return {
    ok: true,
    valid: true,
    output: formatted,
    stats: {
      originalBytes: rawBytes,
      formattedBytes: formattedBytes,
      characterCount: formatted.length,
      lineCount: lineCount,
      sizeDiffPercent: rawBytes > 0 ? (((formattedBytes - rawBytes) / rawBytes) * 100).toFixed(1) + '%' : '0%'
    }
  };
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

function extractErrorPosition(str, errorMsg) {
  let line = 1;
  let column = 1;
  let position = -1;

  // Match standard V8 error pattern: "at position X"
  const posMatch = errorMsg.match(/at position (\d+)/i);
  if (posMatch) {
    position = parseInt(posMatch[1], 10);
  } else {
    // Match line/column pattern if present
    const lineColMatch = errorMsg.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      return {
        line: parseInt(lineColMatch[1], 10),
        column: parseInt(lineColMatch[2], 10),
        snippet: ''
      };
    }
  }

  if (position >= 0) {
    const lines = str.slice(0, position).split('\n');
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  }

  // Build snippet around the error line
  const allLines = str.split('\n');
  const errorLineStr = allLines[line - 1] || '';
  const snippet = `${errorLineStr}\n${' '.repeat(Math.max(0, column - 1))}^`;

  return { line, column, position, snippet };
}

module.exports = {
  formatJson
};
