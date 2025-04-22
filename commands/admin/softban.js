const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban then unban a user to delete their messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to softban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for softban')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      // Ban the user
      await interaction.guild.members.ban(user, { reason: `Softban: ${reason}` });
      
      // Immediately unban
      await interaction.guild.members.unban(user, 'Softban auto-unban');
      
      await interaction.reply({
        content: `✅ ${user.tag} was softbanned. Messages deleted.`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `❌ Failed to softban ${user.tag}. Do I have ban permissions?`,
        ephemeral: true
      });
    }
  },
};