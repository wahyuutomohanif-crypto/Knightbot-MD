const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["everyone"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    try {
      const meta = await sock.groupMetadata(from);
      const mentions = meta.participants.map(pp => pp.id);
      const names = mentions.map(j => '@' + j.split('@')[0]).join('\n');
      reply(resultBox('EVERYONE 📢', [centerText('Mention semua!'), names]), { mentions });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
