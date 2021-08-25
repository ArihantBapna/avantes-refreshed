// If local development env, add .env
require('dotenv').config();
// Path initialization
const path = require('path');

// Discord initialization
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
    commandPrefix: process.env.COMMAND_PREFIX, // Set the command prefix to +
    owner: process.env.MASTER_USER, // Set @Ari#6713 as the bot owner
    disableEveryone: true, // Don't allow the bot to ping @everyone
    intents: [Intents.FLAGS.GUILDS] // Set server flags
});

// Mongoose initialization
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the avantes-db connection
const db = mongoose.connection;

const serverModel = require('./models/servers');

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

    //Find last server in database
    var lastSrv = await serverModel.findOne({}).sort({id: -1});

    var count = 0;

    // If a last server exists, set id to that +1, if it doesn't then set id to 1
    if(!lastSrv){
        count = 1;
    }else{
        count = lastSrv.id + 1;
    }

    // Create a new server object
    var srv = {
        _id: mongoose.Types.ObjectId(),
        id: count,
        sid: guild.id,
        name: guild.name
    };

    // Attempt to save server object
    await serverModel.create(srv);
});

// On bot leave server (Kicked / Banned)
client.on('guildDelete', async guild => {

    // Remove the server from the database
    await serverModel.deleteOne({sid: guild.id});

    // TODO: Remove all channels with that sid

    console.log(guild.name +' has removed me.')
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN)