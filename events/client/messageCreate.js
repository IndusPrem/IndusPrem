const { Events, EmbedBuilder } = require('discord.js');
const { isOnCooldown, setUserCooldown, generateXpForMessage, calculateLevel } = require('../utils/level-utils');
const { getUserData, updateUserXp, updateUserLevel } = require('../utils/levels-database');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // Original mention response code
    if (message.author.bot) return;
    
    const mention = new RegExp(`^<@!?${message.client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      try {
        const commands = await message.client.application.commands.fetch();
        const helpCommand = commands.find((cmd) => cmd.name === 'help');
        const helpCommandId = helpCommand ? helpCommand.id : 'unknown';
        const mentionEmbed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setDescription(
            `Hey ${message.author}, I'm Lanya, I use \`/\` commands.\nCheck out my commands, type </help:${helpCommandId}>`
          )
          .setTimestamp();
        message.reply({ embeds: [mentionEmbed] }).catch(console.error);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    }
    
    // New XP system code (only runs if message is in a guild)
    if (!message.guild) return;
    
    const guildId = message.guild.id;
    const userId = message.author.id;
    
    // Check if the user is on cooldown
    if (isOnCooldown(guildId, userId)) {
      return;
    }
    
    // Set user on cooldown
    setUserCooldown(guildId, userId);
    
    // Generate random XP amount
    const xpToAdd = generateXpForMessage();
    
    try {
      // Update user XP in the database
      const updatedData = await updateUserXp(guildId, userId, message.author.username, xpToAdd);
      
      if (!updatedData) {
        return; // Something went wrong with the database update
      }
      
      // Calculate the new level based on total XP
      const newLevel = calculateLevel(updatedData.totalXp);
      
      // Check if user leveled up
      if (newLevel > updatedData.level) {
        // Update user level in the database
        await updateUserLevel(guildId, userId, newLevel, updatedData.xp);
        
        // Send level up message
        const levelUpChannel = message.channel;
        levelUpChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('Level Up! 🎉')
              .setDescription(`Congratulations ${message.author}! You advanced to **Level ${newLevel}**!`)
              .setColor('#00ff00')
              .setThumbnail(message.author.displayAvatarURL())
              .setTimestamp()
          ]
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Error in XP system:', error);
    }
  },
};