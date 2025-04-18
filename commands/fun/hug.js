const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a warm hug!')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Who do you want to hug?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');

    if (target.id === interaction.user.id) {
      return interaction.reply("Aww, don't be sad. Here's a hug from me! 🤗");
    }

    const hugGifs = [
      'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
      'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
      'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif',
      'https://media.giphy.com/media/IRUb7GTCaPU8E/giphy.gif'
    ];

    const randomGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFC0CB')
      .setDescription(`🤗 ${interaction.user} gives ${target} a warm hug!`)
      .setImage(randomGif)
      .setFooter({ text: 'Spread the love!' });

    await interaction.reply({ embeds: [embed] });
  }
};
