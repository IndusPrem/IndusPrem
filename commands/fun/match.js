const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Cooldown setup (in milliseconds)
const COOLDOWN_TIME = 24 * 60 * 60 * 1000; // 24 hours
const cooldowns = new Map(); // Stores userId: timestamp

const ALLOWED_CHANNEL_ID = '1362656559871688856'; // Replace with your matchmaking channel ID
const MATCH_CHANNEL_LINK = 'https://discord.com/channels/1153417551699783801/1362656559871688856';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Find a match from the opposite gender 💘'),

  async execute(interaction) {
    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ This command can only be used in <#${ALLOWED_CHANNEL_ID}>!`,
        ephemeral: true
      });
    }

    const member = interaction.member;
    const guild = interaction.guild;
    const userId = member.id;

    // Check cooldown
    const lastUsed = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsed && now - lastUsed < COOLDOWN_TIME) {
      const remaining = COOLDOWN_TIME - (now - lastUsed);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

      return interaction.reply({
        content: `⏳ You can use this command again in **${hours}h ${minutes}m**.`,
        ephemeral: true
      });
    }

    const maleRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'male');
    const femaleRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'female');

    if (!maleRole || !femaleRole) {
      return interaction.reply("⚠️ The roles 'Male' and 'Female' must exist in the server.");
    }

    const userIsMale = member.roles.cache.has(maleRole.id);
    const userIsFemale = member.roles.cache.has(femaleRole.id);

    if (!userIsMale && !userIsFemale) {
      return interaction.reply("❌ You need to have either the 'Male' or 'Female' role to use this command.");
    }

    const oppositeRole = userIsMale ? femaleRole : maleRole;
    const candidates = oppositeRole.members.filter(m =>
      m.id !== member.id &&
      m.presence?.status !== 'offline'
    );

    if (candidates.size === 0) {
      return interaction.reply("😢 No online matches available from the opposite gender right now.");
    }

    const match = candidates.random();

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

    // DM both users with instructions and match info
    const dmMessage = `💖 You’ve been matched with <@${userIsMale ? match.id : member.id}>!\n`
      + `Want to chat? Say hi in DMs!\n\n`
      + `If you're not interested, no worries — you can try again after 24 hours by using the **/match** command in this channel:\n👉 ${MATCH_CHANNEL_LINK}`;

    try {
      await member.send({ content: dmMessage, embeds: [embed] });
    } catch (err) {
      console.warn(`❌ Could not DM ${member.user.tag}`);
    }

    try {
      await match.send({ content: dmMessage, embeds: [embed] });
    } catch (err) {
      console.warn(`❌ Could not DM ${match.user.tag}`);
    }

    // Set cooldown
    cooldowns.set(userId, now);
  }
};
