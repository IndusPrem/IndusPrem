const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bulkaddrole')
    .setDescription('Add a role to multiple users')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('user1')
        .setDescription('First user')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('user2')
        .setDescription('Second user')
        .setRequired(false)
    )
    .addUserOption(option =>
      option.setName('user3')
        .setDescription('Third user')
        .setRequired(false)
    )
    .addUserOption(option =>
      option.setName('user4')
        .setDescription('Fourth user')
        .setRequired(false)
    )
    .addUserOption(option =>
      option.setName('user5')
        .setDescription('Fifth user')
        .setRequired(false)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const users = [];

    for (let i = 1; i <= 5; i++) {
      const user = interaction.options.getUser(`user${i}`);
      if (user) users.push(user);
    }

    let added = [];
    let failed = [];

    for (const user of users) {
      try {
        const member = await interaction.guild.members.fetch(user.id);
        await member.roles.add(role);
        added.push(user.username);
      } catch (err) {
        console.error(`Failed to add role to ${user.username}`, err);
        failed.push(user.username);
      }
    }

    await interaction.reply({
      content: `✅ Added role to: ${added.join(', ')}\n❌ Failed for: ${failed.join(', ') || 'None'}`,
      ephemeral: true
    });
  }
};
