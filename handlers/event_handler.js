const fs = require('fs');

module.exports = (client, discord) => {
  const load_dir = (dir) => {
    const eventFiles = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require(`../events/${dir}/${file}`);
      const event_name = file.split('.')[0];

      client.on(event_name, event.bind(null, client, discord));
    };
  };

  ['client', 'guild'].forEach(e => load_dir(e));
};
