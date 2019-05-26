require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const quotes = require('./quotes.json');
let unusedQuotes = [...quotes];
let stevenToday = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong!!!!!');
  }
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // Bot will ignore itself and other bots
  if (message.author.bot) return;

  // Generates random and sends quote if message mentions @bobby (or author is steven once a day)
  // Steven Id: 81532687680016384
  if (message.mentions.members.has(client.user.id) || (message.author.id === '81532687680016384' && !stevenToday)) {
    if (message.author.id === '81532687680016384') stevenToday = true;
    let index = Math.floor(Math.random() * unusedQuotes.length);
    message.channel.send(unusedQuotes[index].toUpperCase());
    unusedQuotes = unusedQuotes.slice(0, index).concat(unusedQuotes.slice(index + 1));
    if (unusedQuotes.length <= quotes.length / 2) unusedQuotes = [...quotes];
  }
});

// Reset Steven variable every morning
setInterval(() => {
  console.log("In interval");
  if (new Date().getHours() === 0) {
    stevenToday = false;
  }
}, 3600000);

client.on('error', console.error);
client.login(process.env.DISCORD_TOKEN);
