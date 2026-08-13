const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["mathgame"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!global._mathgame) global._mathgame = {};
    if (global._mathgame[from]?.active) {
      const ans = parseInt(text);
      if (ans === global._mathgame[from].answer) {
        reply(resultBox('MATHGAME ✅', [centerText('BENAR! 🎉'), '🏆 ' + sender + ' menang!', '💡 Jawaban: ' + global._mathgame[from].answer]));
        global._mathgame[from] = null;
      } else {
        reply(resultBox('MATHGAME', ['❌ Salah! Coba lagi']));
      }
      return;
    }
    const a = Math.floor(Math.random()*50)+1, b = Math.floor(Math.random()*50)+1;
    const ops = ['+', '-', '*']; const op = ops[Math.floor(Math.random()*3)];
    const ans = op==='+' ? a+b : op==='-' ? a-b : a*b;
    global._mathgame[from] = { active: true, answer: ans, question: a + op + b };
    reply(resultBox('MATHGAME 🧮', [centerText('Hitung Cepat!'), '❓ Berapa ' + a + ' ' + op + ' ' + b + ' = ?', '⏰ 30 detik untuk jawab!']));
    setTimeout(() => {
      if (global._mathgame?.[from]?.active) {
        sock.sendMessage(from, { text: resultBox('MATHGAME', [centerText('Waktu habis! 😅'), '💡 Jawaban: ' + ans]) }).catch(()=>{});
        global._mathgame[from] = null;
      }
    }, 30000);
  }
};
