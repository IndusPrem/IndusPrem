const { SlashCommandBuilder } = require('@discordjs/builders');
const cron = require('node-cron');
const axios = require('axios');

let config = {
  enabled: false,
  channelId: null,
  hour: null,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motivate')
    .setDescription('Set daily motivation settings')
    .addSubcommand(sub => sub
      .setName('set')
      .setDescription('Configure motivation delivery')
      .addChannelOption(option => option.setName('channel').setDescription('Target channel').setRequired(true))
      .addIntegerOption(option => option.setName('hour').setDescription('Hour of day (0-23)').setRequired(true))
      .addBooleanOption(option => option.setName('enable').setDescription('Enable or disable daily motivation').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'set') {
      const channel = interaction.options.getChannel('channel');
      const hour = interaction.options.getInteger('hour');
      const enable = interaction.options.getBoolean('enable');

      config = {
        enabled: enable,
        channelId: channel.id,
        hour,
      };

      if (enable) {
        interaction.reply(`✅ Motivational quotes will be sent daily at ${hour}:00 in ${channel}.`);
      } else {
        interaction.reply('🛑 Daily motivational quotes have been disabled.');
      }
    }
  },

  scheduleQuote(client) {
    cron.schedule('0 * * * *', async () => {
      const now = new Date();
      if (!config.enabled || now.getHours() !== config.hour || !config.channelId) return;

      try {
        const response = await axios.get('https://zenquotes.io/api/random');
        const quote = response.data[0].q + ' — ' + response.data[0].a;

        const channel = await client.channels.fetch(config.channelId);
        if (channel) channel.send(quote);
      } catch (err) {
        console.error('Error fetching quote:', err);
      }
    });
  }
};
