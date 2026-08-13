const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["kamus","arti"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('KAMUS', ['📝 .kamus [kata]', '📚 Cari arti kata Indonesia']));
    try {
      const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(text));
      const data = await res.json();
      if (!Array.isArray(data)) return reply(resultBox('KAMUS', [centerText('Kata tidak ditemukan'), '🔍 ' + text]));
      const meanings = data[0]?.meanings?.slice(0,2).map(m => '📖 ' + m.partOfSpeech + ': ' + (m.definitions?.[0]?.definition || '')) || [];
      reply(resultBox('KAMUS 📚', [centerText(text.toUpperCase()), ...meanings]));
    } catch(e) { reply(resultBox('KAMUS', [centerText('Tidak ditemukan'), '🔍 Coba kata lain'])); }
  }
};
