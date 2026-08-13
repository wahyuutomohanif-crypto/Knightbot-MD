const { proto } = require('@whiskeysockets/baileys');

async function reply(sock, m, text, opts = {}) {
  return sock.sendMessage(m.key.remoteJid, { text: String(text), ...opts }, { quoted: m });
}

async function react(sock, m, emoji) {
  return sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
}

module.exports = { reply, react };
