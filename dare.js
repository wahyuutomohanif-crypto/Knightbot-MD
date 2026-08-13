const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["dare"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const dares = ['Kirim voice note nyanyi lagu nasional!','Foto selfie sambil tutup hidung!','Ketik ulang pesan terakhir kamu 10x!','Kirim GIF lucu sekarang!','Tag 3 teman dan bilang mereka keren!'];
    reply(resultBox('DARE 🎯', [centerText('Tantangan Untukmu!'), '🎲 ' + dares[Math.floor(Math.random()*dares.length)]]));
  }
};
