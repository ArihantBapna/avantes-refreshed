/*
 * Run this file before you start your bot the first time and also after you make any changes to the commands.
 * It will refresh the application slash commands
 */

const { REST }  = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();
const fs = require('fs');
const commands = [];

// Load all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Bot client id and guild id. When making the bot global, reove guildId. It takes ~ 1 hour to publish the commands globally
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Make a json array with all the commands in them
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Create a discord rest object
var rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            // Send all the commands as json.
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();