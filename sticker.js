const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function dlMedia(msgObj, type) {
  const stream = await downloadContentFromMessage(msgObj, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function execCmd(cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) rej(new Error(stderr || err.message));
      else res(stdout);
    });
  });
}

async function toWebP(buf, ext) {
  // VPS: coba sharp dulu
  try {
    const sharp = require('sharp');
    return await sharp(buf)
      .resize(512, 512, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .webp({ quality: 80 })
      .toBuffer();
  } catch(e) {}

  // Termux/Android: pakai ffmpeg
  const tmp = path.join(process.cwd(), '_stk_in.' + ext);
  const out = path.join(process.cwd(), '_stk_out.webp');
  try {
    fs.writeFileSync(tmp, buf);
    await execCmd(
      `ffmpeg -y -i "${tmp}" ` +
      `-vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" ` +
      `-vcodec libwebp -lossless 0 -compression_level 6 -q:v 50 -loop 0 -preset picture -an -fps_mode vfr "${out}"`
    );
    const result = fs.readFileSync(out);
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    if (fs.existsSync(out)) fs.unlinkSync(out);
    return result;
  } catch(e2) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    if (fs.existsSync(out)) fs.unlinkSync(out);
    throw new Error('Butuh sharp (VPS) atau ffmpeg (Termux) untuk membuat sticker');
  }
}

module.exports = {
  command: ["sticker","stiker","s"],
  category: 'sticker',
  execute: async (ctx) => {
    const { sock, m, from, toFont } = ctx;
    const reply = (txt) => sock.sendMessage(from, { text: toFont(txt) }, { quoted: m });

    const msg = m.message;
    const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imgMsg = msg?.imageMessage || quoted?.imageMessage;
    const vidMsg = msg?.videoMessage || quoted?.videoMessage;

    if (!imgMsg && !vidMsg) return reply('📸 Kirim/reply foto atau video dulu!');

    try {
      let buf, ext;
      if (imgMsg) { buf = await dlMedia(imgMsg, 'image'); ext = 'jpg'; }
      else { buf = await dlMedia(vidMsg, 'video'); ext = 'mp4'; }

      const webp = await toWebP(buf, ext);
      await sock.sendMessage(from, { sticker: webp }, { quoted: m });
    } catch(e) {
      reply('❌ Gagal: ' + e.message);
    }
  }
};
