const { Events } = require('discord.js');
const https = require('https');

module.exports = function (client, config) {
    client.on(Events.MessageCreate, message => {
        let match = message.content.match(/^\!xkcd( (\d+))?/);
        if (match) {
            let comicId = match[2] ? `${match[2]}/` : '';
            https.get(`https://xkcd.com/${comicId}info.0.json`, (response) => {
                // Parse the response as JSON
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    let jsonData = JSON.parse(data);
                    // Reply with the value of the "img" key in the JSON data
                    message.reply(jsonData.img);
                    message.reply(`${jsonData.title}: ${jsonData.alt}`)
                });
            });
        }
    })
}