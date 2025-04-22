const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const REPORT_CHANNEL_ID = '1364210840076681287'; // Replace with your channel ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Record from a voice channel (Admin Only)')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Voice channel to record')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Admin-only lock
    
    async execute(interaction) {
        // Verify permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ 
                content: '❌ This command is restricted to administrators only.',
                ephemeral: true 
            });
        }

        await interaction.deferReply({ ephemeral: true });
        
        const channel = interaction.options.getChannel('channel');
        
        if (!channel.isVoiceBased()) {
            return interaction.editReply('❌ Please select a voice channel!');
        }

        try {
            // Join voice channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 5000);
            
            // Recording setup
            const receiver = connection.receiver;
            const filename = `recording-${Date.now()}.ogg`;
            const filepath = path.join(__dirname, '..', 'recordings', filename);
            
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
            const writeStream = fs.createWriteStream(filepath);
            
            const oggStream = new prism.opus.OggLogicalBitstream({
                opusHead: new prism.opus.OpusHead({
                    channelCount: 2,
                    sampleRate: 48000,
                }),
                pageSizeControl: { maxPackets: 10 }
            });

            receiver.speaking.on('start', (userId) => {
                const audioStream = receiver.subscribe(userId, {
                    end: { behavior: 'silence' }
                });
                audioStream.pipe(oggStream).pipe(writeStream);
            });

            await interaction.editReply(`🎤 Recording started in ${channel.name}...`);

            // Stop button
            const stopButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('stop_recording')
                    .setLabel('Stop Recording')
                    .setStyle(ButtonStyle.Danger)
            );

            const msg = await interaction.followUp({
                content: 'Recording in progress...',
                components: [stopButton],
                ephemeral: true
            });

            // Button collector
            const collector = msg.createMessageComponentCollector({ time: 300000 });
            
            collector.on('collect', async i => {
                if (i.customId === 'stop_recording') {
                    connection.destroy();
                    await i.update({ content: '⏳ Processing recording...', components: [] });
                    
                    // Send to specified channel
                    const reportChannel = await interaction.guild.channels.fetch(REPORT_CHANNEL_ID);
                    await reportChannel.send({
                        content: `New recording from ${channel.name} (Requested by ${interaction.user.tag})`,
                        files: [{
                            attachment: filepath,
                            name: filename
                        }]
                    });

                    await interaction.followUp({ 
                        content: `✅ Recording sent to ${reportChannel.name}`,
                        ephemeral: true 
                    });
                    
                    fs.unlinkSync(filepath);
                }
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Recording failed! Check console for details.');
        }
    }
};