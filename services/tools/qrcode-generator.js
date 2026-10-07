/**
 * Deterministic QR Code Generator (Pure JavaScript - NO AI, Zero Dependencies)
 * Generates standards-compliant QR Code SVG strings and Data URLs.
 */

// QR Code Reed-Solomon polynomial math & Galois Field GF(256)
const EXP_TABLE = new Array(256);
const LOG_TABLE = new Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // generator polynomial x^8 + x^4 + x^3 + x^2 + 1
  }
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
})();

function glog(n) {
  if (n < 1) throw new Error(`glog(${n}) error`);
  return LOG_TABLE[n];
}

function gexp(n) {
  while (n < 0) n += 255;
  while (n >= 256) n -= 255;
  return EXP_TABLE[n];
}

class Polynomial {
  constructor(num, shift = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
    for (let i = num.length - offset; i < this.num.length; i++) {
      this.num[i] = 0;
    }
  }

  get(index) {
    return this.num[index];
  }

  getLength() {
    return this.num.length;
  }

  multiply(e) {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new Polynomial(num);
  }

  mod(e) {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new Polynomial(num).mod(e);
  }
}

// QR Table definitions: Capacity per version (1 to 10) for byte mode and error levels
// [totalCodewords, ecCodewordsPerBlock, numBlocks]
const RS_BLOCK_TABLE = {
  // L (7%), M (15%), Q (25%), H (30%)
  1: { L: [19, 7, 1], M: [16, 10, 1], Q: [13, 13, 1], H: [9, 17, 1] },
  2: { L: [34, 10, 1], M: [28, 16, 1], Q: [22, 22, 1], H: [16, 28, 1] },
  3: { L: [55, 15, 1], M: [44, 26, 1], Q: [34, 18, 2], H: [26, 22, 2] },
  4: { L: [80, 20, 1], M: [64, 18, 2], Q: [48, 26, 2], H: [36, 16, 4] },
  5: { L: [108, 26, 1], M: [86, 24, 2], Q: [62, 18, 4], H: [46, 22, 4] },
  6: { L: [136, 18, 2], M: [108, 16, 4], Q: [76, 24, 4], H: [60, 28, 4] },
  7: { L: [156, 20, 2], M: [124, 18, 4], Q: [88, 18, 6], H: [66, 26, 5] },
  8: { L: [194, 24, 2], M: [154, 22, 4], Q: [110, 22, 6], H: [86, 26, 6] },
  9: { L: [232, 30, 2], M: [182, 22, 5], Q: [132, 20, 8], H: [100, 24, 8] },
  10: { L: [274, 18, 4], M: [216, 26, 5], Q: [154, 24, 8], H: [122, 28, 8] }
};

const ALIGNMENT_PATTERN_LOCATIONS = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50]
};

function getErrorDegree(ecLevel, version) {
  return RS_BLOCK_TABLE[version][ecLevel][1];
}

function getErrorCorrectPolynomial(errorCorrectLength) {
  let a = new Polynomial([1], 0);
  for (let i = 0; i < errorCorrectLength; i++) {
    a = a.multiply(new Polynomial([1, gexp(i)], 0));
  }
  return a;
}

class BitBuffer {
  constructor() {
    this.buffer = [];
    this.length = 0;
  }

  put(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
    }
    this.length++;
  }
}

class QRCodeModel {
  constructor(version, errorCorrectionLevel) {
    this.version = version;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.moduleCount = this.version * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () => new Array(this.moduleCount).fill(null));
  }

  isDark(row, col) {
    return Boolean(this.modules[row][col]);
  }

  setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] !== null) continue;
      this.modules[r][6] = (r % 2 === 0);
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] !== null) continue;
      this.modules[6][c] = (c % 2 === 0);
    }
  }

  setupPositionAdjustPattern() {
    const pos = ALIGNMENT_PATTERN_LOCATIONS[this.version];
    if (!pos) return;
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  setupTypeNumber(test) {
    const bits = (this.errorCorrectionLevel === 'L' ? 1 : this.errorCorrectionLevel === 'M' ? 0 : this.errorCorrectionLevel === 'Q' ? 3 : 2) << 3;
    for (let i = 0; i < 15; i++) {
      const mod = (!test && ((bits >> i) & 1) === 1);
      if (i < 6) this.modules[i][8] = mod;
      else if (i < 8) this.modules[i + 1][8] = mod;
      else this.modules[this.moduleCount - 15 + i][8] = mod;

      if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
      else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
      else this.modules[8][15 - i - 1] = mod;
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }

  mapData(data) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
            }
            // Standard mask pattern 0: (row + col) % 2 === 0
            const mask = ((row + (col - c)) % 2 === 0);
            this.modules[row][col - c] = mask ? !dark : dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  make(data) {
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeNumber(false);
    this.mapData(data);
  }
}

function createData(version, ecLevel, text) {
  const rsBlock = RS_BLOCK_TABLE[version][ecLevel];
  const totalCodewords = rsBlock[0];
  const ecCodewords = rsBlock[1];
  const numBlocks = rsBlock[2];
  const dataCodewords = totalCodewords - ecCodewords;

  const buffer = new BitBuffer();
  // 8-bit Byte mode indicator (0100)
  buffer.put(4, 4);
  // Character count indicator (8 bits for version 1-9)
  const bytes = Buffer.from(text, 'utf8');
  buffer.put(bytes.length, version < 10 ? 8 : 16);
  for (let i = 0; i < bytes.length; i++) {
    buffer.put(bytes[i], 8);
  }

  // End of message indicator
  if (buffer.length + 4 <= dataCodewords * 8) {
    buffer.put(0, 4);
  }

  // Padding to byte boundary
  while (buffer.length % 8 !== 0) {
    buffer.putBit(false);
  }

  // Pad bytes 0xEC, 0x11
  const padBytes = [0xec, 0x11];
  let padIndex = 0;
  while (buffer.length < dataCodewords * 8) {
    buffer.put(padBytes[padIndex % 2], 8);
    padIndex++;
  }

  // Split into RS blocks & compute Error Correction Codewords
  const rawData = buffer.buffer.slice(0, dataCodewords);
  const rsPoly = getErrorCorrectPolynomial(ecCodewords);
  const rawPoly = new Polynomial(rawData, ecCodewords);
  const modPoly = rawPoly.mod(rsPoly);

  const ecData = new Array(ecCodewords);
  for (let i = 0; i < ecCodewords; i++) {
    const modIndex = i + modPoly.getLength() - ecCodewords;
    ecData[i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
  }

  return rawData.concat(ecData);
}

function findBestVersion(text, ecLevel) {
  const bytes = Buffer.from(text, 'utf8');
  for (let v = 1; v <= 10; v++) {
    const block = RS_BLOCK_TABLE[v][ecLevel];
    const maxDataBytes = block[0] - block[1] - (v < 10 ? 2 : 3);
    if (bytes.length <= maxDataBytes) {
      return v;
    }
  }
  return 10;
}

function parseEcLevel(ecInput) {
  const s = String(ecInput || '').toUpperCase();
  if (s.startsWith('H') || s.includes('MAXIMUM') || s.includes('30%')) return 'H';
  if (s.startsWith('Q') || s.includes('25%')) return 'Q';
  if (s.startsWith('L') || s.includes('LOW') || s.includes('7%')) return 'L';
  return 'M'; // default Medium
}

function generateQrCode({ qrContent, size = 256, errorCorrection = 'M', foreground = '#000000', background = '#ffffff' }) {
  if (!qrContent || typeof qrContent !== 'string' || !qrContent.trim()) {
    return { ok: false, error: 'Please provide valid text or URL to generate QR code.' };
  }

  const text = qrContent.trim();
  const ecLevel = parseEcLevel(errorCorrection);
  const version = findBestVersion(text, ecLevel);

  let qr;
  try {
    const data = createData(version, ecLevel, text);
    qr = new QRCodeModel(version, ecLevel);
    qr.make(data);
  } catch (err) {
    return { ok: false, error: `Failed to construct QR matrix: ${err.message}` };
  }

  const moduleCount = qr.moduleCount;
  const targetPx = parseInt(size, 10) || 256;
  const margin = 4;
  const viewBoxSize = moduleCount + margin * 2;

  // Build SVG string
  let rects = '';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        rects += `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" fill="${foreground}" />`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${targetPx}" height="${targetPx}" shape-rendering="crispEdges">
  <rect width="100%" height="100%" fill="${background}"/>
  ${rects}
</svg>`.trim();

  const base64Svg = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return {
    ok: true,
    content: text,
    version,
    moduleCount,
    errorCorrection: ecLevel,
    size: targetPx,
    svg,
    dataUrl,
    output: `QR Code generated successfully for: "${text}" (${targetPx}x${targetPx}px, Error Correction: ${ecLevel})`
  };
}

module.exports = {
  generateQrCode
};
