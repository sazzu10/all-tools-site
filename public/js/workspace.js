(function () {
  // 1. Toast notifications
  window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-600 text-white border-emerald-500',
      error: 'bg-rose-600 text-white border-rose-500',
      info: 'bg-indigo-600 text-white border-indigo-500'
    };
    const icons = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    toast.className = `toast px-4 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-2.5 ${colors[type] || colors.info}`;
    toast.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  // 2. Universal clipboard copy with visual button feedback
  window.copyToClipboard = function (elementId, successMsg = 'Copied to clipboard!') {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.value !== undefined ? el.value : el.innerText;
    if (!text || !text.trim()) {
      window.showToast('Nothing to copy', 'error');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      window.showToast(successMsg, 'success');

      // Visual button feedback
      const copyBtn = document.getElementById('workspace-copy-btn');
      const copyIcon = document.getElementById('workspace-copy-icon');
      const copyText = document.getElementById('workspace-copy-text');
      if (copyBtn && copyIcon && copyText) {
        copyIcon.className = 'fa-solid fa-check text-emerald-400';
        copyText.innerText = 'Copied!';
        copyBtn.classList.add('border-emerald-500');

        setTimeout(() => {
          copyIcon.className = 'fa-regular fa-copy';
          copyText.innerText = 'Copy';
          copyBtn.classList.remove('border-emerald-500');
        }, 2000);
      }

      if (typeof window.trackEvent === 'function') {
        window.trackEvent('copy_output', { length: text.length });
      }
    }).catch(() => {
      window.showToast('Failed to copy', 'error');
    });
  };

  // 3. Mobile menu toggle
  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };

  // 4. Sample Demo Data for All 8 Tools
  const SAMPLE_DATA = {
    'json-formatter': {
      'jsonInput': JSON.stringify({
        appName: 'All Tools Platform',
        version: 2.0,
        active: true,
        features: ['ai-engine', 'client-side-compression', 'svg-qr'],
        metrics: { uptime: '99.99%', latencyMs: 12 }
      }, null, 2),
      'indent': '2 Spaces'
    },
    'unit-converter': {
      'dimension': 'Length',
      'amount': 26.2,
      'fromUnit': 'Miles',
      'toUnit': 'Kilometers'
    },
    'qrcode-generator': {
      'qrContent': 'https://alltools.online',
      'size': '256 x 256 px (Standard)',
      'errorCorrection': 'Medium (15% recovery)'
    },
    'youtube-title-generator': {
      'topic': 'How to Build a High-Income Micro-SaaS in 30 Days',
      'style': 'Curiosity & Hook',
      'count': '10 Titles'
    },
    'youtube-description-generator': {
      'title': 'Complete 2026 Guide to Web Performance and SEO Optimization',
      'summary': 'In this in-depth tutorial, we cover Core Web Vitals, server caching, image compression, and modern responsive UI design.',
      'includeTimestamps': 'Yes (Include 00:00 Chapter Outline)'
    },
    'hashtag-generator': {
      'keyword': 'productivity systems & digital nomad lifestyle',
      'platform': 'Instagram Reels / Posts',
      'density': '10-15 Mixed Reach Tags'
    },
    'ai-text-generator': {
      'prompt': 'Why deliberate practice and clear systems outperform raw talent in creative work',
      'format': 'Paragraph',
      'tone': 'Engaging'
    },
    'image-compressor': {
      'quality': 'Balanced (70%)',
      'maxDimension': '1920px (Full HD)'
    }
  };

  window.loadSampleData = function (slug) {
    const samples = SAMPLE_DATA[slug];
    if (!samples) {
      window.showToast('No sample demo data available for this tool.', 'info');
      return;
    }

    const form = document.getElementById('tool-workspace-form');
    if (!form) return;

    for (const [key, value] of Object.entries(samples)) {
      const field = form.elements[key];
      if (field) {
        field.value = value;
      }
    }

    updateCharacterCounter();
    window.showToast('Sample demo loaded! Click execute to test.', 'success');

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('load_sample', { slug });
    }
  };

  // 5. Clear Workspace Form
  window.clearWorkspaceForm = function () {
    const form = document.getElementById('tool-workspace-form');
    if (!form) return;

    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.type === 'text' || el.tagName === 'TEXTAREA') {
        el.value = '';
      } else if (el.type === 'file') {
        el.value = '';
        const previewLabel = document.getElementById('file-name-preview');
        if (previewLabel) previewLabel.innerText = 'Supported formats: JPG, PNG, WebP (Runs 100% in Browser)';
      }
    }

    const outputText = document.getElementById('workspace-output-text');
    if (outputText) outputText.value = '';

    const mediaContainer = document.getElementById('workspace-media-container');
    if (mediaContainer) mediaContainer.classList.add('hidden');

    const textContainer = document.getElementById('workspace-text-container');
    if (textContainer) textContainer.classList.remove('hidden');

    const downloadBtn = document.getElementById('workspace-download-btn');
    if (downloadBtn) downloadBtn.classList.add('hidden');

    updateCharacterCounter();
    window.showToast('Workspace cleared.', 'info');
  };

  function updateCharacterCounter() {
    const form = document.getElementById('tool-workspace-form');
    const statsPill = document.getElementById('workspace-stats-pill');
    if (!form || !statsPill) return;

    let totalChars = 0;
    const textareas = form.querySelectorAll('textarea, input[type="text"]');
    textareas.forEach(t => {
      totalChars += (t.value || '').length;
    });

    statsPill.innerText = `${totalChars} input chars`;
  }

  // 6. File input change label
  const fileInput = document.getElementById('tool-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files?.[0];
      const previewLabel = document.getElementById('file-name-preview');
      if (file && previewLabel) {
        previewLabel.innerText = `${file.name} (${formatBytes(file.size)})`;
        previewLabel.className = 'text-xs text-indigo-400 font-semibold';
      }
    });
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 7. Interactive Form Handler
  const form = document.getElementById('tool-workspace-form');
  if (!form) return;

  const slug = form.getAttribute('data-slug');
  const executeBtn = document.getElementById('workspace-execute-btn');
  const btnText = document.getElementById('workspace-btn-text');
  const btnIcon = document.getElementById('workspace-btn-icon');
  const outputText = document.getElementById('workspace-output-text');
  const textContainer = document.getElementById('workspace-text-container');
  const mediaContainer = document.getElementById('workspace-media-container');
  const mediaPreview = document.getElementById('workspace-media-preview');
  const mediaInfo = document.getElementById('workspace-media-info');
  const downloadBtn = document.getElementById('workspace-download-btn');
  const statusIndicator = document.getElementById('workspace-status-indicator');
  const statsPill = document.getElementById('workspace-stats-pill');

  // Attach live char counter
  form.addEventListener('input', updateCharacterCounter);
  updateCharacterCounter();

  function setLoading(isLoading, text = 'Processing...') {
    if (!executeBtn) return;
    executeBtn.disabled = isLoading;
    if (isLoading) {
      if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin text-xs';
      if (btnText) btnText.innerText = text;
      if (statusIndicator) {
        statusIndicator.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i> Processing request...';
      }
    } else {
      if (btnIcon) btnIcon.className = 'fa-solid fa-play text-xs';
      if (btnText) btnText.innerText = `Execute`;
    }
  }

  // Client-Side Engine for Image Compressor
  if (slug === 'image-compressor') {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const file = fileInput?.files?.[0];
      if (!file) {
        window.showToast('Please select an image file to compress', 'error');
        return;
      }

      setLoading(true, 'Compressing in browser...');

      try {
        const qualityVal = form.elements['quality']?.value || 'Balanced (70%)';
        const maxDimVal = form.elements['maxDimension']?.value || 'Original Size';

        let quality = 0.7;
        if (qualityVal.includes('85')) quality = 0.85;
        else if (qualityVal.includes('50')) quality = 0.5;

        let maxDimension = Infinity;
        if (maxDimVal.includes('1920')) maxDimension = 1920;
        else if (maxDimVal.includes('1280')) maxDimension = 1280;
        else if (maxDimVal.includes('800')) maxDimension = 800;

        const reader = new FileReader();
        reader.onload = function (readerEvent) {
          const img = new Image();
          img.onload = function () {
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            canvas.toBlob(
              function (blob) {
                setLoading(false);
                if (!blob) {
                  window.showToast('Compression failed', 'error');
                  return;
                }

                const compressedUrl = URL.createObjectURL(blob);
                const originalSize = file.size;
                const newSize = blob.size;
                const savings = ((originalSize - newSize) / originalSize) * 100;
                const savingsFormatted = savings > 0 ? savings.toFixed(1) + '%' : '0%';

                if (textContainer) textContainer.classList.add('hidden');
                if (mediaContainer) {
                  mediaContainer.classList.remove('hidden');
                  mediaPreview.innerHTML = `<img src="${compressedUrl}" alt="Compressed Image" class="max-h-56 rounded-xl border border-slate-700 shadow-lg object-contain">`;
                  mediaInfo.innerHTML = `
                    <div class="flex items-center justify-center gap-4 text-xs">
                      <div>Original: <span class="font-bold text-slate-300">${formatBytes(originalSize)}</span></div>
                      <div>→</div>
                      <div>Compressed: <span class="font-bold text-emerald-400">${formatBytes(newSize)}</span></div>
                      <div class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Saved ${savingsFormatted}</div>
                    </div>
                  `;
                }

                if (downloadBtn) {
                  downloadBtn.classList.remove('hidden');
                  downloadBtn.onclick = function () {
                    const a = document.createElement('a');
                    a.href = compressedUrl;
                    a.download = `compressed-${file.name}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    if (window.trackEvent) window.trackEvent('download_output', { format: 'compressed_image' });
                  };
                }

                if (statusIndicator) {
                  statusIndicator.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i> Compressed locally (100% private)';
                }
                if (statsPill) {
                  statsPill.innerText = `Saved ${savingsFormatted} (${formatBytes(newSize)})`;
                }
                window.showToast(`Compressed successfully! Saved ${savingsFormatted}`, 'success');

                if (window.trackEvent) {
                  window.trackEvent('tool_execute_success', { slug, savingsPercent: savingsFormatted });
                }
              },
              mimeType,
              quality
            );
          };
          img.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setLoading(false);
        window.showToast(err.message, 'error');
        if (window.trackEvent) window.trackEvent('tool_execute_error', { slug, error: err.message });
      }
    });
    return;
  }

  // Standard API Execution for all other tools
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      payload[k] = v;
    }

    const isAi = form.getAttribute('data-processing') === 'ai';
    setLoading(true, isAi ? 'Generating with AI...' : 'Executing...');

    if (window.trackEvent) {
      window.trackEvent('tool_execute_start', { slug, isAi });
    }

    const startTime = performance.now();

    try {
      const response = await fetch(`/api/tools/${slug}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to process tool request');
      }

      const elapsed = Math.round(performance.now() - startTime);

      // Handle QR Code visual rendering
      if (slug === 'qrcode-generator' && data.svg) {
        if (textContainer) textContainer.classList.add('hidden');
        if (mediaContainer) {
          mediaContainer.classList.remove('hidden');
          mediaPreview.innerHTML = data.svg;
          mediaInfo.innerHTML = `
            <div class="text-xs text-slate-300">
              <span class="font-semibold text-white">QR Code Ready</span> • Size: ${data.size}x${data.size}px • Error Correction: ${data.errorCorrection}
            </div>
          `;
        }
        if (downloadBtn) {
          downloadBtn.classList.remove('hidden');
          downloadBtn.onclick = function () {
            const blob = new Blob([data.svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode-${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            if (window.trackEvent) window.trackEvent('download_output', { format: 'svg_qr' });
          };
        }
      } else {
        // Standard Text Output
        if (textContainer) textContainer.classList.remove('hidden');
        if (mediaContainer) mediaContainer.classList.add('hidden');
        if (downloadBtn) downloadBtn.classList.add('hidden');

        if (outputText) {
          outputText.value = data.output || JSON.stringify(data, null, 2);
        }
      }

      if (statusIndicator) {
        const prov = data.metadata?.provider || data.processingType || 'local';
        statusIndicator.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> Done in ${elapsed}ms (${prov})`;
      }

      if (statsPill) {
        const chars = data.output ? data.output.length : 0;
        statsPill.innerText = `${chars} chars output`;
      }

      window.showToast('Execution completed successfully!', 'success');

      if (window.trackEvent) {
        window.trackEvent('tool_execute_success', { slug, elapsedMs: elapsed, provider: data.metadata?.provider });
      }
    } catch (err) {
      setLoading(false);
      window.showToast(err.message, 'error');
      if (statusIndicator) {
        statusIndicator.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-400"></i> ${err.message}`;
      }
      if (window.trackEvent) {
        window.trackEvent('tool_execute_error', { slug, error: err.message });
      }
    }
  });
})();
