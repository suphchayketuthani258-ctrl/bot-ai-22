require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getAIResponse } = require('./ai'); // ⭐ สำคัญ

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
  console.log(`✅ บอทออนไลน์: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.channel.name !== "⌊📝⌉-thai-airways-ai") return;

  // ⭐ ใช้ AI ตรงนี้
  const reply = await getAIResponse(message.content);

  message.reply(reply);
});

client.login(process.env.TOKEN);