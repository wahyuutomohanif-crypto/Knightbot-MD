const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["pinterest","ptdl"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('PINTEREST DL', ['📝 .pinterest [link Pinterest]', '📌 Download foto Pinterest']));
    try {
      reply(resultBox('PINTEREST 📌', [centerText('Mengunduh...')]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/pinterest?url=' + encodeURIComponent(text));
      const data = await res.json();
      const url = data.url || data.data?.url;
      if (!url) return reply(resultBox('ERROR', ['❌ Gagal download']));
      await sock.sendMessage(from, { image: { url }, caption: resultBox('PINTEREST ✅', ['📌 Gambar berhasil diunduh']) }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
