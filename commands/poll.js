const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a simple Yes/No poll.')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question for the poll')
        .setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');

    // Create the poll message
    const pollEmbed = {
      color: 0x5865f2,
      title: 'Yes/No Poll',
      description: `**${question}**\n\nReact with ✅ for Yes, ❌ for No.`,
    };

    // Send the poll message
    const pollMsg = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });

    // Add reactions for Yes/No voting
    await pollMsg.react('✅');
    await pollMsg.react('❌');
  },
};
