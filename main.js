const discord = require('discord.js');
require('dotenv').config();
const client = new discord.Client();

client.commands = new discord.Collection();
client.events = new discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, discord)
})

client.login(process.env.DISCORD_TOKEN);
