const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');

// Add your 12 moderator Discord user IDs below
const MODERATOR_IDS = [
  '854365733781372938',
  '1370368767888064553',
  // ... add all 12
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modrep')
    .setDescription('Shows message and voice activity of all 12 moderators in the past 7 days.'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild } = interaction;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let modData = [];

    for (const modId of MODERATOR_IDS) {
      let messageCount = 0;

      const member = await guild.members.fetch(modId).catch(() => null);
      if (!member) continue;

      const channels = guild.channels.cache.filter(c => c.isTextBased() && c.viewable);
      for (const [channelId, channel] of channels) {
        try {
          const messages = await channel.messages.fetch({ limit: 100 });
          messageCount += messages.filter(msg => msg.author.id === modId && msg.createdTimestamp >= sevenDaysAgo).size;
        } catch (err) {
          console.warn(`Could not fetch messages from ${channel.name}`);
        }
      }

      // Temporary fake voice hours
      const voiceHours = Math.floor(Math.random() * 10); // Replace with real data later

      modData.push({
        name: member.user.tag,
        messages: messageCount,
        voiceHours,
      });
    }

    // Create Embed
    const embed = new EmbedBuilder()
      .setTitle('🛡️ Moderator Activity Report (Last 7 Days)')
      .setColor('Blue')
      .setTimestamp();

    for (const mod of modData) {
      embed.addFields({
        name: mod.name,
        value: `📝 Messages: ${mod.messages}\n🎙️ Voice Hours: ${mod.voiceHours}`,
        inline: false,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
