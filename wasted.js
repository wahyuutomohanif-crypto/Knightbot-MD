const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["wasted"],
  category: 'maker',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    try {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant || m.quoted?.sender || senderJid;
      const pp = await sock.profilePictureUrl(target, 'image').catch(() => 'https://i.imgur.com/ZUCJiKs.png');
      const url = 'https://api.popcat.xyz/wasted?image=' + encodeURIComponent(pp);
      await sock.sendMessage(from, { image: { url }, caption: resultBox('WASTED 💀', [centerText('GTA: San Andreas')]) }, { quoted: m });
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
