require('dotenv').config();

module.exports = (client, discord, message) => {
	const prefix = process.env.PREFIX;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

  if (!command) return message.channel.send(`Invalid Command!`);
	try {
		command.execute(client, message, args, cmd, discord);
	} catch (error) {
		console.error(error);
		message.channel.send('There was an error trying to execute that command!');
	}
};
