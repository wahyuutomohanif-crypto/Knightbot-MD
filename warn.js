const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["warn"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isBotAdmin) return reply(resultBox('ERROR', ['❌ Bot harus jadi admin!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    if (!target) return reply(resultBox('WARN', ['📝 Reply pesan member yang mau di-warn']));
    if (!global._warns) global._warns = {};
    const key = from + '_' + target.split('@')[0];
    global._warns[key] = (global._warns[key] || 0) + 1;
    const count = global._warns[key];
    if (count >= 3) {
      try { await sock.groupParticipantsUpdate(from, [target], 'remove'); } catch(_) {}
      reply(resultBox('WARN 🚫', [centerText('3x warn → dikick!'), '👤 @' + target.split('@')[0]]), { mentions: [target] });
    } else {
      reply(resultBox('WARN ⚠️', [centerText('Peringatan ke-' + count + '/3'), '👤 @' + target.split('@')[0], text || 'Tidak ada alasan']), { mentions: [target] });
    }
  }
};
