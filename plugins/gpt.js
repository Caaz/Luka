const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');
const m3olib = require("m3o")

var system = [
  {"role": "system", "content": "You are a chatbot in a discord with many people, their names will prefix their message. Be friendly, and respond as succinctly as possible. Any code examples should be in markdown code blocks."}
]
var history = []


module.exports = function (client, config) {
  const configuration = new Configuration({
    apiKey: config.openaiToken,
  });
  const openai = new OpenAIApi(configuration);
  const m3o = m3olib.default(config.m3oToken)
  async function chat(username, text) {
    history = history.concat([{"role": "user", "content": username +": " + text}])
    var messages = system.concat(history)
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });
    console.log(response)
    var reply = response.data.choices[0].message.content
    history = history.concat([{"role":"assistant", "content":reply}])
    while (history.length > 10) { history.shift(); }
    return {
      response: reply, 
      tokens: response.data.usage.total_tokens
    }
  }
  async function weather(location) {
    var response = await m3o.weather.forecast({
      days: 2,
      location: location,
    });
    var stringed = JSON.stringify(response)
    console.log(stringed)
    return await weatherGPT(stringed)
  }
  async function weatherGPT(apiResponse) {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role":"system","content":"Your job is to parse API responses from the user, and present them as though you were a weather forecaster. No specific information is needed about the location."},
        {"role":"system","content":"Only show appropriate units for the region in question, Celcius or kilometers shouldn't appear for USA, for example."},
        {"role":"system","content":"Format sentences on their own lines. Feel free to add friendly jokes."},
        {"role":"user", "content":apiResponse}
      ]
    });
    var reply = response.data.choices[0].message.content
    return reply;
  }
  
  client.on('messageCreate', async message => {
		const match = message.content.match(new RegExp(`^${config.commandPrefix}gpt (.+)`));
    try {
      if (match) {
        const response = await chat(message.author.username, match[1]);
        message.reply(`${response.response} (Tokens: ${response.tokens})`);
      }
      const weatherMatch = message.content.match(new RegExp(`^${config.commandPrefix}weather (.+)`));
      if (weatherMatch) {
        const response = await weather(weatherMatch[1]);
        message.reply(response);
      }
    }
    catch {
      message.react('<:no:977636267825201152>');
    }
  });
};
