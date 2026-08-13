const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["lirik","lyrics"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('LIRIK', ['📝 .lirik [judul lagu]', 'Contoh: .lirik Shape of You']));
    try {
      const res = await fetch('https://api.lyrics.ovh/v1/' + encodeURIComponent(text.split(' ').slice(0,2).join('/')) + '/' + encodeURIComponent(text.split(' ').slice(2).join(' ')||text));
      const data = await res.json();
      if (!data.lyrics) return reply(resultBox('ERROR', ['❌ Lirik tidak ditemukan']));
      const lines = data.lyrics.split('\n').slice(0,20).join('\n');
      reply(resultBox('LIRIK 🎵', [centerText(text.toUpperCase()), lines + '\n...']));
    } catch(e) { reply(resultBox('LIRIK', [centerText('Tidak ditemukan'), '🔍 Coba judul yang lebih spesifik'])); }
  }
};
