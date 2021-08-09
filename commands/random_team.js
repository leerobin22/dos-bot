const _ = require('lodash');

module.exports = {
  name: 'random_team',
  aliases: ['team'],
  description: 'Divide members in channel into number of specified teams',
  async execute(client, message, args, cmd, discord) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a channel to generate random team');

    const channels = message.guild.channels.cache.filter(c => c.type === 'voice' && voiceChannel.id === c.id);

    const numOfTeam = parseInt(args[0]);

    let team0 = [];
    let memberList = [];

    for (const [channelID, channel] of channels) {
      for (const [memberID, member] of channel.members) {
        await memberList.push(member.user.username);
      };
    };

    const numOfMember = Math.round(memberList.length / numOfTeam);
    if (numOfTeam == 0 || numOfTeam < 0) return message.channel.send('Ga bisa ini!');

    if (numOfTeam == 1) return message.channel.send(`Team 1: ${_.join(memberList, ', ')}`);

    console.log(memberList)
    for (let i = 1; i <= numOfTeam; i++) {
      for (let j = 0; j < numOfMember; j++) {
        const randomNumber = await Math.round(Math.random() * memberList.length - 1);
        await team0.push(_.nth(memberList, randomNumber));
        await memberList.splice(randomNumber, 1);
        console.log('in loop' + memberList)
      }
      console.log('list:' + team0)
      await message.channel.send(`Team ${i}: ${_.join(team0, ', ')}`);
      team0.length = 0;
      console.log(memberList)
    }
  }
};
