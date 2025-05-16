const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');
const { MongoClient } = require('mongodb');

// Add your mod IDs here
const MODERATOR_IDS = [
  '854365733781372938', // Replace with real IDs
  '1370368767888064553',
  '1323186302002139148',
  // up to 12
];

// MongoDB connection URI from environment
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modrep')
    .setDescription('Shows message count and voice hours for each mod (last 7 days).'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild } = interaction;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let modReport = [];

    for (const modId of MODERATOR_IDS) {
      let messageCount = 0;
      const member = await guild.members.fetch(modId).catch(() => null);
      if (!member) continue;

      // 1. Count Messages
      const textChannels = guild.channels.cache.filter(c => c.isTextBased() && c.viewable);
      for (const [_, channel] of textChannels) {
        try {
          const messages = await channel.messages.fetch({ limit: 100 });
          const recentMessages = messages.filter(msg =>
            msg.author.id === modId && msg.createdTimestamp >= sevenDaysAgo
          );
          messageCount += recentMessages.size;
        } catch (err) {
          console.warn(`Skipping ${channel.name}: ${err.message}`);
        }
      }

      // 2. Voice Hours from MongoDB
      let voiceDurationMs = 0;
      try {
        await client.connect();
        const db = client.db('indus');
        const collection = db.collection('voiceSessions');

        const sessions = await collection.find({
          userId: modId,
          joinTime: { $gte: new Date(sevenDaysAgo) },
        }).toArray();

        for (const session of sessions) {
          const leave = session.leaveTime || new Date();
          voiceDurationMs += new Date(leave) - new Date(session.joinTime);
        }
      } catch (err) {
        console.error(`MongoDB error: ${err.message}`);
      }

      const voiceHours = (voiceDurationMs / (1000 * 60 * 60)).toFixed(2);

      modReport.push({
        tag: member.user.tag,
        messages: messageCount,
        voiceHours,
      });
    }

    // Send as embed
    const embed = new EmbedBuilder()
      .setTitle('🛡️ Moderator Report (Last 7 Days)')
      .setColor('DarkBlue')
      .setTimestamp();

    for (const mod of modReport) {
      embed.addFields({
        name: mod.tag,
        value: `📝 Messages: ${mod.messages}\n🎙️ Voice Hours: ${mod.voiceHours}`,
        inline: false,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
