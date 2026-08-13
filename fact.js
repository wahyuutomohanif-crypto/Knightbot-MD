const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["fact"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
      const data = await res.json();
      reply(resultBox('FAKTA UNIK 🤓', [centerText('Tahukah Kamu?'), data.text || 'Tidak ada fakta']));
    } catch(e) { reply(resultBox('FAKTA UNIK 🤓', [centerText('Tahukah Kamu?'), 'Hiu lebih tua dari pohon! 🦈'])); }
  }
};
