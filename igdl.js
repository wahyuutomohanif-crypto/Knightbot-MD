const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["igdl","instagram"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('IGDL', ['📝 .igdl [link Instagram]', '📸 Download foto/video Instagram']));
    try {
      reply(resultBox('IGDL 📸', [centerText('Mengunduh...')]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/igdl?url=' + encodeURIComponent(text));
      const data = await res.json();
      const items = data.data || data.result || [];
      if (!items.length) return reply(resultBox('ERROR', ['❌ Gagal download']));
      for (const item of items.slice(0,3)) {
        const url = item.url || item;
        const isVideo = item.type === 'video' || (typeof url === 'string' && url.includes('.mp4'));
        if (isVideo) await sock.sendMessage(from, { video: { url }, mimetype: 'video/mp4' }, { quoted: m });
        else await sock.sendMessage(from, { image: { url }, caption: '' }, { quoted: m });
      }
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
