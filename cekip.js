const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["cekip","myip"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://ipinfo.io/json');
      const data = await res.json();
      reply(infoBox('INFO IP SERVER 🌐', {
        '🌐 IP': data.ip,
        '🏙️ Kota': data.city,
        '🌍 Negara': data.country,
        '📡 ISP': data.org,
        '🕐 Zona waktu': data.timezone
      }));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
