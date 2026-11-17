require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot aktif!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Web server jalan");
});

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

// =======================
// ⚙️ CONFIG
// =======================
const TOKEN = process.env.TOKEN;

const CREATE_CHANNEL_ID = "1488240217268687115";
const CATEGORY_ID = "1488160144981495888";
const PANEL_CHANNEL_ID = "1488175079417446603";
const AUTO_VC_ID = "1488854856633680083";

const PANEL_TITLE = "BETLEHEM Game Lounge";
const ROOM_PREFIX = "🎮 ";
const LOGO_URL = "https://media.discordapp.net/attachments/1487590787284734143/1492050545219862598/bthl.png";
const FOOTER_TEXT = "Marun • Copyright ©2018 - BETLEHEM";

const userSelectedGame = new Map();

const gameData = {
  "Apex Legends": 3,
  "Counter-Strike 2": 5,
  "Dota 2": 5,
  "Fortnite": 4,
  "GTA V": 32,
  "League of Legends": 5,
  "Minecraft": 30,
  "Point Blank": 8,
  "PlayerUnknown's Battlegrounds": 4,
  "Rainbow Six Siege": 5,
  "Valorant": 5,
  "Delta Force": 4,

  "Among Us": 15,
  "Arena of Valor": 5,
  "Apex Legends Mobile": 3,
  "Call of Duty Mobile": 5,
  "Free Fire": 4,
  "Genshin Impact": 4,
  "LoL: Wild Rift": 5,
  "Mobile Legends": 5,
  "Pokemon Unite": 5,
  "PUBG Mobile": 4,
  "Sausage Man": 4,
  "Super Sus": 10,
  "Stumble Guys": 32,
  "Honor of Kings": 5
};

// =======================
// 🎨 EMBED HELPER
// =======================
function baseEmbed(guild) {
  return new EmbedBuilder()
    .setAuthor({ name: "BETLEHEM", iconURL: LOGO_URL })
    .setFooter({ text: FOOTER_TEXT, iconURL: guild?.iconURL() || undefined })
    .setTimestamp();
}

// =======================
// 🔥 AUTO JOIN + AUTO REJOIN VC
// =======================
async function connectToVC() {
  try {
    const vc = await client.channels.fetch(AUTO_VC_ID).catch(() => null);
    if (!vc || vc.type !== ChannelType.GuildVoice) {
      return console.log("❌ VC tidak ditemukan");
    }

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    console.log("🎤 Bot auto join VC");

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000)
        ]);
      } catch {
        console.log("🔄 Bot keluar VC, rejoin...");
        try { connection.destroy(); } catch {}
        setTimeout(connectToVC, 3000);
      }
    });
  } catch (err) {
    console.log("❌ Error join VC:", err);
    setTimeout(connectToVC, 5000);
  }
}

// =======================
// 📦 PANEL (TIDAK NYAMPAH)
// =======================
function buildMenus() {
  const pcMenu = new StringSelectMenuBuilder()
    .setCustomId("pc_games")
    .setPlaceholder("💻 PC Game List")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions([
      { label: "Apex Legends", value: "Apex Legends", description: "Limit Room: 3 users", emoji: { id: "1488234574109610096" } },
      { label: "Counter-Strike 2", value: "Counter-Strike 2", description: "Limit Room: 5 users", emoji: { id: "1488229246441754744" } },
      { label: "Dota 2", value: "Dota 2", description: "Limit Room: 5 users", emoji: { id: "1488225450865066064" } },
      { label: "Fortnite", value: "Fortnite", description: "Limit Room: 4 users", emoji: { id: "1488229574780391434" } },
      { label: "GTA V", value: "GTA V", description: "Limit Room: 32 users", emoji: { id: "1488229820977516666" } },
      { label: "League of Legends", value: "League of Legends", description: "Limit Room: 5 users", emoji: { id: "1488230038808821851" } },
      { label: "Minecraft", value: "Minecraft", description: "Limit Room: 30 users", emoji: { id: "1488230360260284488" } },
      { label: "Point Blank", value: "Point Blank", description: "Limit Room: 8 users", emoji: { id: "1488230516355240037" } },
      { label: "PlayerUnknown's Battlegrounds", value: "PlayerUnknown's Battlegrounds", description: "Limit Room: 4 users", emoji: { id: "1488230934602973325" } },
      { label: "Rainbow Six Siege", value: "Rainbow Six Siege", description: "Limit Room: 5 users", emoji: { id: "1488231298135752748" } },
      { label: "Valorant", value: "Valorant", description: "Limit Room: 5 users", emoji: { id: "1488225389724700724" } },
      { label: "Delta Force", value: "Delta Force", description: "Limit Room: 4 users", emoji: { id: "1488225389724700724" } }
    ]);

  const mobileMenu = new StringSelectMenuBuilder()
    .setCustomId("mobile_games")
    .setPlaceholder("📱 Mobile Game List")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions([
      { label: "Among Us", value: "Among Us", description: "Limit Room: 15 users", emoji: { id: "1488232855724101853" } },
      { label: "Arena of Valor", value: "Arena of Valor", description: "Limit Room: 5 users", emoji: { id: "1488232953292001452" } },
      { label: "Apex Legends Mobile", value: "Apex Legends Mobile", description: "Limit Room: 3 users", emoji: { id: "1488233017087492167" } },
      { label: "Call of Duty Mobile", value: "Call of Duty Mobile", description: "Limit Room: 5 users", emoji: { id: "1488233107642515496" } },
      { label: "Free Fire", value: "Free Fire", description: "Limit Room: 4 users", emoji: { id: "1488233144732876820" } },
      { label: "Genshin Impact", value: "Genshin Impact", description: "Limit Room: 4 users", emoji: { id: "1488233389638156391" } },
      { label: "LoL: Wild Rift", value: "LoL: Wild Rift", description: "Limit Room: 5 users", emoji: { id: "1488233476292608171" } },
      { label: "Mobile Legends", value: "Mobile Legends", description: "Limit Room: 5 users", emoji: { id: "1488225517113966673" } },
      { label: "Pokemon Unite", value: "Pokemon Unite", description: "Limit Room: 5 users", emoji: { id: "1488233568042750144" } },
      { label: "PUBG Mobile", value: "PUBG Mobile", description: "Limit Room: 4 users", emoji: { id: "1488233818153418824" } },
      { label: "Sausage Man", value: "Sausage Man", description: "Limit Room: 4 users", emoji: { id: "1488233909241118721" } },
      { label: "Super Sus", value: "Super Sus", description: "Limit Room: 10 users", emoji: { id: "1488233979168559257" } },
      { label: "Stumble Guys", value: "Stumble Guys", description: "Limit Room: 32 users", emoji: { id: "1488234053906989126" } },
      { label: "Honor of Kings", value: "Honor of Kings", description: "Limit Room: 5 users", emoji: { id: "1488234145787154653" } }
    ]);

  return [
    new ActionRowBuilder().addComponents(pcMenu),
    new ActionRowBuilder().addComponents(mobileMenu)
  ];
}

function buildPanelEmbed(guild) {
  return baseEmbed(guild)
    .setColor("#FFD700")
    .setTitle(PANEL_TITLE)
    .setDescription(
      "Menu ini digunakan untuk membuat **Gaming Lounge** pribadi kamu 🎮\n\n" +
      "**📋 Cara Menggunakan**\n" +
      `> **1.** Masuk ke voice <#${CREATE_CHANNEL_ID}>\n` +
      "> **2.** Pilih game melalui menu di bawah\n" +
      "> **3.** Room otomatis dibuat & kamu langsung dipindahkan ✨\n\n" +
      "Room akan **terhapus otomatis** saat sudah kosong.\n" +
      "Ada kendala? Hubungi **ADMIN/PENJAGA**."
    );
}

async function sendOrUpdatePanel() {
  const channel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);
  if (!channel) return console.log("❌ Channel panel tidak ditemukan");

  // Cari panel lama milik bot di channel
  const recent = await channel.messages.fetch({ limit: 100 }).catch(() => null);
  const panels = recent
    ? [...recent.filter(m =>
        m.author.id === client.user.id &&
        m.embeds[0]?.title === PANEL_TITLE
      ).values()] // urut terbaru dulu
    : [];

  const panelMsg = panels[0] || null;

  // Hapus panel duplikat yang numpuk
  for (const m of panels.slice(1)) {
    await m.delete().catch(() => {});
    console.log(`🧹 Hapus panel duplikat ${m.id}`);
  }

  const payload = {
    embeds: [buildPanelEmbed(channel.guild)],
    components: buildMenus()
  };

  if (panelMsg) {
    try {
      await panelMsg.edit(payload);
      console.log("♻️ Panel di-update");
      return;
    } catch {
      console.log("⚠️ Gagal edit panel, kirim ulang");
      await panelMsg.delete().catch(() => {});
    }
  }

  await channel.send(payload);
  console.log("✅ Panel dikirim");
}

// =======================
// 🧹 BERSIHKAN ROOM KOSONG
// =======================
function isLoungeRoom(channel) {
  return (
    channel &&
    channel.type === ChannelType.GuildVoice &&
    channel.parentId === CATEGORY_ID &&
    channel.id !== CREATE_CHANNEL_ID &&
    channel.id !== AUTO_VC_ID &&
    channel.name.startsWith(ROOM_PREFIX)
  );
}

async function cleanupEmptyRooms() {
  const category = await client.channels.fetch(CATEGORY_ID).catch(() => null);
  if (!category) return;

  for (const ch of category.children.cache.values()) {
    if (isLoungeRoom(ch) && ch.members.size === 0) {
      await ch.delete().catch(() => {});
      console.log(`🧹 Hapus room kosong: ${ch.name}`);
    }
  }
}

// =======================
// 🚀 READY
// =======================
client.once("clientReady", async () => {
  console.log(`Login sebagai ${client.user.tag}`);

  setTimeout(connectToVC, 3000);

  try {
    await sendOrUpdatePanel();
  } catch (err) {
    console.log("❌ Error setup panel:", err);
  }

  // room sisa sebelum restart yang sudah kosong
  await cleanupEmptyRooms().catch(() => {});
});

// =======================
// 🎮 CREATE ROOM
// =======================
async function createRoom(member, game) {
  const limit = gameData[game] || 5;

  const channel = await member.guild.channels.create({
    name: `${ROOM_PREFIX}${game}`,
    type: ChannelType.GuildVoice,
    parent: CATEGORY_ID,
    userLimit: limit
  });

  await member.voice.setChannel(channel);
  userSelectedGame.delete(member.id);

  return channel;
}

// =======================
// 🎯 DROPDOWN HANDLER
// =======================
client.on("interactionCreate", async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  if (
    !interaction.customId.startsWith("pc_games") &&
    !interaction.customId.startsWith("mobile_games")
  ) return;

  await interaction.deferUpdate();

  // reset dropdown ke placeholder supaya bisa dipilih ulang
  interaction.editReply({ components: buildMenus() }).catch(() => {});

  const game = interaction.values[0];
  const limit = gameData[game] || 5;
  userSelectedGame.set(interaction.user.id, game);

  const member = await interaction.guild.members.fetch(interaction.user.id);

  // Sudah di voice "create" → langsung buat room
  if (member.voice.channelId === CREATE_CHANNEL_ID) {
    try {
      const room = await createRoom(member, game);

      return interaction.followUp({
        embeds: [
          baseEmbed(interaction.guild)
            .setColor("#57F287")
            .setTitle("🚀 ROOM BERHASIL DIBUAT")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(
              `> Hai **${member.displayName}**, room kamu sudah siap!\n\n` +
              `**🎮 Game**\n> ${game}\n\n` +
              `**🔊 Room**\n> <#${room.id}>\n\n` +
              `**👥 Limit**\n> ${limit} users\n\n` +
              "*Room terhapus otomatis saat sudah kosong.*"
            )
        ],
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      console.log("❌ Gagal buat room:", err.message);
      return interaction.followUp({
        embeds: [
          baseEmbed(interaction.guild)
            .setColor("#ED4245")
            .setTitle("⚠️ Gagal Membuat Room")
            .setDescription("> Terjadi kendala saat membuat room.\n> Silahkan hubungi **ADMIN/PENJAGA** ya.")
        ],
        flags: MessageFlags.Ephemeral
      });
    }
  }

  // Belum di voice "create" → simpan pilihan, suruh masuk
  await interaction.followUp({
    embeds: [
      baseEmbed(interaction.guild)
        .setColor("#FFD700")
        .setTitle("✅ GAME DIPILIH")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription(
          `> Hai **${member.displayName}**, pilihan kamu sudah disimpan!\n\n` +
          `**🎮 Game**\n> ${game}\n\n` +
          `**👥 Limit**\n> ${limit} users\n\n` +
          `**➡️ Langkah Selanjutnya**\n> Masuk ke voice <#${CREATE_CHANNEL_ID}>, room akan dibuat otomatis ✨`
        )
    ],
    flags: MessageFlags.Ephemeral
  });
});

// =======================
// 🔊 VOICE HANDLER
// =======================
client.on("voiceStateUpdate", async (oldState, newState) => {
  // Masuk ke voice "create" → buat room kalau sudah pilih game
  if (
    newState.channelId === CREATE_CHANNEL_ID &&
    oldState.channelId !== CREATE_CHANNEL_ID
  ) {
    const game = userSelectedGame.get(newState.member.id);

    if (game) {
      await createRoom(newState.member, game).catch(err =>
        console.log("❌ Gagal buat room:", err.message)
      );
    }
  }

  // Keluar dari room lounge → hapus kalau kosong
  const oldChannel = oldState.channel;
  if (isLoungeRoom(oldChannel) && oldState.channelId !== newState.channelId) {
    setTimeout(() => {
      if (oldChannel.members.size === 0) {
        oldChannel.delete().catch(() => {});
      }
    }, 3000);
  }
});

// =======================
// 🛡️ ANTI CRASH
// =======================
process.on("unhandledRejection", err => console.log("Unhandled Rejection:", err));
process.on("uncaughtException", err => console.log("Uncaught Exception:", err));

client.login(TOKEN);
