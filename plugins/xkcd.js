const https = require('node:https');
const {Events} = require('discord.js');

module.exports = function (client, config) {
	client.on(Events.MessageCreate, message => {
		const match = message.content.match(new RegExp(`^${config.commandPrefix}xkcd( (\\d+))?`));
		if (match) {
			const comicId = match[2] ? `${match[2]}/` : '';
			https.get(`https://xkcd.com/${comicId}info.0.json`, response => {
				// Parse the response as JSON
				let data = '';
				response.on('data', chunk => {
					data += chunk;
				});
				response.on('end', () => {
					const jsonData = JSON.parse(data);
					// Reply with the value of the "img" key in the JSON data
					message.reply(jsonData.img);
					message.reply(`${jsonData.title}: ${jsonData.alt}`);
				});
			});
		}
	});
};
