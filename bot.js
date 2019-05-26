require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const quotes = require('./quotes.json');
const birthdays = require('./birthdays.js').birthdays;
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

// This event will run on every single message received, from any channel or DM.
client.on("message", async message => {

  // Bot will ignore itself and other bots
  if (message.author.bot) return;

  // Generates random and sends quote if message mentions @bobby (or author is steven once a day)
  // Steven Id: 81532687680016384
  if ((message.mentions.members && message.mentions.members.has(client.user.id)) || (message.author.id === '81532687680016384' && !stevenToday)) {
    if (message.author.id === '81532687680016384') stevenToday = true;
    let index = Math.floor(Math.random() * unusedQuotes.length);
    message.channel.send(unusedQuotes[index].toUpperCase());
    unusedQuotes = unusedQuotes.slice(0, index).concat(unusedQuotes.slice(index + 1));
    if (unusedQuotes.length <= quotes.length / 2) unusedQuotes = [...quotes];
  }
});

// Reset Steven variable every morning
setInterval(() => {
  if (new Date().getHours() === 0) {
    stevenToday = false;
  }
}, 3600000);

// Checks for birthdays so Robert can wish a happy nameday 
setInterval(() => {
  let today = new Date();
  if (today.getHours() === 8) {
    for (let birthday of birthdays) {
      if (birthday.day.getMonth() === today.getMonth() && birthday.day.getDate() === today.getDate()) {
        const mention = `<@${birthday.userID}>`
        client.channels.get('414534539042619395').send("GODS BE GOOD. YOU'VE LIVED TO SEE ANOTHER NAMEDAY " + mention + ". NOW EAT, DRINK, AND WHORE YOUR WAY TO AN EARLY GRAVE!");
      }
    }
  }
}, 3600000);

client.on('error', console.error);
client.login(process.env.DISCORD_TOKEN);
