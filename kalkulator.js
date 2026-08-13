const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["kalkulator","calc","hitung"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('KALKULATOR', ['📝 .calc [rumus]', 'Contoh: .calc 2+2*3', '✅ Operator: + - * / % ^']));
    try {
      const cleaned = text.replace(/[^0-9+\-*/.()% ]/g, '');
      const result = Function('"use strict"; return (' + cleaned + ')')();
      reply(resultBox('KALKULATOR 🔢', [centerText('Hasil Perhitungan'), '🔢 ' + text, '= ' + result]));
    } catch(e) { reply(resultBox('ERROR', ['❌ Rumus tidak valid'])); }
  }
};
