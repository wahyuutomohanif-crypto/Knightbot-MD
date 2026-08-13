const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["listwarn"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!global._warns) return reply(resultBox('WARN LIST', [centerText('Tidak ada warn')]));
    const entries = Object.entries(global._warns).filter(([k]) => k.startsWith(from)).map(([k, v]) => '👤 ' + k.split('_')[1] + ': ' + v + 'x');
    if (!entries.length) return reply(resultBox('WARN LIST', [centerText('Tidak ada warn')]));
    reply(resultBox('WARN LIST', [centerText('Daftar member bermasalah'), ...entries]));
  }
};
