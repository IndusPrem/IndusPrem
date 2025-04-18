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
    const msg = interaction.options.getString('message');

    // Optional: delete the user's command to keep chat clean
    await interaction.reply({ content: '✅ Message sent!', ephemeral: true });

    // Send the actual message in the channel
    await interaction.channel.send(msg);
  },
};
