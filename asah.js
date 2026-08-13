const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["asah","tebak"],
  category: 'fun',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const soals = [
      { q: 'Saya punya tangan tapi tidak bisa menjabat, punya muka tapi tidak bisa senyum. Apa aku?', a: 'jam' },
      { q: 'Semakin diisi semakin ringan. Apa aku?', a: 'balon' },
      { q: 'Lebih besar dari gajah tapi tidak berbobot. Apa aku?', a: 'bayangan gajah' },
    ];
    if (isGroup && global._asah?.[from]) {
      const cur = global._asah[from];
      if (text.toLowerCase().includes(cur.a)) {
        reply(resultBox('ASAH OTAK ✅', [centerText('BENAR! 🎉'), '🏆 ' + sender + ' menjawab dengan tepat!']));
        global._asah[from] = null;
      } else {
        reply(resultBox('ASAH OTAK', ['❌ Salah! Coba lagi 🤔']));
      }
      return;
    }
    const pick = soals[Math.floor(Math.random()*soals.length)];
    if (isGroup) { if (!global._asah) global._asah = {}; global._asah[from] = pick; }
    reply(resultBox('ASAH OTAK 🧠', [centerText('Tebak Ini!'), '❓ ' + pick.q, '💡 Ketik jawaban kamu!']));
  }
};
