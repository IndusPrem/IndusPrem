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
  
  async execute(interaction) {
    try {
      // Defer the reply first to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      const state = interaction.options.getString('state');
      const isEnabled = state === 'enable';

      // Update global state (replace with your preferred storage)
      global.antiSpamEnabled = isEnabled;

      await interaction.editReply(
        isEnabled 
          ? '✅ Anti-spam protection enabled' 
          : '❌ Anti-spam protection disabled'
      );
    } catch (error) {
      console.error('Anti-spam command error:', error);
      if (!interaction.replied) {
        await interaction.followUp({ 
          content: '❌ Failed to process command', 
          ephemeral: true 
        });
      }
    }
  }
};