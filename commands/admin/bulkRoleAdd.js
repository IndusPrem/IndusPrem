const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bulkroleadd')
    .setDescription('Adds a role to every member in the server.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign to all members.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    // Permission check
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: 'I don\'t have permission to manage roles!', ephemeral: true });
    }

    await interaction.deferReply(); // Prevents timeout during mass update

    const members = await interaction.guild.members.fetch(); // Get all members

    let successCount = 0;
    for (const member of members.values()) {
      if (!member.roles.cache.has(role.id)) {
        try {
          await member.roles.add(role);
          successCount++;
        } catch (error) {
          console.error(`Failed to add role to ${member.user.tag}`, error);
        }
      }
    }

    await interaction.editReply(`✅ Added the role to ${successCount} members.`);
  }
};
