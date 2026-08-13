const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["cuaca","weather"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('CUACA', ['📝 .cuaca [kota]', 'Contoh: .cuaca Jakarta']));
    try {
      const res = await fetch('https://wttr.in/' + encodeURIComponent(text) + '?format=j1');
      const data = await res.json();
      const cur = data.current_condition?.[0];
      if (!cur) return reply(resultBox('ERROR', ['❌ Kota tidak ditemukan']));
      reply(infoBox('CUACA ' + text.toUpperCase(), {
        '🌡️ Suhu': cur.temp_C + '°C / ' + cur.temp_F + '°F',
        '💧 Kelembapan': cur.humidity + '%',
        '🌬️ Angin': cur.windspeedKmph + ' km/h',
        '☁️ Kondisi': cur.weatherDesc?.[0]?.value || '-',
        '👁️ Jarak pandang': cur.visibility + ' km'
      }));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
