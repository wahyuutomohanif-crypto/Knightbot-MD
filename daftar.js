const { resultBox, infoBox } = require('../utils');
const { reply } = require('../helpers/message');
const db = require('../database');

module.exports = {
  command: ['daftar', 'register'],
  category: 'general',
  execute: async (ctx) => {
    const { arcxrona: sock, m, from, senderId, senderJid, isOwner } = ctx;
    const isOwnerReg_ctx = isOwner;
    const existing = db.getUser ? db.getUser(senderId) : null;
    if (existing) {
      // Auto-fix: kalau role masih 'user' tapi harusnya owner, update
      if (isOwnerReg_ctx && existing.role !== 'owner' && db.setRole) {
        db.setRole(senderId, 'owner');
      }
      const actualRole = (isOwnerReg_ctx && existing.role !== 'owner') ? 'owner' : (existing.role || 'user');
      return reply(sock, m, infoBox('SUDAH TERDAFTAR', {
        'Nama': existing.name || 'Unknown',
        'ID': senderId,
        'Status': actualRole
      }));
    }
    const name = m?.pushName || 'Unknown';
    const userRole = isOwnerReg_ctx ? 'owner' : 'user';
    if (db.addUser) db.addUser({ id: senderId, name, jid: senderJid, role: userRole });
    return reply(sock, m, resultBox('DAFTAR BERHASIL', [
      '✅ Kamu berhasil terdaftar!',
      '👤 Nama: ' + name,
      '🆔 ID: ' + senderId
    ]));
  }
};