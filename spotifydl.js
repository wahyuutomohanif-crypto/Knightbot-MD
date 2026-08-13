const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["spotify","spotifydl"],
  category: 'downloader',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('SPOTIFY DL', ['📝 .spotify [link Spotify]', '🎵 Download lagu dari Spotify']));
    try {
      reply(resultBox('SPOTIFY 🎵', [centerText('Mengunduh...')]));
      const res = await fetch('https://api.ryzendesu.vip/api/downloader/spotifydl?url=' + encodeURIComponent(text));
      const data = await res.json();
      const url = data.download || data.url || data.data?.url;
      if (!url) return reply(resultBox('ERROR', ['❌ Gagal download']));
      await sock.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg', fileName: (data.title||'spotify') + '.mp3' }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
