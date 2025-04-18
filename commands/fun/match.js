const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_CHANNEL_ID = '1362656559871688856'; // Replace with your matchmaking channel ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Find a match from the opposite gender 💘'),

  async execute(interaction) {
    // Restrict to specific channel
    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ This command can only be used in <#${ALLOWED_CHANNEL_ID}>!`,
        ephemeral: true
      });
    }

    const member = interaction.member;
    const guild = interaction.guild;

    // Find Male/Female roles
    const maleRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'male');
    const femaleRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'female');

    if (!maleRole || !femaleRole) {
      return interaction.reply("⚠️ The roles 'Male' and 'Female' must exist in the server.");
    }

    // Check the user’s role
    const userIsMale = member.roles.cache.has(maleRole.id);
    const userIsFemale = member.roles.cache.has(femaleRole.id);

    if (!userIsMale && !userIsFemale) {
      return interaction.reply("❌ You need to have either the 'Male' or 'Female' role to use this command.");
    }

    // Get opposite gender members who are online and not the user
    const oppositeRole = userIsMale ? femaleRole : maleRole;
    const candidates = oppositeRole.members.filter(m =>
      m.id !== member.id &&
      m.presence?.status !== 'offline'
    );

    if (candidates.size === 0) {
      return interaction.reply("😢 No online matches available from the opposite gender right now.");
    }

    // Pick one randomly
    const match = candidates.random();

    // Create the embed with profile details
    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('💘 It’s a Match!')
      .setDescription(`❤️ <@${member.id}> matched with <@${match.id}>!\nMaybe destiny brought you two together 😉`)
      .setThumbnail('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW9oYXQxMm52Z3BvcXFidHFwbjVhczgxcGhwNmx3NGlpd2R0Z3hkciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9d3LQ6TdV2Flo8ODTU/giphy.gif')
      .addFields(
        { name: 'Username', value: `${match.user.username}`, inline: true },
        { name: 'ID', value: `${match.id}`, inline: true }
      )
      .setImage(match.user.displayAvatarURL({ size: 512 }))
      .setFooter({ text: 'Made with love by CupidBot 🏹' });

    await interaction.reply({ embeds: [embed] });
  }
};
