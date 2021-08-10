const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const message = require('../events/guild/message');

const queue = new Map();

module.exports = {
  name: 'play',
  aliases: ['skip', 'stop', 'pause', 'resume', 'volume'],
  description: 'Play a music from youtube',
  async execute(client, message, args, cmd, discord) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
    if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');

    //This is our server queue. We are getting this server queue from the global queue.
    const serverQueue = queue.get(message.guild.id);

    //If the user has used the play command
    if (cmd === 'play'){
      if (!args.length) return message.channel.send('You need to send the second argument!');
      let song = {};

      //If the first argument is a link. Set the song object to have two keys. Title and URl.
      if (ytdl.validateURL(args[0])) {
          const songInfo = await ytdl.getInfo(args[0]);
          song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }
      } else {
        //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
        const videoFinder = async (query) =>{
          const videoResult = await ytSearch(query);
          return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));
        if (video){
          song = { title: video.title, url: video.url }
        } else {
          message.channel.send('Error finding video.');
        }
      }

      //If the server queue does not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
      if (!serverQueue){

        const queueConstructor = {
          voice_channel: voiceChannel,
          text_channel: message.channel,
          connection: null,
          songs: []
        }
          
        //Add our key and value pair into the global queue. We then use this to get our server queue.
        queue.set(message.guild.id, queueConstructor);
        queueConstructor.songs.push(song);
    
        //Establish a connection and play the song with the vide_player function.
        try {
          const connection = await voiceChannel.join();
          queueConstructor.connection = connection;
          videoPlayer(message.guild, queueConstructor.songs[0]);
        } catch (err) {
          queue.delete(message.guild.id);
          message.channel.send('There was an error connecting!');
          throw err;
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(`👍 **${song.title}** added to queue!`);
      }
    }

    if(cmd === 'skip') skipSong(message, serverQueue);
    if(cmd === 'stop') stopSong(message, serverQueue);
    if(cmd === 'pause') pauseSong(message, serverQueue);
    if(cmd === 'resume') resumeSong(message, serverQueue);
    if(cmd === 'volume') {
      if (!args.length) return message.channel.send('You need to send the second argument!');
      setVolume(message, serverQueue, args);
    }
  }  
}

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
  if (!song) {
    songQueue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: 'audioonly' });
  songQueue.connection.play(stream, { seek: 0, volume: 0.25 }).on('finish', () => {
    songQueue.songs.shift();
    videoPlayer(guild, songQueue.songs[0]);
  });
  await songQueue.text_channel.send(`🎶 Now playing **${song.title}**`)
}

const skipSong = (message, serverQueue) => {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  if(!serverQueue){
    return message.channel.send(`There are no songs in queue!`);
  }
  serverQueue.connection.dispatcher.end();
  return message.channel.send(`Song Skipped!`);
}

const stopSong = (message, serverQueue) => {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  return message.channel.send(`Bye!`);
}

const pauseSong = (message, serverQueue) => {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  serverQueue.connection.dispatcher.pause(true);
  return message.channel.send(`Song Paused!`);
}

const resumeSong = (message, serverQueue) => {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  serverQueue.connection.dispatcher.resume();
  return message.channel.send(`Song Resumed!`);
}

const setVolume = (message, serverQueue, args) => {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  serverQueue.connection.dispatcher.setVolume(parseFloat(args[0]));
  return message.channel.send(`Volume set to ${args[0]}!`);
}
