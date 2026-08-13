const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["attp","teks2stiker"],
  category: 'sticker',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('ATTP', ['📝 .attp [teks]', '🔤 Buat stiker dari teks']));
    try {
      const url = 'https://api.siputzx.my.id/api/sticker/attp?text=' + encodeURIComponent(text);
      await sock.sendMessage(from, { sticker: { url } }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
