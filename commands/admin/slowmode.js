const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) // Requires "Manage Channels" permission
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Slowmode duration (0 to disable)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600) // 6 hours = max Discord allows
    ),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.channel;

    try {
      await channel.setRateLimitPerUser(seconds);
      await interaction.reply(
        seconds === 0 
          ? '✅ Slowmode **disabled** in this channel.' 
          : `✅ Slowmode set to **${seconds} seconds** in this channel.`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Failed to set slowmode! Do I have "Manage Channels" permission?');
    }
  },
};