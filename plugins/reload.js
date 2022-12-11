const { exec, spawn } = require('child_process');
const { Events } = require('discord.js');

module.exports = function (client, config) {
    client.on(Events.MessageCreate, message => {
        if (message.content === `${config.commandPrefix}reload` && message.author.id == config.userId) {
            // Do a Git pull to check for updates
            const gitPull = spawn('git', ['pull']);

            gitPull.stdout.on('data', (data) => {
                // If there are any updates, restart the process
                if (data.toString().includes('Already up to date.')) {
                    message.reply("Already up to date!")
                } else {
                    exec('node ./index.js', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error: ${error}`);
                            return;
                        }
                    });
                }
            })
        }
    })
}