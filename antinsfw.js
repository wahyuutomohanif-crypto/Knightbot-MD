const { resultBox, centerText } = require('../utils');
module.exports = {
  command: ["antinsfw"],
  category: 'group',
  onMessage: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isOwner, senderJid, senderId } = ctx;
    if (!isGroup || !global._antinsfw?.[from]) return;
    if ((m.message?.imageMessage || m.message?.videoMessage) && !isAdmin && !isOwner) {
      try { await sock.sendMessage(from, { delete: m.key }); await sock.sendMessage(from, { text: resultBox('ANTINSFW 🚫', [centerText('Media tidak diizinkan!'), '👤 @' + senderId]), mentions: [senderJid] }); } catch(_) {}
    }
  },
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isOwner, args, toFont, centerText } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });
    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    if (!global._antinsfw) global._antinsfw = {};
    const arg = (args[0] || '').toLowerCase();
    if (arg === 'on') { global._antinsfw[from] = true; return reply(resultBox('ANTINSFW', [centerText('Anti NSFW ON ✅')])); }
    if (arg === 'off') { global._antinsfw[from] = false; return reply(resultBox('ANTINSFW', [centerText('Anti NSFW OFF ❌')])); }
    const cur = global._antinsfw[from];
    global._antinsfw[from] = !cur;
    return reply(resultBox('ANTINSFW', [centerText('Anti NSFW ' + (!cur ? 'ON ✅' : 'OFF ❌'))]));
  }
};
