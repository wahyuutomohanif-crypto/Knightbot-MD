const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["absen"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!global._absen) global._absen = {};
    if (!global._absen[from]) global._absen[from] = {};
    const today = new Date().toLocaleDateString('id-ID');
    const key = today + '_' + senderId;
    if (global._absen[from][key]) return reply(resultBox('ABSEN', [centerText('Sudah absen hari ini! ✅'), '📅 ' + today]));
    global._absen[from][key] = { name: sender, time: new Date().toLocaleTimeString('id-ID') };
    const count = Object.keys(global._absen[from]).filter(k => k.startsWith(today)).length;
    reply(resultBox('ABSEN ✅', [centerText('Absen berhasil!'), '👤 ' + sender, '📅 ' + today, '🕐 ' + new Date().toLocaleTimeString('id-ID'), '👥 Total hari ini: ' + count]));
  }
};
