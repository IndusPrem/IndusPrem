const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anti-spam')
    .setDescription('Toggle spam protection')
    .addStringOption(option =>
      option.setName('state')
        .setDescription('Enable or disable spam protection')
        .setRequired(true)
        .addChoices(
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' }
        )),
  
  // Add this to prevent auto-defer in interactionCreate
  suppressDefer: true,
  
  async execute(interaction) {
    try {
      // Immediately reply instead of deferring
      const state = interaction.options.getString('state');
      const isEnabled = state === 'enable';

      global.antiSpamEnabled = isEnabled;

      await interaction.reply({
        content: isEnabled 
          ? '✅ Anti-spam protection enabled' 
          : '❌ Anti-spam protection disabled',
        ephemeral: true
      });
    } catch (error) {
      console.error('Anti-spam command error:', error);
      if (!interaction.replied) {
        await interaction.reply({ 
          content: '❌ Failed to process command', 
          ephemeral: