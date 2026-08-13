const { resultBox } = require('../utils');
const { reply } = require('../helpers/message');
module.exports = {
  command: ['ping'],
  category: 'general',
  execute: async (ctx) => {
    const { arcxrona: sock, m, from } = ctx;
    const start = Date.now();
    const ms = Date.now() - start;
    return reply(sock, m, resultBox('PING', [
      '⚡ Pong!',
      '📶 Speed: ' + ms + 'ms'
    ]));
  }
};