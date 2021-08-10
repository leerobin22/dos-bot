const fetch = require('node-fetch');
const schedule = require('node-schedule');

module.exports = {
  name: 'quotes',
  aliases: ['qotd'],
  description: 'Return a quote of the day',
  async execute(client, message, args, cmd, discord) {
    if (cmd === 'quotes') {
      const quotes = await getQuote();

      const embed = new discord.MessageEmbed()
      .setColor(0x97bbd0)
      .setTitle(`Quotes`)
      .addField(quotes[0]['q'], `- ${quotes[0]['a']}`)

      message.channel.send(embed);
    }

    if (cmd === 'qotd') {
      const channelID = message.channel.id;
      if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You dont have the permission!');
      message.channel.send('Daily quotes is set successfully!');

      const job = schedule.scheduleJob({hour: 10, minute: 00}, async () => {
        const quotes = await getQuote();
        const embed = new discord.MessageEmbed()
        .setColor(0x97bbd0)
        .setTitle(`Quotes of the day!`)
        .addField(quotes[0]['q'], `- ${quotes[0]['a']}`)

        client.channels.cache.get(channelID.toString()).send(embed)
      });
    }
  }
};

const getQuote = async () => {
  const data = await fetch('https://zenquotes.io/api/random');
  const quotes = await data.json();

  if (!quotes) return 'Please Try Again! Server ERROR!';

  return quotes;
};
