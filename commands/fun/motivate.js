const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motivate')
    .setDescription('Get a dose of motivation to power through your day!'),

  async execute(interaction) {
    const quotes = [
      "✨ *Believe you can and you're halfway there.* – Theodore Roosevelt",
      "🌟 *Push yourself, because no one else is going to do it for you.*",
      "💡 *Don’t watch the clock; do what it does. Keep going.* – Sam Levenson",
      "🔥 *Great things never come from comfort zones.*",
      "🧠 *Your limitation—it's only your imagination.*",
      "🏆 *Dream it. Wish it. Do it.*",
      "💥 *Success doesn’t just find you. You have to go out and get it.*",
      "🚀 *The harder you work for something, the greater you’ll feel when you achieve it.*",
      "🔑 *Failure is not the opposite of success, it's part of success.*",
      "🎯 *Stay focused and never give up. The beginning is always the hardest.*"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
      .setColor('#00FFAB')
      .setTitle('💬 Your Daily Motivation')
      .setDescription(randomQuote)
      .setFooter({ text: 'Let’s get it, champ! 💪' });

    await interaction.reply({ embeds: [embed] });
  }
};
