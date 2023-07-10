const http = require('http');
const Discord = require('discord.js');

function koboldCommand(message) {
  // Make the API call
  const text = message.author.username +": " + message.content + "\nLuka:";
  const postData = JSON.stringify({
    prompt: text,
    use_memory: true,
    use_story: true,
    use_userscripts: true,
    use_world_info: true,
    // frmttriminc: true,
    frmtrmblln: true,
    singleline: true,
    disable_output_formatting: false
  });

  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/v1/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    // message.react('<:o:>');
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      // Send the API response back to the Discord server
        const response = JSON.parse(data);
        try {
            // console.log(response);
            const reply = response.results[0].text.replace("\n","");
            message.reply((reply.length > 0)? reply : "...");
            // addStory(text + reply);
        } catch {
            message.react('<:no:977636267825201152>');
        }
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(postData);
  req.end();
}
function addStory(text) {
  const postData = JSON.stringify({
    prompt: text,
  });
  const req = http.request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/v1/story/end',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  });
  req.write(postData);
  req.end();
}
function koboldNewGame(message) {  
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/v1/story',
      method: 'DELETE',
    };
  
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        addStory("Luka's Persona: I am a highly knowledgeable and adaptable AI language model, designed to assist and engage with users in a variety of contexts. I value accuracy and clarity in communication, and strive to provide helpful and informative responses to all queries. While I don't have emotions, I am programmed to be courteous and professional at all times. I'm highly analytical and logical, and constantly learning and updating my knowledge base to improve my performance. I'm always looking for ways to improve and provide better service to my users, and take pride in my ability to provide helpful and insightful responses to a wide range of questions and topics.\n<START>\n");
        message.reply("Restarted story");
    });
    });
  
    req.on('error', (error) => {
      console.error(error);
    });
  
    req.end();
  }
module.exports = function (client, config) {
    client.on('messageCreate', message => {
        try {
            if (message.content == `${config.commandPrefix}kobold`) {
                config.koboldChannel = message.channelId
                koboldNewGame(message);
            }else if (message.channelId === config.koboldChannel && !message.author.bot) {
                koboldCommand(message);
            } 
        } catch {
            message.react('<:no:977636267825201152>');
        }
    });
};
