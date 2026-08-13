const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["kurs","rate"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      const idr = data.rates?.IDR || 0;
      const eur = data.rates?.EUR || 0;
      const sgd = data.rates?.SGD || 0;
      const myr = data.rates?.MYR || 0;
      reply(infoBox('KURS VALUTA ASING 💱', {
        '🇺🇸 USD → IDR': 'Rp ' + idr.toLocaleString('id-ID'),
        '🇪🇺 EUR → IDR': 'Rp ' + (idr/eur).toLocaleString('id-ID'),
        '🇸🇬 SGD → IDR': 'Rp ' + (idr/sgd).toLocaleString('id-ID'),
        '🇲🇾 MYR → IDR': 'Rp ' + (idr/myr).toLocaleString('id-ID'),
        '📅 Update': new Date().toLocaleString('id-ID')
      }));
    } catch(e) { reply(resultBox('ERROR', ['❌ Gagal ambil kurs: ' + e.message])); }
  }
};
