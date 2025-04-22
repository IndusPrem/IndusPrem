const { Events, EmbedBuilder } = require('discord.js');

// Anti-spam cache (stores user message timestamps)
const spamCache = new Map();

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    // ========================
    // 1. MENTION RESPONSE (your existing code)
    // ========================
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

        await message.reply({ embeds: [mentionEmbed] });
      } catch (error) {
        console.error('Error in mention response:', error);
      }
      return; // Skip anti-spam check if bot was mentioned
    }

    // ========================
    // 2. ANTI-SPAM SYSTEM (new addition)
    // ========================
    if (!global.antiSpamEnabled) return; // Only run if enabled via /anti-spam

    // Initialize user's message tracker
    if (!spamCache.has(message.author.id)) {
      spamCache.set(message.author.id, []);
    }

    const userMessages = spamCache.get(message.author.id);
    userMessages.push(Date.now()); // Record message timestamp

    // Anti-spam rules (customize these values)
    const spamThreshold = 5;    // Max messages allowed
    const timeWindow = 3000;    // Timeframe in milliseconds (3 seconds)
    const recentMessages = userMessages.filter(t => Date.now() - t < timeWindow);

    // Detect spam
    if (recentMessages.length >= spamThreshold) {
      try {
        await message.delete();
        await message.channel.send(`${message.author}, please don't spam!`);
        spamCache.set(message.author.id, []); // Reset their counter
      } catch (error) {
        console.error('Failed to handle spam:', error);
      }
    }
  },
};