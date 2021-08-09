module.exports = {
  name: 'test',
  description: 'Test if DOS bot is online',
  execute(client, message, args, cmd, discord) {
    message.channel.send('DOS Bot Online!');
  }
}
