const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["unmute"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    if (!target) return reply(resultBox('UNMUTE', ['📝 Reply pesan member yang mau di-unmute']));
    if (!global._muted) global._muted = {};
    delete global._muted[from + '_' + target.split('@')[0]];
    reply(resultBox('UNMUTE ✅', [centerText('Member di-unmute!'), '👤 @' + target.split('@')[0]]), { mentions: [target] });
  }
};
