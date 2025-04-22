const Giveaway = require('../../models/Giveaway');
const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // 1. CHAT INPUT COMMANDS
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        // Only defer if command doesn't suppress it
        if (!command.suppressDefer && !interaction.deferred && !interaction.replied) {
          await interaction.deferReply({ ephemeral: command.ephemeral || false });
        }
        
        await command.execute(interaction);
      } catch (error) {
        console.error(`Command ${interaction.commandName} failed:`, error);
        handleInteractionError(interaction, error);
      }
      return;
    }

    // 2. GIVEAWAY BUTTONS
    if (interaction.isButton() && interaction.customId === 'join_giveaway') {
      try {
        // ... [keep your existing giveaway code] ...
      } catch (error) {
        console.error('Giveaway button error:', error);
        handleInteractionError(interaction, error);
      }
      return;
    }

    // 3. AUTOCOMPLETE
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error('Autocomplete error:', error);
          await interaction.respond([]).catch(console.error);
        }
      }
      return;
    }
  },
};

// Helper function for consistent error handling
async function handleInteractionError(interaction, error) {
  try {
    if (interaction.replied) {
      await interaction.followUp({ 
        content: '❌ Command failed (check console)', 
        ephemeral: true 
      });
    } else if (interaction.deferred) {
      await interaction.editReply({ 
        content: '❌ Command failed (check console)'
      });
    } else {
      await interaction.reply({ 
        content: '❌ Command failed (check console)', 
        ephemeral: true 
      });
    }
  } catch (err) {
    console.error('Error handling failed:', err);
  }
}