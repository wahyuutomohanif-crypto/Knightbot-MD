const { resultBox, centerText } = require('../utils');
module.exports = {
  command: ["antihoax"],
  category: 'group',
  onMessage: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isOwner, body, senderJid, senderId } = ctx;
    if (!isGroup || !global._antihoax?.[from] || !body) return;
    const _kw = ['breaking news','info hoax','tersebar luas','viral sekarang','terbukti','AWAS','DARURAT'];
    if (_kw.some(w => body.toUpperCase().includes(w.toUpperCase())) && !isAdmin && !isOwner) {
      try { await sock.sendMessage(from, { delete: m.key }); await sock.sendMessage(from, { text: resultBox('ANTIHOAX 🚫', [centerText('Potensi hoax!'), '👤 @' + senderId, '💡 Verifikasi dulu']), mentions: [senderJid] }); } catch(_) {}
    }
  },
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isOwner, args, toFont, centerText } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });
    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    if (!global._antihoax) global._antihoax = {};
    const arg = (args[0] || '').toLowerCase();
    if (arg === 'on') { global._antihoax[from] = true; return reply(resultBox('ANTIHOAX', [centerText('Antihoax ON ✅')])); }
    if (arg === 'off') { global._antihoax[from] = false; return reply(resultBox('ANTIHOAX', [centerText('Antihoax OFF ❌')])); }
    const cur = global._antihoax[from];
    global._antihoax[from] = !cur;
    return reply(resultBox('ANTIHOAX', [centerText('Antihoax ' + (!cur ? 'ON ✅' : 'OFF ❌'))]));
  }
};
