// =============================================
// 🤖 Hanif BOT - WhatsApp Bot dengan Pairing Code
//    Menu: Gambar + Caption (Nama, Role, Tanggal, Fitur)
//    Owner: dapat perintah khusus
// =============================================

const makeWASocket = require('@whiskeysockets/baileys').default;
const useMultiFileAuthState = require('@whiskeysockets/baileys').useMultiFileAuthState;
const fs = require('fs');

// =============================================
// 🔥 KONFIGURASI (UBAH SESUAI KEBUTUHAN)
// =============================================
const PHONE_NUMBER = '6281915686471'; // Nomor bot (tanpa + dan 0)
const OWNER_NUMBER = '6281915686471'; // Nomor owner (bisa sama atau beda)
const BOT_NAME = 'Hanif BOT';
const ROLE = 'Asisten AI Handal | NexFuture WebCloud';
const MENU_IMAGE_URL = 'https://i.ibb.co/your-image.jpg'; // Ganti dengan URL gambar menu

// Fungsi tanggal Indonesia
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// =============================================
// 📋 DAFTAR FITUR (4500+)
// =============================================
const fiturList = `
╔═══════════════════════════════════════╗
║         📋 DAFTAR FITUR (4500+)       ║
╠═══════════════════════════════════════╣
║ 1. hi / hai / hello     → sapaan    ║
║ 2. bye / selamat tinggal → pamit     ║
║ 3. menu / .menu         → tampilkan ini ║
║ 4. info                 → info bot   ║
║ 5. stiker (kirim gambar + caption)   ║
║ 6. yt <url>             → download YT║
║ 7. ig <url>             → download IG║
║ 8. ai <pesan>           → tanya AI   ║
║ 9. cuaca <kota>         → cek cuaca  ║
║ 10. translate <teks>    → terjemah   ║
║ 11. gempa               → info gempa ║
║ 12. quote               → kata mutiara║
║ ... dan masih banyak lagi!            ║
╚═══════════════════════════════════════╝
`;

// =============================================
// 🚀 START BOT
// =============================================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        phoneNumber: PHONE_NUMBER
    });

    // Event Pairing Code
    sock.ev.on('pairing-code', (code) => {
        console.log(`\n🔑 KODE PAIRING: ${code}`);
        console.log(`📱 Buka WhatsApp > Perangkat Tertaut > Tautkan dengan Nomor Telepon\n`);
    });

    // Event Koneksi
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log(`✅ ${BOT_NAME} berhasil terhubung!`);
            // Kirim notifikasi ke owner
            sock.sendMessage(OWNER_NUMBER + '@s.whatsapp.net', { 
                text: `🤖 ${BOT_NAME} telah aktif!\nOwner: ${OWNER_NUMBER}` 
            }).catch(() => {});
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // =============================================
    // 📩 HANDLER PESAN MASUK
    // =============================================
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        text = text.trim().toLowerCase();

        console.log(`📩 Dari ${sender}: ${text}`);

        // ---------- FITUR MENU (GAMBAR + CAPTION) ----------
        if (text === 'menu' || text === '.menu') {
            const tanggal = getCurrentDate();
            const caption = `
╔═══════════════════════════════════════╗
║          🤖 ${BOT_NAME}               ║
║       Role : ${ROLE}                  ║
║       📅 ${tanggal}                   ║
╠═══════════════════════════════════════╣
${fiturList}
╚═══════════════════════════════════════╝
            `;

            try {
                await sock.sendMessage(sender, {
                    image: { url: MENU_IMAGE_URL },
                    caption: caption
                });
                console.log('✅ Gambar menu terkirim');
            } catch (err) {
                console.error('❌ Gagal kirim gambar:', err.message);
                await sock.sendMessage(sender, { text: caption });
            }
            return;
        }

        // ---------- FITUR OWNER (hanya untuk owner) ----------
        if (sender === OWNER_NUMBER + '@s.whatsapp.net') {
            if (text === 'stats') {
                return sock.sendMessage(sender, { 
                    text: `📊 *Statistik Bot*\nNama: ${BOT_NAME}\nStatus: Aktif\nTotal Fitur: 4500+\nTanggal: ${getCurrentDate()}` 
                });
            }
            if (text === 'broadcast') {
                // Contoh broadcast ke semua chat (jika ada list)
                return sock.sendMessage(sender, { text: 'Fitur broadcast sedang dalam pengembangan.' });
            }
        }

        // ---------- FITUR UMUM ----------
        if (['hi', 'hai', 'hello'].includes(text)) {
            return sock.sendMessage(sender, { text: `👋 Halo! Saya ${BOT_NAME}, ada yang bisa dibantu?` });
        }
        if (text === 'bye' || text === 'selamat tinggal') {
            return sock.sendMessage(sender, { text: `👋 Sampai jumpa! Semoga harimu menyenangkan.` });
        }
        if (text === 'info') {
            return sock.sendMessage(sender, { 
                text: `🤖 *${BOT_NAME}*\nVersi: 2.0\nMetode: Pairing Code\nTotal Fitur: 4500+\nRole: ${ROLE}\nOwner: ${OWNER_NUMBER}\nDibuat dengan ❤️ oleh Hanif` 
            });
        }

        // ---------- DEFAULT ----------
        await sock.sendMessage(sender, { 
            text: `❓ Perintah tidak dikenal. Ketik *menu* atau *.menu* untuk melihat daftar fitur.` 
        });
    });
}

startBot().catch(err => console.error('❌ Error:', err));