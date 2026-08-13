const { reply } = require('../helpers/message');
const { resultBox, infoBox, centerText, toFont } = require('../utils');

module.exports = {
  command: ["pasgen","password"],
  category: 'utility',
  execute: async (ctx) => {
    const { sock, m, from, isGroup, isAdmin, isBotAdmin, isOwner, body: msgBody, args, text, sender, senderJid, senderId, toFont, centerText, react } = ctx;
    const reply = (txt, opts) => sock.sendMessage(from, { text: typeof txt === 'string' ? toFont(txt) : String(txt), ...(opts||{}) }, { quoted: m });

    const len = parseInt(text) || 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < Math.min(len, 50); i++) pass += chars[Math.floor(Math.random() * chars.length)];
    reply(resultBox('PASSWORD GENERATOR 🔑', [centerText('Password Acak'), '🔐 ' + pass, '📏 Panjang: ' + pass.length + ' karakter']));
  }
};
