const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["roast"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    const nama = target ? '@' + target.split('@')[0] : (text || 'kamu');
    const roasts = [
      'Wajah ' + nama + ' mirip CAPTCHA 🤖',
      nama + ' itu kayak sinyal di basement 📶',
      'IQ ' + nama + ' kayak suhu kulkas ❄️'
    ];
    reply(resultBox('ROAST 🔥', [centerText('Bakar!'), roasts[Math.floor(Math.random()*roasts.length)]]), target ? { mentions: [target] } : {});
  }
};
