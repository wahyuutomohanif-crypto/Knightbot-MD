const { infoBox, resultBox } = require('../utils');
const { reply } = require('../helpers/message');

module.exports = {
  command: ['owner', 'myid'],
  category: 'general',
  execute: async (ctx) => {
    const { arcxrona: sock, m, senderId, senderJid } = ctx;
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    const cmd = body.trim().slice(global.prefix.length).split(' ')[0].toLowerCase();

    if (cmd === 'myid') {
      return reply(sock, m, resultBox('MY ID', [
        '\uD83C\uDD94 ID: ' + senderId,
        '\uD83D\uDCCC JID: ' + senderJid
      ]));
    }

    return reply(sock, m, infoBox('OWNER', {
      'Owner': '@' + global.owner,
      'Prefix': global.prefix,
      'Bot': global.botName
    }));
  }
};