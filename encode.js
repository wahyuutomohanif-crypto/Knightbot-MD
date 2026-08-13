const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["encode"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('ENCODE', ['📝 .encode [teks]', '🔤 Encode URL']));
    reply(resultBox('ENCODE 🔤', [centerText('URL Encoded'), '📥 ' + text.slice(0,50), '📤 ' + encodeURIComponent(text)]));
  }
};
