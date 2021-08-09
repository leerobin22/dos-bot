const weather = require('weather-js');

module.exports = {
  name: 'weather',
  description: 'Shows weather details on specified location',
  async execute(client, message, args, cmd, discord) {
    if (!args.length) return message.channel.send('Please specify a location!');

    weather.find({search: args.join(' '), degreeType: `C`}, function (error, result) {
      if (error) return message.channel.send(error);
      if (result == undefined || result.length === 0) return message.channel.send('Invalid location');

      var current = result[0].current;
      var location = result[0].location;

      const embed = new discord.MessageEmbed()
      .setColor(0x111111)
      .setTitle(`Weather forecast for ${current.observationpoint}`)
      .setThumbnail(current.imageUrl)
      .setDescription(`**${current.skytext}**`)
      .addField('Timezone', `UTC ${location.timezone}`, true)
      .addField('Degree Type', 'Celcius', true)
      .addField('Temperature', `${current.temperature}°`, true)
      .addField('Wind', `${current.winddisplay}`, true)
      .addField('Feels Like', `${current.feelslike}°`, true)
      .addField('Humidity', `${current.humidity}%`, true)

      message.channel.send(embed);
    })
  }
}
