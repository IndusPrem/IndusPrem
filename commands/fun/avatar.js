const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays the avatar of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose avatar you want to see')
        .setRequired(false)), // Optional, allows you to mention a user or leave it empty to get the avatar of the message author

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user; // If a user is mentioned, show their avatar, else show the author's avatar
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 }); // Get the avatar URL with a size of 1024px

    await interaction.reply({
      content: `${user.username}'s Avatar:`,
      embeds: [
        {
          color: 0x00FF00, // Green color for the embed
          title: `${user.username}'s Avatar`,
          image: {
            url: avatarUrl, // Display the avatar image
          },
          footer: {
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          },
        },
      ],
    });
  },
};
