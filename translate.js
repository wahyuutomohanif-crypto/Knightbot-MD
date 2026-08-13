const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["translate","tr"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('TRANSLATE', ['📝 .translate [kode bahasa] [teks]', 'Contoh: .translate en Halo dunia', '🌐 Kode: en, ja, ko, ar, zh, dll']));
    const parts = text.split(' ');
    const langCode = parts[0].length <= 5 ? parts[0] : 'en';
    const query = parts[0].length <= 5 ? parts.slice(1).join(' ') : text;
    if (!query) return reply(resultBox('TRANSLATE', ['📝 .translate [kode bahasa] [teks]']));
    try {
      const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + langCode + '&dt=t&q=' + encodeURIComponent(query));
      const data = await res.json();
      const result = data[0]?.map(x => x[0]).join('') || '';
      reply(resultBox('TRANSLATE 🌐', [centerText(langCode.toUpperCase()), '📥 ' + query.slice(0,100), '📤 ' + result]));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
