const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["wikipedia","wiki"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('WIKIPEDIA', ['📝 .wiki [topik]', 'Contoh: .wiki Indonesia']));
    try {
      const res = await fetch('https://id.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(text));
      const data = await res.json();
      if (data.type === 'disambiguation') return reply(resultBox('WIKIPEDIA', ['⚠️ Terlalu umum, spesifikkan lagi']));
      if (!data.extract) return reply(resultBox('ERROR', ['❌ Tidak ditemukan']));
      reply(resultBox('WIKIPEDIA 📖', [
        centerText(data.title || text),
        data.extract.slice(0, 400) + (data.extract.length > 400 ? '...' : ''),
        '🔗 ' + (data.content_urls?.desktop?.page || '')
      ]));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
