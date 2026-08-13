const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["tinyurl"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('TINYURL', ['📝 .tinyurl [url]', '🔗 Buat URL pendek']));
    try {
      const res = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(text));
      const short = await res.text();
      reply(resultBox('TINYURL ✅', [centerText('Link berhasil dipendekkan!'), '🔗 ' + short]));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
