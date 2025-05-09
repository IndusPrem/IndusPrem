// commands/rank.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserData } = require('../utils/levels-database');
const { xpForLevel, getXpForNextLevel } = require('../utils/level-utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your current level and XP')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to check (defaults to yourself)')
        .setRequired(false)),
  
  async execute(interaction) {
    await interaction.deferReply();
    
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userData = await getUserData(interaction.guildId, targetUser.id);
    
    if (!userData) {
      return interaction.followUp(`${targetUser.username} hasn't earned any XP yet.`);
    }
    
    const nextLevelXp = getXpForNextLevel(userData.level);
    const progressPercentage = Math.round((userData.xp / nextLevelXp) * 100);
    
    // Create a progress bar (10 segments)
    const progressBarLength = 10;
    const filledSegments = Math.round((progressPercentage / 100) * progressBarLength);
    const progressBar = '█'.repeat(filledSegments) + '░'.repeat(progressBarLength - filledSegments);
    
    const rankEmbed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s Rank`)
      .setColor('#3498db')
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: 'Level', value: `${userData.level}`, inline: true },
        { name: 'Total XP', value: `${userData.totalXp}`, inline: true },
        { name: 'Rank Progress', value: `${progressBar} ${progressPercentage}%` },
        { name: 'XP', value: `${userData.xp}/${nextLevelXp}`, inline: true }
      )
      .setTimestamp();
    
    await interaction.followUp({ embeds: [rankEmbed] });
  }
};