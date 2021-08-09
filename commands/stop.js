module.exports = {
  name: 'stop',
  aliases: ['s'],
  description: 'Stop music!',
  async execute(client, message, args, cmd, discord) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a channel to stop music!');

    await voiceChannel.leave();
    message.channel.send('Music stop!');
  }
}
