const Giveaway = require('../../models/Giveaway');
const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // ========================
    // 1. CHAT INPUT COMMANDS
    // ========================
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        // Defer reply first to prevent timeout
        if (!command.suppressDefer) {
          await interaction.deferReply({ ephemeral: command.ephemeral || false });
        }
        
        await command.execute(interaction);
      } catch (error) {
        console.error(`Command ${interaction.commandName} failed:`, error);
        
        try {
          if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ 
              content: '❌ Command failed (check console)', 
              ephemeral: true 
            });
          } else {
            await interaction.reply({ 
              content: '❌ Command failed (check console)', 
              ephemeral: true 
            });
          }
        } catch (err) {
          console.error('Failed to send error message:', err);
        }
      }
      return;
    }

    // ========================
    // 2. GIVEAWAY BUTTONS (your existing code)
    // ========================
    if (interaction.isButton() && interaction.custom