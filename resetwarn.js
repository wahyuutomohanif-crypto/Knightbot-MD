const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["resetwarn"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    if (!global._warns) global._warns = {};
    if (target) {
      delete global._warns[from + '_' + target.split('@')[0]];
      reply(resultBox('RESETWARN ✅', [centerText('Warn direset!'), '👤 @' + target.split('@')[0]]), { mentions: [target] });
    } else {
      Object.keys(global._warns).filter(k => k.startsWith(from)).forEach(k => delete global._warns[k]);
      reply(resultBox('RESETWARN ✅', [centerText('Semua warn grup direset!')]));
    }
  }
};
