const fs = require('fs'); //Allows interaction with the file system (used to read command files dynamically).
const path = require('path'); //Helps work with file and directory paths in a cross-platform way
const { Client, GatewayIntentBits, Collection } = require('discord.js'); //Handles communitcation with the Discord API
require('dotenv').config(); //Loads environment variables from a .env file to secruely store the bot token

//Creates client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
/* 
GatewayIntentBits defines what events the bot listens to:
Guilds: Basic information about servers (guilds).
GuildMessages: Allows the bot to see and respond to messages in servers.
MessageContent: Lets the bot access the content of messages (required for commands).
*/

client.commands = new Collection(); //creates a collection to store commands

// Load command files
const commandsPath = path.join(__dirname, 'commands'); //Creates a path to the commands folder where command files are stored like ping.js.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //Reads all files in the commands folder and filters for .js files.

for (const file of commandFiles) { //Loops through each command file, and adds it to command collection, name property = key
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Event listener for when the bot is ready
client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => { //Listens for the messageCreate event, triggered when a message is sent in a server the bot is part of.
    if (!message.content.startsWith('!') || message.author.bot) return;  //ignores messages that do not start with '!' or sent by a bot

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return; // checks if the command exists in the collection

    try {
        client.commands.get(commandName).execute(message); //executes the command that matches the commandName
    } catch (error) {//catches any errors that occur during command execution
        console.error(error);
        message.reply('There was an error executing that command!');
    }
});

client.login(process.env.TOKEN); //Logs the bot in using the token stored in the .env file
