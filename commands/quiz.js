const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Create a custom quiz question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The quiz question')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option1')
        .setDescription('First option')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option2')
        .setDescription('Second option')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option3')
        .setDescription('Third option (optional)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option4')
        .setDescription('Fourth option (optional)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('correct')
        .setDescription('Which option is correct (1-4)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(4))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('Image URL (optional)')
        .setRequired(false)),

  async execute(interaction) {
    // Get all the options from the command
    const question = interaction.options.getString('question');
    const option1 = interaction.options.getString('option1');
    const option2 = interaction.options.getString('option2');
    const option3 = interaction.options.getString('option3');
    const option4 = interaction.options.getString('option4');
    const correctAnswer = interaction.options.getInteger('correct') - 1; // Convert to 0-based index
    const imageUrl = interaction.options.getString('image');

    // Create an array of options (filter out empty ones)
    const options = [option1, option2];
    if (option3) options.push(option3);
    if (option4) options.push(option4);

    // Create embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Custom Quiz!')
      .setDescription(question);

    // Add image if provided
    if (imageUrl) {
      embed.setImage(imageUrl);
    }

    // Create buttons for each option
    const buttons = new ActionRowBuilder();
    options.forEach((option, index) => {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`option_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      );
    });

    // Send the quiz
    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });

    // Handle button clicks
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async i => {
      const selectedOption = parseInt(i.customId.split('_')[1]);
      const isCorrect = selectedOption === correctAnswer;

      // Disable all buttons
      buttons.components.forEach(btn => btn.setDisabled(true));

      await i.update({
        components: [buttons],
        embeds: [
          embed,
          new EmbedBuilder()
            .setColor(isCorrect ? '#57F287' : '#ED4245')
            .setDescription(isCorrect ? '✅ Correct!' : `❌ Wrong! The correct answer was: ${options[correctAnswer]}`)
        ]
      });

      collector.stop();
    });

    collector.on('end', () => {
      if (collector.endReason === 'time') {
        interaction.editReply({ content: 'Time\'s up!', components: [] });
      }
    });
  }
};