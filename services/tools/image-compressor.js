/**
 * Image Compressor Service (Deterministic / Client-Preferred - NO AI)
 * Server-side metadata inspector & Base64 processor helper.
 * Primary high-performance compression executes client-side via HTML5 Canvas.
 */

function processImageCompression({ imageBase64, quality = 'Balanced (70%)', maxDimension = 'Original Size' }) {
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return {
      ok: false,
      error: 'Please provide an image payload or upload an image file in your browser.'
    };
  }

  // Calculate approximate base64 payload size
  const stringLength = imageBase64.length - (imageBase64.indexOf(',') + 1);
  const originalBytes = Math.ceil((stringLength * 3) / 4);

  let qualityRatio = 0.7;
  if (quality.includes('85') || quality.includes('High')) qualityRatio = 0.85;
  else if (quality.includes('50') || quality.includes('Maximum')) qualityRatio = 0.5;

  const estimatedCompressedBytes = Math.round(originalBytes * qualityRatio);
  const savingsBytes = originalBytes - estimatedCompressedBytes;
  const savingsPercent = originalBytes > 0 ? ((savingsBytes / originalBytes) * 100).toFixed(1) + '%' : '0%';

  return {
    ok: true,
    clientProcessingPreferred: true,
    originalBytes,
    estimatedCompressedBytes,
    savingsBytes,
    savingsPercent,
    qualityRatio,
    maxDimension,
    output: `Image processed: Original ${formatBytes(originalBytes)} → Estimated ${formatBytes(estimatedCompressedBytes)} (${savingsPercent} reduction)`
  };
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  processImageCompression,
  formatBytes
};
