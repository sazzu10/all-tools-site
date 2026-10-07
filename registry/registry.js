const fs = require('fs');
const path = require('path');
const categories = require('./categories');

const toolsDirectory = path.join(__dirname, 'tools');
let cachedTools = null;

function loadTools() {
  if (cachedTools) return cachedTools;

  const tools = [];
  if (fs.existsSync(toolsDirectory)) {
    const files = fs.readdirSync(toolsDirectory).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const tool = require(path.join(toolsDirectory, file));
        if (tool && tool.slug && tool.enabled !== false) {
          tools.push(tool);
        }
      } catch (err) {
        console.error(`[ToolRegistry] Error loading ${file}:`, err.message);
      }
    }
  }

  // Sort tools alphabetically by name
  tools.sort((a, b) => a.name.localeCompare(b.name));
  cachedTools = tools;
  return tools;
}

function getAllTools() {
  return loadTools();
}

function getToolBySlug(slug) {
  if (!slug) return null;
  return loadTools().find(t => t.slug.toLowerCase() === slug.toLowerCase()) || null;
}

function getToolsByCategory(categorySlug) {
  if (!categorySlug) return [];
  return loadTools().filter(t => t.category === categorySlug);
}

function getFeaturedTools() {
  return loadTools().filter(t => t.featured);
}

function getPopularTools() {
  return loadTools().filter(t => t.popular);
}

function searchTools(query) {
  if (!query || !query.trim()) return getAllTools();
  const q = query.trim().toLowerCase();

  return loadTools().filter(t => {
    const inName = t.name.toLowerCase().includes(q);
    const inDesc = (t.description || '').toLowerCase().includes(q);
    const inCategory = (t.category || '').toLowerCase().includes(q);
    const inKeywords = (t.seo?.keywords || []).some(k => k.toLowerCase().includes(q));
    const inBadges = (t.badges || []).some(b => b.toLowerCase().includes(q));
    return inName || inDesc || inCategory || inKeywords || inBadges;
  });
}

function getCategories() {
  return categories;
}

function getCategoryBySlug(slug) {
  if (!slug) return null;
  return categories.find(c => c.slug === slug || c.id === slug) || null;
}

function getCategoriesWithCounts() {
  const tools = loadTools();
  return categories.map(cat => {
    const count = tools.filter(t => t.category === cat.id || t.category === cat.slug).length;
    return {
      ...cat,
      toolCount: count
    };
  });
}

module.exports = {
  loadTools,
  getAllTools,
  getToolBySlug,
  getToolsByCategory,
  getFeaturedTools,
  getPopularTools,
  searchTools,
  getCategories,
  getCategoryBySlug,
  getCategoriesWithCounts
};
