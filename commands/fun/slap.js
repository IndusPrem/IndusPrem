const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone playfully!')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Who do you want to slap?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');

    if (target.id === interaction.user.id) {
      return interaction.reply("Why are you slapping yourself? 😵");
    }

    const slapGifs = [
      'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
      'https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.gif',
      'https://media.giphy.com/media/mEtSQlxqBtWWA/giphy.gif',
      'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif',
      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif'
    ];

    const randomGif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription(`👋 ${interaction.user} just slapped ${target} real hard!`)
      .setImage(randomGif)
      .setFooter({ text: 'Ouch! That must’ve hurt!' });

    await interaction.reply({ embeds: [embed] });
  }
};
