const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["quote"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      reply(resultBox('QUOTE 💬', [centerText('Kutipan Inspiratif'), '"' + data.content + '"', '— ' + data.author]));
    } catch(e) {
      const quotes = ['Hidup itu singkat, jangan buang waktu! - Unknown','Sukses adalah perjalanan, bukan tujuan - Unknown','Jadilah dirimu sendiri - Unknown'];
      reply(resultBox('QUOTE 💬', [centerText('Kutipan Inspiratif'), quotes[Math.floor(Math.random()*quotes.length)]]));
    }
  }
};
