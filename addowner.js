const { resultBox } = require('../utils');
const { reply } = require('../helpers/message');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['addowner', 'removeowner', 'listowner', 'setlid'],
  category: 'owner',
  execute: async (ctx) => {
    const { arcxrona: sock, m, from, isOwner } = ctx;
    if (!isOwner) return reply(sock, m, resultBox('ERROR', ['❌ Hanya owner!']));
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    const args = body.trim().split(/\s+/);
    const sub = args[0].toLowerCase().replace(global.prefix, '');
    const cfgPath = path.join(__dirname, '..', 'config.js');
    let cfg = fs.readFileSync(cfgPath, 'utf8');
    const owners = (Array.isArray(global.owner) ? global.owner : [global.owner]).map(String);

    function saveCfgKey(key, arr) {
      global[key] = arr;
      const line = 'global.' + key + ' = ' + JSON.stringify(arr) + ';';
      const re = new RegExp('global\\.' + key + '[^\n]*');
      if (re.test(cfg)) { cfg = cfg.replace(re, line); } else { cfg += '\nglobal.' + key + ' = ' + JSON.stringify(arr) + ';'; }
      fs.writeFileSync(cfgPath, cfg);
    }

    if (sub === 'addowner' || sub === 'setlid') {
      const participantJid = m.message?.extendedTextMessage?.contextInfo?.participant || '';
      const rawArg = args[1] || '';

      // Jika reply ke pesan @lid → simpan ke ownerLid
      if (participantJid.includes('@lid')) {
        const lid = participantJid.split('@')[0].split(':')[0];
        const ownerLids = (Array.isArray(global.ownerLid) ? global.ownerLid : global.ownerLid ? [global.ownerLid] : []).map(String);
        if (ownerLids.includes(lid)) return reply(sock, m, resultBox('INFO', ['ℹ️ LID sudah terdaftar sebagai owner']));
        ownerLids.push(lid);
        saveCfgKey('ownerLid', ownerLids);
        return reply(sock, m, resultBox('ADDOWNER', ['✅ LID owner berhasil disimpan: ' + lid]));
      }

      // Normal: tambah nomor HP
      const t = (participantJid.replace(/[^0-9]/g,'') || rawArg.replace(/[^0-9]/g,''));
      if (!t) return reply(sock, m, resultBox('ADDOWNER', ['📝 Reply pesan atau ketik nomor']));
      if (owners.includes(t)) return reply(sock, m, resultBox('INFO', ['ℹ️ Sudah jadi owner']));
      owners.push(t); 
      saveCfgKey('owner', owners);
      return reply(sock, m, resultBox('ADDOWNER', ['✅ Berhasil tambah owner: ' + t]));
    }

    if (sub === 'removeowner') {
      const t = (args[1] || '').replace(/[^0-9]/g,'');
      if (!t || t === owners[0]) return reply(sock, m, resultBox('ERROR', ['❌ Tidak bisa remove main owner']));
      const no = owners.filter(o => o !== t);
      saveCfgKey('owner', no);
      return reply(sock, m, resultBox('REMOVEOWNER', ['✅ Berhasil remove: ' + t]));
    }

    if (sub === 'listowner') {
      const ownerLids = (Array.isArray(global.ownerLid) ? global.ownerLid : global.ownerLid ? [global.ownerLid] : []).map(String);
      const lines = [
        ...owners.map((o,i) => (i===0?'👑 ':'⭐ ') + o + ' (HP)'),
        ...ownerLids.map(l => '🆔 ' + l + ' (LID)')
      ];
      return reply(sock, m, resultBox('LIST OWNER', lines));
    }
  }
};
