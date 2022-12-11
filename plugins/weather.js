const weather = require('weather-js');
const { Events } = require('discord.js');

module.exports = function (client, config) {
  client.on(Events.MessageCreate, message => {
let match = message.content.match(new RegExp(`^${config.commandPrefix}weather (\\d+)`));
if (match) {
  // Use the library to search for the weather data by zip code
  weather.find({ search: match[1], degreeType: 'F' }, (err, result) => {
    if (err) console.log(err);
    // Get the first result from the search (should be the only result)
    let weatherData = result[0].current;
    // Reply with the current temperature, humidity, windspeed, and weather condition in a list format
    message.reply(`Here is the current weather information:
    - Temperature: ${weatherData.temperature} degrees
    - Humidity: ${weatherData.humidity}%
    - Windspeed: ${weatherData.windspeed}
    - Weather: ${weatherData.skytext}`);
  });
}
  })
}