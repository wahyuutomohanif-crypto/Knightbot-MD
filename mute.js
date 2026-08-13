const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["mute"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    if (!target) return reply(resultBox('MUTE', ['📝 Reply pesan member yang mau di-mute']));
    if (!global._muted) global._muted = {};
    global._muted[from + '_' + target.split('@')[0]] = true;
    reply(resultBox('MUTE ✅', [centerText('Member di-mute!'), '👤 @' + target.split('@')[0], '💡 Pakai .unmute untuk buka']), { mentions: [target] });
  }
};
