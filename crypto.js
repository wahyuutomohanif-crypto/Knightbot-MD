const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["crypto","btc","eth"],
  category: 'info',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const coin = text || 'bitcoin';
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + encodeURIComponent(coin) + ',bitcoin,ethereum&vs_currencies=idr,usd');
      const data = await res.json();
      const lines = Object.entries(data).map(([k, v]) => '💰 ' + k.toUpperCase() + ': Rp ' + (v.idr||0).toLocaleString('id-ID') + ' / $' + (v.usd||0).toLocaleString('en'));
      reply(resultBox('CRYPTO 💎', [centerText('Harga Crypto Live'), ...lines, '📅 ' + new Date().toLocaleString('id-ID')]));
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
