(function () {
  let allToolsCache = null;

  async function fetchToolIndex() {
    if (allToolsCache) return allToolsCache;
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        allToolsCache = data.tools || [];
        return allToolsCache;
      }
    } catch (e) {
      console.warn('Failed to fetch tool search index', e);
    }
    return [];
  }

  function openSearchModal() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('global-search-input');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (input) {
        input.value = '';
        input.focus();
        renderResults('');
      }
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  async function renderResults(query) {
    const container = document.getElementById('search-results-container');
    if (!container) return;

    const tools = await fetchToolIndex();
    const q = (query || '').trim().toLowerCase();

    const filtered = q
      ? tools.filter(t => 
          t.name.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q)
        )
      : tools.slice(0, 8); // show top 8 if empty

    if (!filtered.length) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-magnifying-glass text-2xl mb-2 opacity-50"></i>
          <p class="text-sm">No tools found matching "${query}".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => `
      <a href="/tools/${t.slug}" class="flex items-center gap-3 p-3 min-h-[48px] rounded-xl hover:bg-slate-800/80 transition-colors group">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-sm group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
          <i class="${t.icon || 'fa-solid fa-wrench'}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">${t.name}</span>
            <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">${t.category.replace('-', ' ')}</span>
          </div>
          <p class="text-xs text-slate-300 truncate mt-0.5 font-normal">${t.description || ''}</p>
        </div>
        <i class="fa-solid fa-arrow-right text-xs text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0"></i>
      </a>
    `).join('');
  }

  // Keyboard shortcuts (Cmd/Ctrl + K, Escape)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  window.openSearchModal = openSearchModal;
  window.closeSearchModal = closeSearchModal;

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.addEventListener('input', (e) => renderResults(e.target.value));
    }
  });
})();
