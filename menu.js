
const { reply } = require('../helpers/message');
const { buildMenu, runtime } = require('../function.js');
const { centerText, menuBox, toFont } = require('../utils');

module.exports = {
  command: ['menu', 'allmenu'],
  execute: async (ctx) => {
    const { arcxrona: sock, m, from, args, body, toFont } = ctx;
    const { grouped, order } = buildMenu(global.prefix);

    const _p = global.prefix || '.';
    const _catArg = (ctx.args && ctx.args[0] ? ctx.args[0].toLowerCase() : '');
    const _isAll = (ctx.body||'').trim().toLowerCase().startsWith(_p+'allmenu');
    // .menu tanpa args → navigator
    if (!_isAll && !_catArg) {
const _navLines = [toFont(_p+'allmenu'), ...order.map(cat => toFont(_p+'menu') + ' ' + toFont(cat)), '', toFont('By') + ' ' + toFont(global.ownerName||global.botName||'Bot')];
      return await reply(sock, m, menuBox(toFont('MENU') + ' ' + toFont(global.botName||'Bot'), _navLines));
    }
    const _activeOrder = (_catArg && !_isAll && grouped[_catArg]) ? [_catArg] : order;


    let out = '';
    for (const cat of _activeOrder) {
      out += menuBox(toFont(cat), grouped[cat].map(function(cmd){ return toFont(_p+cmd); })) + '\n\n';
    }
    await reply(sock, m, out.trim());
  }
};

