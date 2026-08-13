const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["tiktok","ttdl"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('TIKTOK', ['📝 .tiktok [link TikTok]', '📱 Download TikTok tanpa watermark']));
    try {
      reply(resultBox('TIKTOK 📱', [centerText('Mengunduh video...')]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/ttdl?url=' + encodeURIComponent(text));
      const data = await res.json();
      const url = data.data?.play || data.url || data.nowm;
      if (!url) return reply(resultBox('ERROR', ['❌ Gagal download', 'Pastikan link valid']));
      await sock.sendMessage(from, { video: { url }, mimetype: 'video/mp4', caption: resultBox('TIKTOK ✅', [data.data?.title || 'TikTok Video']) }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
