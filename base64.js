const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["base64","b64"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    if (!text) return reply(resultBox('BASE64', ['📝 .base64 encode [teks]', '📝 .base64 decode [teks]']));
    const parts = text.split(' ');
    const mode = parts[0].toLowerCase();
    const content = parts.slice(1).join(' ');
    if (!content) return reply(resultBox('BASE64', ['📝 .base64 encode/decode [teks]']));
    try {
      if (mode === 'encode') {
        reply(resultBox('BASE64 ENCODE 🔐', [centerText('Teks → Base64'), '📥 ' + content.slice(0,50), '📤 ' + Buffer.from(content).toString('base64')]));
      } else if (mode === 'decode') {
        reply(resultBox('BASE64 DECODE 🔓', [centerText('Base64 → Teks'), '📥 ' + content.slice(0,50), '📤 ' + Buffer.from(content, 'base64').toString('utf8')]));
      } else {
        reply(resultBox('BASE64', ['📝 Mode: encode / decode']));
      }
    } catch(e) { reply(resultBox('ERROR', ['❌ ' + e.message])); }
  }
};
