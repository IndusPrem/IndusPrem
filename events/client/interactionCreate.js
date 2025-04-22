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
    if (interaction.isButton() && interaction.customId === 'join_giveaway') {
      try {
        const giveaway = await Giveaway.findOne({
          messageId: interaction.message.id,
          ongoing: true,
        });

        if (!giveaway) {
          return await interaction.reply({
            content: 'This giveaway has ended or does not exist.',
            ephemeral: true,
          });
        }

        if (giveaway.requiredRole && !interaction.member.roles.cache.has(giveaway.requiredRole)) {
          return await interaction.reply({
            content: `You need the role <@&${giveaway.requiredRole}> to join this giveaway.`,
            ephemeral: true,
          });
        }

        if (giveaway.participants.includes(interaction.user.id)) {
          return await interaction.reply({
            content: 'You are already participating in this giveaway!',
            ephemeral: true,
          });
        }

        giveaway.participants.push(interaction.user.id);
        await giveaway.save();

        await interaction.reply({
          content: 'You have successfully joined the giveaway!',
          ephemeral: true,
        });
      } catch (error) {
        console.error('Giveaway button error:', error);
        if (!interaction.replied) {
          await interaction.reply({
            content: '❌ Failed to process giveaway join',
            ephemeral: true,
          }).catch(console.error);
        }
      }
      return;
    }

    // ========================
    // 3. AUTOCOMPLETE (your existing code)
    // ========================
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