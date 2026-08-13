const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["berita","news"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const q = text || 'Indonesia';
    try {
      const res = await fetch('https://newsapi.org/v2/everything?q=' + encodeURIComponent(q) + '&language=id&pageSize=3&apiKey=demo');
      const data = await res.json();
      if (!data.articles?.length) return reply(resultBox('BERITA', [centerText('Tidak ada berita ditemukan'), '🔍 Coba kata kunci lain']));
      const lines = data.articles.slice(0,3).map((a,i) => (i+1) + '. ' + (a.title||'').slice(0,60) + '...');
      reply(resultBox('BERITA 📰', [centerText('Berita: ' + q), ...lines]));
    } catch(e) { reply(resultBox('BERITA', [centerText('Fitur memerlukan API key'), '💡 Daftar di newsapi.org'])); }
  }
};
