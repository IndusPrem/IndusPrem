const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const spamCache = new Map(); // Stores user message timestamps

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anti-spam')
    .setDescription('Toggle spam auto-deletion')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Enable/disable spam protection')
        .setRequired(true)
        .addChoices(
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' },
        )),

  async execute(interaction) {
    const action = interaction.options.getString('action');
    const isEnabled = action === 'enable';

    // Store state (e.g., in a database or global variable)
    global.antiSpamEnabled = isEnabled;

    await interaction.reply(
      isEnabled 
        ? '✅ Anti-spam enabled. I\'ll delete spam messages.' 
        : '❌ Anti-spam disabled.'
    );
  },
};