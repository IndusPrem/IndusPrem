const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bulkroleadd')
        .setDescription('Add a role to multiple members at once')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to add to members')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('members')
                .setDescription('Mention multiple members (@user1 @user2)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const membersInput = interaction.options.getString('members');
        
        // Check if bot can manage the role
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ I can't assign that role (it's higher than my highest role)", 
                ephemeral: true 
            });
        }
        
        // Check if user can manage the role
        if (role.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ You can't assign that role (it's higher than your highest role)", 
                ephemeral: true 
            });
        }
        
        // Extract user mentions
        const mentionRegex = /<@!?(\d+)>/g;
        const userIds = [];
        let match;
        
        while ((match = mentionRegex.exec(membersInput))) {
            userIds.push(match[1]);
        }
        
        if (userIds.length === 0) {
            return interaction.reply({ 
                content: "❌ No members mentioned. Use @user1 @user2 format", 
                ephemeral: true 
            });
        }
        
        // Process members
        await interaction.deferReply({ ephemeral: true });
        
        let successCount = 0;
        let failCount = 0;
        const failedUsers = [];
        
        for (const userId of userIds) {
            try {
                const member = await interaction.guild.members.fetch(userId);
                if (!member.roles.cache.has(role.id)) {
                    await member.roles.add(role);
                    successCount++;
                } else {
                    failCount++;
                    failedUsers.push(member.user.username);
                }
            } catch (error) {
                console.error(`Failed to add role to ${userId}:`, error);
                failCount++;
                failedUsers.push(userId);
            }
        }
        
        // Prepare result message
        let resultMessage = `✅ Added ${role.name} to ${successCount} members`;
        if (failCount > 0) {
            resultMessage += `\n❌ Failed for ${failCount} members: ${failedUsers.slice(0, 5).join(', ')}`;
            if (failedUsers.length > 5) resultMessage += ` and ${failedUsers.length - 5} more`;
        }
        
        await interaction.editReply(resultMessage);
    }
};