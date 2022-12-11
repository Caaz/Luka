const SteamTotp = require('steam-totp');
const {Events} = require('discord.js');

module.exports = function (client, config) {
	client.on(Events.MessageCreate, message => {
		if (message.content === '!2fa' && message.author.id == config.userId) {
			const code = SteamTotp.generateAuthCode(config.secret);
			message.reply(`Your 2FA code is: ${code}`);
		}
	});
};
