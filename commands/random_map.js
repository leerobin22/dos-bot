module.exports = {
  name: 'random_map',
  aliases: ['map'],
  description: 'Return a random valorant map',
  execute(client, message, args, cmd, discord) {
    const listOfMaps = ['BREEZE', 'BIND', 'HAVEN', 'ICEBOX', 'ASCENT', 'SPLIT'];
    
    if (args.length > 0) {
      let map = listOfMaps.slice();
      let numOfMap = 6;
      let iterate = 5;

      if (parseInt(args[0]) > numOfMap || parseInt(args[0]) == 0 || parseInt(args[0]) < 0) return message.channel.send('Invalid number!');

      for (let i = 1; i <= parseInt(args[0]); i++) {
        const randomNumber = Math.round(Math.random() * iterate);

        message.channel.send(`The chosen map ${i}: ${map[randomNumber]}`);
        map.splice(randomNumber, 1);
        numOfMap--;
        iterate--;
      };

      return
    }
    const randomNumber = Math.round(Math.random() * 5);

    message.channel.send(`The chosen map: ${listOfMaps[randomNumber]} \n Have Fun!`);
  }
};
