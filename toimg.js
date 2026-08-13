const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["toimg","toimage"],
  category: 'sticker',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const sticker = m.message?.stickerMessage || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!sticker) return reply(resultBox('TOIMG', ['📎 Reply stiker yang mau diubah ke gambar']));
    try {
      const buf = await sock.downloadMediaMessage(m);
      await sock.sendMessage(from, { image: buf, caption: resultBox('TOIMG ✅', [centerText('Stiker → Gambar')]) }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
