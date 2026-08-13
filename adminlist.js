const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["adminlist"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    try {
      const meta = await sock.groupMetadata(from);
      const admins = meta.participants.filter(pp => pp.admin).map(pp => '👑 @' + pp.id.split('@')[0]);
      reply(resultBox('ADMIN LIST', [centerText('Daftar Admin Grup'), ...admins]), { mentions: meta.participants.filter(pp=>pp.admin).map(pp=>pp.id) });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
