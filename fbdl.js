const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["fbdl","facebook"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('FBDL', ['📝 .fbdl [link Facebook]', '📹 Download video Facebook']));
    try {
      reply(resultBox('FBDL 📹', [centerText('Mengunduh...')]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/fbdl?url=' + encodeURIComponent(text));
      const data = await res.json();
      const url = data.hd || data.sd || data.url;
      if (!url) return reply(resultBox('ERROR', ['❌ Gagal download']));
      await sock.sendMessage(from, { video: { url }, mimetype: 'video/mp4' }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
