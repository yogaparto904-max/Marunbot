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
  EmbedBuilder
} = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

// ⚠️ CONFIG
const CREATE_CHANNEL_ID = '1488240217268687115';
const CATEGORY_ID = '1488160144981495888';
const PANEL_CHANNEL_ID = '1488175079417446603';
const AUTO_VC_ID = "1488854856633680083"; // 🔥 TAMBAHAN (VC BOT)

const userSelectedGame = new Map();

// ================= GAME DATA =================
const gameData = {
  'Apex Legends': 3,
  'Counter-Strike 2': 5,
  'Dota 2': 5,
  'Fortnite': 4,
  'GTA V': 32,
  'League of Legends': 5,
  'Minecraft': 30,
  'Point Blank': 8,
  "PlayerUnknown's Battlegrounds": 4,
  'Rainbow Six Siege': 5,
  'Valorant': 5,
  'Delta Force': 4,

  'Among Us': 15,
  'Arena of Valor': 5,
  'Apex Legends Mobile': 3,
  'Call of Duty Mobile': 5,
  'Free Fire': 4,
  'Genshin Impact': 4,
  'LoL: Wild Rift': 5,
  'Mobile Legends': 5,
  'Pokemon Unite': 5,
  'PUBG Mobile': 4,
  'Sausage Man': 4,
  'Super Sus': 10,
  'Stumble Guys': 32,
  'Honor of Kings': 5
};

// ================= PANEL =================
async function sendPanel(channel) {
  const embed = new EmbedBuilder()
    .setTitle('BETLEHEM Game Lounge')
    .setDescription(
      'Menu ini digunakan untuk membuat Gaming Lounge.\n\n' +
      '**Cara Menggunakannya:**\n' +
      `Silahkan masuk ke <#${CREATE_CHANNEL_ID}> lalu pilih game melalui menu dibawah ini.\n\n` +
      'Jika ada masalah dengan Gaming Lounge. Silahkan hubungi **STAFF**.\n\n' +
      'Marun - ©2018 BETLEHEM'
    );

  const pcMenu = new StringSelectMenuBuilder()
    .setCustomId('pc_games')
    .setPlaceholder('PC Game List')
    .addOptions([
      { label: 'Apex Legends', value: 'Apex Legends', description: 'Limit Room: 3 users', emoji: { id: '1488234574109610096' } },
      { label: 'Counter-Strike 2', value: 'Counter-Strike 2', description: 'Limit Room: 5 users', emoji: { id: '1488229246441754744' } },
      { label: 'Dota 2', value: 'Dota 2', description: 'Limit Room: 5 users', emoji: { id: '1488225450865066064' } },
      { label: 'Fortnite', value: 'Fortnite', description: 'Limit Room: 4 users', emoji: { id: '1488229574780391434' } },
      { label: 'GTA V', value: 'GTA V', description: 'Limit Room: 32 users', emoji: { id: '1488229820977516666' } },
      { label: 'League of Legends', value: 'League of Legends', description: 'Limit Room: 5 users', emoji: { id: '1488230038808821851' } },
      { label: 'Minecraft', value: 'Minecraft', description: 'Limit Room: 30 users', emoji: { id: '1488230360260284488' } },
      { label: 'Point Blank', value: 'Point Blank', description: 'Limit Room: 8 users', emoji: { id: '1488230516355240037' } },
      { label: "PlayerUnknown's Battlegrounds", value: "PlayerUnknown's Battlegrounds", description: 'Limit Room: 4 users', emoji: { id: '1488230934602973325' } },
      { label: 'Rainbow Six Siege', value: 'Rainbow Six Siege', description: 'Limit Room: 5 users', emoji: { id: '1488231298135752748' } },
      { label: 'Valorant', value: 'Valorant', description: 'Limit Room: 5 users', emoji: { id: '1488225389724700724' } }
    ]);

  const mobileMenu = new StringSelectMenuBuilder()
    .setCustomId('mobile_games')
    .setPlaceholder('Mobile Game List')
    .addOptions([
      { label: 'Among Us', value: 'Among Us', description: 'Limit Room: 15 users', emoji: { id: '1488232855724101853' } },
      { label: 'Arena of Valor', value: 'Arena of Valor', description: 'Limit Room: 5 users', emoji: { id: '1488232953292001452' } },
      { label: 'Apex Legends Mobile', value: 'Apex Legends Mobile', description: 'Limit Room: 3 users', emoji: { id: '1488233017087492167' } },
      { label: 'Call of Duty Mobile', value: 'Call of Duty Mobile', description: 'Limit Room: 5 users', emoji: { id: '1488233107642515496' } },
      { label: 'Free Fire', value: 'Free Fire', description: 'Limit Room: 4 users', emoji: { id: '1488233144732876820' } },
      { label: 'Genshin Impact', value: 'Genshin Impact', description: 'Limit Room: 4 users', emoji: { id: '1488233389638156391' } },
      { label: 'LoL: Wild Rift', value: 'LoL: Wild Rift', description: 'Limit Room: 5 users', emoji: { id: '1488233476292608171' } },
      { label: 'Mobile Legends', value: 'Mobile Legends', description: 'Limit Room: 5 users', emoji: { id: '1488225517113966673' } },
      { label: 'Pokemon Unite', value: 'Pokemon Unite', description: 'Limit Room: 5 users', emoji: { id: '1488233568042750144' } },
      { label: 'PUBG Mobile', value: 'PUBG Mobile', description: 'Limit Room: 4 users', emoji: { id: '1488233818153418824' } },
      { label: 'Sausage Man', value: 'Sausage Man', description: 'Limit Room: 4 users', emoji: { id: '1488233909241118721' } },
      { label: 'Super Sus', value: 'Super Sus', description: 'Limit Room: 10 users', emoji: { id: '1488233979168559257' } },
      { label: 'Stumble Guys', value: 'Stumble Guys', description: 'Limit Room: 32 users', emoji: { id: '1488234053906989126' } },
      { label: 'Honor of Kings', value: 'Honor of Kings', description: 'Limit Room: 5 users', emoji: { id: '1488234145787154653' } }
    ]);

  await channel.send({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(pcMenu),
      new ActionRowBuilder().addComponents(mobileMenu)
    ]
  });
}

// ================= READY =================
client.once('clientReady', async () => {
  console.log(`Login sebagai ${client.user.tag}`);

  const channel = await client.channels.fetch(PANEL_CHANNEL_ID);
  if (channel) sendPanel(channel);

  // 🔥 AUTO JOIN VC (TAMBAHAN DOANG)
  try {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const vc = guild.channels.cache.get(AUTO_VC_ID);
    if (!vc || vc.type !== ChannelType.GuildVoice) return;

    joinVoiceChannel({
      channelId: vc.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false
    });

    console.log("Bot auto join VC");
  } catch (err) {
    console.log(err);
  }
});

// ================= CREATE ROOM =================
async function createRoom(member, game) {
  const limit = gameData[game] || 5;

  const channel = await member.guild.channels.create({
    name: `🎮 ${game}`,
    type: ChannelType.GuildVoice,
    parent: CATEGORY_ID,
    userLimit: limit
  });

  await member.voice.setChannel(channel);
  userSelectedGame.delete(member.id);
}

// ================= SELECT =================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const game = interaction.values[0];
  userSelectedGame.set(interaction.user.id, game);

  const member = await interaction.guild.members.fetch(interaction.user.id);

  if (member.voice.channel && member.voice.channel.id === CREATE_CHANNEL_ID) {
    await createRoom(member, game);
    return interaction.reply({ content: `🚀 Room ${game} berhasil dibuat!`, ephemeral: true });
  }

  await interaction.reply({
    content: `✅ Game dipilih: ${game}\nMasuk ke <#${CREATE_CHANNEL_ID}>`,
    ephemeral: true
  });
});

// ================= VOICE =================
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (
    newState.channelId === CREATE_CHANNEL_ID &&
    oldState.channelId !== CREATE_CHANNEL_ID
  ) {
    const game = userSelectedGame.get(newState.member.id);
    if (game) await createRoom(newState.member, game);
  }

  if (
    oldState.channel &&
    oldState.channel.id !== CREATE_CHANNEL_ID &&
    oldState.channel.parentId === CATEGORY_ID &&
    oldState.channel.members.size === 0
  ) {
    oldState.channel.delete().catch(() => {});
  }
});

client.login(TOKEN);
