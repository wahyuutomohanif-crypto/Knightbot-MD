const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["wyr"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const wyrs = ['Jadi orang kaya tapi gak punya teman VS miskin tapi banyak teman?','Hidup 1000 tahun VS hidup 100 tahun tapi bahagia?','Tahu kapan mati VS tidak tahu?','Punya kemampuan terbang VS tidak terlihat?'];
    reply(resultBox('WOULD YOU RATHER 🤔', [centerText('Pilih salah satu!'), '🎲 ' + wyrs[Math.floor(Math.random()*wyrs.length)]]));
  }
};
