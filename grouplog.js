const { resultBox, centerText } = require('../utils');
module.exports = {
  command: ["grouplog"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isOwner, args, toFont, centerText } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });
    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    if (!global._grouplog) global._grouplog = {};
    const arg = (args[0] || '').toLowerCase();
    if (arg === 'on') { global._grouplog[from] = true; return reply(resultBox('GROUPLOG', [centerText('Group log ON ✅')])); }
    if (arg === 'off') { global._grouplog[from] = false; return reply(resultBox('GROUPLOG', [centerText('Group log OFF ❌')])); }
    const cur = global._grouplog[from];
    global._grouplog[from] = !cur;
    return reply(resultBox('GROUPLOG', [centerText('Group log ' + (!cur ? 'ON ✅' : 'OFF ❌'))]));
  }
};
