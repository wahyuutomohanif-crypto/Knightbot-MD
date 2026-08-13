const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["joke"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://v2.jokeapi.dev/joke/Any?lang=en&type=twopart');
      const data = await res.json();
      if (data.setup) {
        reply(resultBox('JOKE 😂', [centerText('Lelucon Random'), '🤔 ' + data.setup, '😂 ' + data.delivery]));
      } else {
        reply(resultBox('JOKE 😂', [centerText('Lelucon Random'), data.joke||'Tidak ada lelucon']));
      }
    } catch(e) { reply(resultBox('JOKE 😂', [centerText('Lelucon Random'), 'Kenapa programmer suka gelap? Karena light attracts bugs! 🐛'])); }
  }
};
