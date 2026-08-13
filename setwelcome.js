const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["setwelcome"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    if (!text) return reply(resultBox('SETWELCOME', ['📝 .setwelcome [pesan]', 'Gunakan @user untuk mention member']));
    if (!global._welcome) global._welcome = {};
    if (!global._welcome[from]) global._welcome[from] = {};
    global._welcome[from].msg = text;
    reply(resultBox('SETWELCOME ✅', [centerText('Pesan welcome diubah!'), '💬 ' + text]));
  }
};
