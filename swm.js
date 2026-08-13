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
  try {
    const sharp = require('sharp');
    return await sharp(buf)
      .resize(512, 512, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .webp({ quality: 80 })
      .toBuffer();
  } catch(e) {}

  const tmp = path.join(process.cwd(), '_swm_in.' + ext);
  const out = path.join(process.cwd(), '_swm_out.webp');
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
    throw e2;
  }
}

async function injectExif(webpBuf, packname, author) {
  // Coba node-webpmux
  try {
    const { Image } = require('node-webpmux');
    const img = new Image();
    await img.load(webpBuf);

    if (!img.data?.extended) {
      img.data = img.data || {};
      img.data.extended = {
        hasAnim: false,
        hasAlpha: false,
        hasEXIF: false,
        hasICCP: false,
        hasXMP: false,
        width: img.width || 512,
        height: img.height || 512
      };
    }

    const json = JSON.stringify({
      'sticker-pack-name': packname,
      'sticker-pack-publisher': author,
      'android-app-store-link': '',
      'ios-app-store-link': ''
    });
    img.exif = Buffer.from(json, 'utf-8');
    return await img.save(null, { exif: true });
  } catch(e) {
    console.log('[swm] webpmux:', e.message);
  }

  // Fallback: append EXIF chunk langsung ke WebP
  if (webpBuf.slice(0,4).toString() !== 'RIFF') return webpBuf;
  const json = JSON.stringify({
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'android-app-store-link': '',
    'ios-app-store-link': ''
  });
  const jsonBuf = Buffer.from(json, 'utf-8');
  const sz = Buffer.alloc(4); sz.writeUInt32LE(jsonBuf.length);
  const pad = jsonBuf.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0);
  const exifChunk = Buffer.concat([Buffer.from('EXIF'), sz, jsonBuf, pad]);
  const body = webpBuf.slice(12);
  const riffSz = Buffer.alloc(4); riffSz.writeUInt32LE(4 + body.length + exifChunk.length);
  return Buffer.concat([Buffer.from('RIFF'), riffSz, Buffer.from('WEBP'), body, exifChunk]);
}

module.exports = {
  command: ["swm","setwm"],
  category: 'sticker',
  execute: async (ctx) => {
    const { sock, m, from, text, toFont } = ctx;
    const reply = (txt) => sock.sendMessage(from, { text: toFont(txt) }, { quoted: m });

    if (!text) return reply('📝 Format: .swm [nama pack] | [author]\nContoh: .swm My Bot | Arcxrona');

    let packname = 'Bot', author = 'Bot';
    if (text.includes('|')) {
      const [p, a] = text.split('|');
      packname = p.trim() || packname;
      author = a.trim() || author;
    } else {
      packname = text.trim();
    }

    const msg = m.message;
    const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
    const stickerMsg = msg?.stickerMessage || quoted?.stickerMessage;
    const imgMsg = msg?.imageMessage || quoted?.imageMessage;
    const vidMsg = msg?.videoMessage || quoted?.videoMessage;

    if (!stickerMsg && !imgMsg && !vidMsg) return reply('📎 Kirim/reply gambar, video, atau stiker dulu!');

    try {
      let webp;
      if (stickerMsg) webp = await dlMedia(stickerMsg, 'sticker');
      else if (imgMsg) webp = await toWebP(await dlMedia(imgMsg, 'image'), 'jpg');
      else webp = await toWebP(await dlMedia(vidMsg, 'video'), 'mp4');

      webp = await injectExif(webp, packname, author);
      await sock.sendMessage(from, { sticker: webp }, { quoted: m });
      reply(`✅ Stiker berhasil!\n📦 Pack: ${packname}\n✍️ Author: ${author}`);
    } catch(e) {
      reply('❌ Gagal: ' + e.message);
    }
  }
};
