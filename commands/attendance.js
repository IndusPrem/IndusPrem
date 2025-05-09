const { SlashCommandBuilder } = require('discord.js');
const Attendance = require('../models/Attendance'); // MongoDB model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('attendance')
    .setDescription('Take attendance of VC members with a specific role')
    .addStringOption(option =>
      option.setName('role')
        .setDescription('Role to filter by')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('voicechannel')
        .setDescription('Voice channel to check')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('outputchannel')
        .setDescription('Text channel to send attendance report')
        .setRequired(true)),

  async execute(interaction) {
    const roleName = interaction.options.getString('role');
    const voiceChannel = interaction.options.getChannel('voicechannel');
    const outputChannel = interaction.options.getChannel('outputchannel');

    if (!voiceChannel.isVoiceBased()) {
      return interaction.reply({ content: 'Please select a valid voice channel.', ephemeral: true });
    }

    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      return interaction.reply({ content: `Role "${roleName}" not found.`, ephemeral: true });
    }

    const members = voiceChannel.members.filter(member => member.roles.cache.has(role.id));
    const usernames = members.map(member => member.user.username);

    if (usernames.length === 0) {
      return interaction.reply({ content: 'No members with that role are in the voice channel.', ephemeral: true });
    }

    // Save to MongoDB
    await Attendance.create({
      role: roleName,
      voiceChannel: voiceChannel.name,
      usernames,
      timestamp: new Date()
    });

    const message = `📋 **Attendance for ${roleName} in ${voiceChannel.name}**\n${usernames.join('\n')}`;

    await outputChannel.send(message);
    await interaction.reply({ content: '✅ Attendance recorded and posted.', ephemeral: true });
  }
};
