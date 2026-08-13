const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["txtimg","textimg"],
  category: 'maker',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('TXTIMG', ['📝 .txtimg [teks]', '🖼️ Buat gambar dari teks']));
    try {
      const url = 'https://api.siputzx.my.id/api/misc/text2img?text=' + encodeURIComponent(text);
      await sock.sendMessage(from, { image: { url }, caption: resultBox('TXTIMG ✅', [centerText('Gambar dibuat!')]) }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
