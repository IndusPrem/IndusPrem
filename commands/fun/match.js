const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Finds you a match!'),

  async execute(interaction) {
    const user = interaction.user;

    // Simulate matching logic — replace with your actual logic
    const potentialMatches = interaction.guild.members.cache
      .filter(member => !member.user.bot && member.id !== user.id)
      .map(member => member.user);

    if (potentialMatches.length === 0) {
      return interaction.reply({
        content: '😔 No matches available right now. Try again later!',
        ephemeral: true,
      });
    }

    // Random match
    const matchedUser = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];

    // Send DMs to both users
    try {
      await matchedUser.send(`💖 You've been matched with **${user.username}**! Start a conversation! 📨`);
      await user.send(`💖 You've been matched with **${matchedUser.username}**! Start a conversation! 📨`);
    } catch (err) {
      console.error('DM failed:', err);
    }

    // Public message (only tagging the matched user)
    await interaction.reply({
      content: `💖 You’ve been matched with <@${matchedUser.id}>!\nWant to chat? Say hi in DMs!\n\nYou can try again after 24 hours using \`/match\`.`,
    });

    // Optional: Start a 24-hour cooldown system here (using a DB or memory)
  },
};
