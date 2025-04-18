const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Dynamic command loading
client.commands = new Map();

fs.readdirSync('./commands').forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }
});

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

client.login('YOUR_BOT_TOKEN');
