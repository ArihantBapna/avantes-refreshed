// If local development env, add .env
require('dotenv').config();

// File reader
const fs = require('fs');

// Discord initialization
const { Client, Collection, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS] // Set server flags
});

// Create a commands collection
client.commands = new Collection();
// Get all the command files from inside commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// Mongoose initialization
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the avantes-db connection
const db = mongoose.connection;

// Load mongoose models
const serverModel = require('./models/servers');
const channelModel = require('./models/channels');

// Bind connection to error event
db.on('error', console.error.bind(console,'MongoDB connection error'));

// On bot initialize
client.on('ready', () => {
    console.log('Ready');
    client.user.setActivity('with your messages');
});

// On bot join server
client.on('guildCreate', async guild => {
    // Send initial message
    guild.systemChannel.send('Hi! I\'m Avantes. Add channels to the server to allow your members to send anonymous messages.');

    console.log(guild);
    let guildId = guild.id
    console.log(guildId);

    //Find last server in database
    let lastSrv = await serverModel.findOne({}).sort({id: -1});

    let count;

    // If a last server exists, set id to that +1, if it doesn't then set id to 1
    if(!lastSrv) count = 1;
    else count = lastSrv.id + 1;

    // Create a new server object
    let srv = {
        _id: mongoose.Types.ObjectId(),
        id: count,
        sid: guildId,
        name: guild.name
    };

    // Attempt to save server object
    await serverModel.create(srv);
});

client.on('interactionCreate', async interaction => {
   if(!interaction.isCommand()) return;
   const command = client.commands.get(interaction.commandName);

   if(!command) return;
   try{
       await command.execute(interaction);
   }catch(error){
       console.error(error);
       await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
   }

});

// On bot leave server (Kicked / Banned)
client.on('guildDelete', async guild => {

    // Remove the server from the database
    await serverModel.deleteOne({sid: guild.id});

    // Remove all the channels from the database
    await channelModel.deleteMany({sid: guild.id});

    console.log(guild.name +' has removed me.')
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN)