const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["jadwalsholat","sholat"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const kota = text || 'Jakarta';
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2,'0');
      const mm = String(today.getMonth()+1).padStart(2,'0');
      const yyyy = today.getFullYear();
      const res = await fetch('https://api.myquran.com/v2/sholat/jadwal/1301/' + yyyy + '/' + mm + '/' + dd);
      const data = await res.json();
      const j = data.data?.jadwal;
      if (!j) return reply(resultBox('ERROR', ['❌ Gagal ambil jadwal']));
      reply(infoBox('JADWAL SHOLAT 🕌', {
        '🌅 Subuh': j.subuh,
        '☀️ Dzuhur': j.dzuhur,
        '🌤️ Ashar': j.ashar,
        '🌆 Maghrib': j.maghrib,
        '🌙 Isya': j.isya,
        '📅 Tanggal': j.tanggal || dd + '/' + mm + '/' + yyyy
      }));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
