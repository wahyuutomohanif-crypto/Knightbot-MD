const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["gempa"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
      const data = await res.json();
      const g = data.Infogempa?.gempa;
      if (!g) return reply(resultBox('ERROR', ['❌ Gagal ambil data BMKG']));
      reply(infoBox('GEMPA TERBARU 🌍', {
        '📅 Tanggal': g.Tanggal,
        '🕐 Waktu': g.Jam,
        '💥 Magnitudo': g.Magnitude,
        '📏 Kedalaman': g.Kedalaman,
        '📍 Lokasi': g.Wilayah,
        '🌊 Potensi': g.Potensi
      }));
    } catch(e) { reply(resultBox('ERROR', ['❌ Gagal ambil data: ' + e.message])); }
  }
};
