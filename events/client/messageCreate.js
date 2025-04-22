const { Events, EmbedBuilder } = require('discord.js');

// Anti-spam cache (stores user message timestamps)
const spamCache = new Map();

// Anti-spam configuration
const ANTI_SPAM_CONFIG = {
  enabled: false, // Toggle via /anti-spam command
  threshold: 5,   // Max messages allowed
  timeframe: 3000, // 3 seconds (in ms)
  deleteMessages: true, // Delete spam messages
  warnUser: true // Send warning to spammers
};

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    // 1. Handle bot mentions (your existing code)
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
      return;
    }

    // 2. Anti-spam system (enhanced version)
    if (!ANTI_SPAM_CONFIG.enabled) return;

    try {
      // Initialize user's message tracker
      if (!spamCache.has(message.author.id)) {
        spamCache.set(message.author.id, []);
      }

      const userMessages = spamCache.get(message.author.id);
      userMessages.push(Date.now());

      // Filter messages within timeframe
      const recentMessages = userMessages.filter(
        t => Date.now() - t < ANTI_SPAM_CONFIG.timeframe
      );

      // Detect spam
      if (recentMessages.length >= ANTI_SPAM_CONFIG.threshold) {
        if (ANTI_SPAM_CONFIG.deleteMessages && message.deletable) {
          await message.delete();
          console.log(`Deleted spam message from ${message.author.tag}`);
        }

        if (ANTI_SPAM_CONFIG.warnUser) {
          await message.channel.send(
            `${message.author}, please stop spamming! (${recentMessages.length} messages in ${ANTI_SPAM_CONFIG.timeframe/1000}s)`
          ).catch(console.error);
        }

        // Reset counter but keep 1 as buffer
        spamCache.set(message.author.id, [Date.now()]); 
      }

      // Cleanup old timestamps
      spamCache.set(message.author.id, 
        userMessages.filter(t => Date.now() - t < ANTI_SPAM_CONFIG.timeframe * 2)
      );

    } catch (error) {
      console.error('Anti-spam error:', error);
    }
  },
};