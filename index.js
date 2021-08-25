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

// Bind connection to error event
db.on('error', console.error.bind(console,'MongoDB connection error'));

// On bot initialize
client.on('ready', () => {
    console.log('Ready');
    client.user.setActivity('with your messages');
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN)