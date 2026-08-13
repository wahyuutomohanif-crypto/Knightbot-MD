const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["ytmp3","ytaudio"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('YTMP3', ['📝 .ytmp3 [link YouTube]', '🎵 Download audio dari YouTube']));
    try {
      reply(resultBox('YTMP3 🎵', [centerText('Mengunduh audio...'), '🔗 ' + text.slice(0,50)]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/ytmp3?url=' + encodeURIComponent(text));
      const data = await res.json();
      if (!data.success && !data.url) return reply(resultBox('ERROR', ['❌ Gagal download', 'Pastikan link valid']));
      const url = data.url || data.download?.url || data.data?.url;
      if (!url) return reply(resultBox('ERROR', ['❌ URL tidak ditemukan']));
      await sock.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg', fileName: (data.title||'audio') + '.mp3' }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
