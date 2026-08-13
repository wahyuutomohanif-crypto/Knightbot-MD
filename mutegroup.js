const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["mutegroup"],
  category: 'group',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!isGroup) return reply(resultBox('ERROR', ['❌ Hanya untuk grup!']));
    if (!isBotAdmin) return reply(resultBox('ERROR', ['❌ Bot harus jadi admin!']));
    if (!isAdmin && !isOwner) return reply(resultBox('ERROR', ['❌ Hanya admin!']));
    try {
      await sock.groupSettingUpdate(from, 'announcement');
      reply(resultBox('MUTEGROUP ✅', [centerText('Grup di-mute!'), '🔇 Hanya admin yang bisa chat']));
    } catch(e) { reply(resultBox('ERROR', ['❌ Gagal: ' + e.message])); }
  }
};
