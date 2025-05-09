// commands/leaderboard.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/levels-database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the server XP leaderboard')
    .addIntegerOption(option => 
      option.setName('limit')
        .setDescription('Number of users to show (default: 10)')
        .setMinValue(1)
        .setMaxValue(25)
        .setRequired(false)),
  
  async execute(interaction) {
    await interaction.deferReply();
    
    const limit = interaction.options.getInteger('limit') || 10;
    const leaderboard = await getLeaderboard(interaction.guildId, limit);
    
    if (leaderboard.length === 0) {
      return interaction.followUp('No one has earned XP yet.');
    }
    
    let description = '';
    
    leaderboard.forEach((entry, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      description += `${medal} <@${entry.userId}> • Level **${entry.level}** • **${entry.totalXp}** XP\n`;
    });
    
    const leaderboardEmbed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} Leaderboard`)
      .setDescription(description)
      .setColor('#f1c40f')
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();
    
    await interaction.followUp({ embeds: [leaderboardEmbed] });
  }
};