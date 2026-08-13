const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["ship"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender;
    if (!target) return reply(resultBox('SHIP 💕', ['📝 Reply pesan orang yang mau di-ship']));
    const score = Math.floor(Math.random() * 101);
    const bar = '█'.repeat(Math.floor(score/10)) + '░'.repeat(10 - Math.floor(score/10));
    const emoji = score >= 80 ? '💘' : score >= 50 ? '💕' : score >= 30 ? '💔' : '😬';
    reply(resultBox('SHIP ' + emoji, [
      centerText('Love Calculator'),
      '👤 ' + senderId + ' + @' + target.split('@')[0],
      '[' + bar + '] ' + score + '%',
      score >= 80 ? 'Cocok banget!' : score >= 50 ? 'Lumayan cocok' : score >= 30 ? 'Kurang cocok' : 'Tidak cocok 💀'
    ]), { mentions: [target] });
  }
};
