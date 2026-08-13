const fs = require('fs')
const path = require('path')

const plugins = []
const pluginFolder = path.join(__dirname, '../plugins')

function loadPlugins() {
  plugins.length = 0
  
  if (!fs.existsSync(pluginFolder)) {
    fs.mkdirSync(pluginFolder, { recursive: true })
  }

  const files = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js') && !f.startsWith('_'))
  
  if (files.length === 0) {
    console.log('⚠️  Tidak ada plugin ditemukan di folder ./plugins')
    return
  }

  console.log('\n📦 Loading plugins...\n')
  
  for (const file of files) {
    try {
      const filePath = path.resolve(pluginFolder, file)
      delete require.cache[require.resolve(filePath)]
      const pluginModule = require(filePath)
      
      // Category: utamakan plugin.category, fallback ke filename prefix
      const fileCategory = file.includes('-') ? file.split('-')[0] : null;
      
      const pluginKeys = Object.keys(pluginModule)
      let loadedCount = 0
      
      for (const key of pluginKeys) {
        const plugin = pluginModule[key]
        if (plugin && plugin.command && plugin.execute) {
          // Gunakan category dari plugin jika ada, jika tidak pakai filename prefix
          if (!plugin.category || plugin.category === 'general') {
            if (fileCategory) plugin.category = fileCategory;
            else plugin.category = plugin.category || 'general';
          }
          plugin.fileName = file
          plugins.push(plugin)
          loadedCount++
        }
      }
      
      if (loadedCount > 0) {
        const cats = [...new Set(plugins.slice(-loadedCount).map(p => p.category))].join(',')
        console.log('✅ ' + file + ' - Loaded (' + loadedCount + ' command' + (loadedCount > 1 ? 's' : '') + ') [' + cats + ']')
      } else {
        if (pluginModule && pluginModule.command && pluginModule.execute) {
          if (!pluginModule.category || pluginModule.category === 'general') {
            if (fileCategory) pluginModule.category = fileCategory;
          }
          pluginModule.fileName = file
          plugins.push(pluginModule)
          console.log('✅ ' + file + ' - Loaded [default] [' + (pluginModule.category||'general') + ']')
        } else {
          console.log('⚠️  ' + file + ' - No valid commands found')
        }
      }
      
    } catch (e) {
      console.error('❌ ' + file + ' - Error:', e.message)
    }
  }
  
  console.log('\n✅ Total ' + plugins.length + ' command(s) loaded!\n')
}

function reloadPlugins() {
  console.log('\n🔄 Reloading all plugins...\n')
  loadPlugins()
}

function getCategories() {
  const categories = new Set()
  plugins.forEach(p => { if (p.category) categories.add(p.category) })
  return Array.from(categories).sort()
}

function getPluginsByCategory(category) {
  return plugins.filter(p => p.category === category)
}

// ================= CENTER TEXT =================
// Gunakan di semua plugin untuk header/judul yang auto-centered
// const { centerText } = require('../utils');
// centerText('OWNER')                  -> ─── OWNER ───
// centerText('OWNER', '━', '۞')        -> ۞━━━ OWNER ━━━۞
// centerText('OWNER', '═', '╠', '╣')  -> ╠══ OWNER ══╣
function centerText(text, fillChar, leftChar, rightChar) {
  var t    = String(text || '').toUpperCase();
  var fill = String(fillChar  !== undefined ? fillChar  : '━');
  var L    = String(leftChar  !== undefined ? leftChar  : '─');
  var R    = String(rightChar !== undefined ? rightChar : L);
  var total = Math.max(20, t.length + 6);
  var half  = Math.floor((total - t.length - 2) / 2);
  var pad   = fill.repeat(Math.max(1, half));
  return L + pad + ' ' + t + ' ' + pad + R;
}

module.exports = { loadPlugins, reloadPlugins, plugins, getCategories, getPluginsByCategory }
