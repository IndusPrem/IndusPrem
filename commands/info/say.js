const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something.')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('What should I say?')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check if the user has 'Administrator' permission
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
    }

    const msg = interaction.options.getString('message');

    // Optional: delete the user's command message to keep chat clean
    await interaction.reply({ content: '✅ Message sent!', ephemeral: true });

    // Send the actual message in the channel
    await interaction.channel.send(msg);
  },
};
