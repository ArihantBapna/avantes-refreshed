const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const mongoose = require("mongoose");
const channelModel = require('../models/channels');
const serverModel = require('../models/servers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Shows the available channels for a given server name')
        .addStringOption(option => option.setName('server_name').setDescription('The name of the server').setRequired   (true)),
    async execute(interaction) {
        let srvName = interaction.options.getString('server_name');

        // Check if a server with that name exists in the db
        let srv = await serverModel.findOne({name: srvName});

        let client = interaction.client;
        let userId = interaction.user.id;

        // Confirm that such a server exists on discord
        let selGuild = await client.guilds.fetch(srv.sid);

        // Return if the server doesn't exist anymore
        if(!selGuild){
            interaction.reply('That server no longer exists on discord');
            return;
        }

        // Return if the server is currently unavailable
        if(!selGuild.available){
            interaction.reply('That server is currently unavailable (Server down)');
            return;
        }

        // Check if the user exists in the server
        let userExists = await selGuild.members.fetch(userId);

        // Return if the user doesn't exist
        if(!userExists){
            interaction.reply('You are not a part of that server.');
            return;
        }

        // Grab all channels visible for messaging from that server
        let srvChn = await channelModel.find({sid: srv.sid});

        // Check if the server has visible channels
        if(srvChn && srvChn.length > 0){
            // Add all channels to a string
            let replyString = '';

            srvChn.forEach((chn) => {
                replyString += (chn.name +': ' +chn.desc +'\n');
            });
            interaction.reply(replyString);
        }else{
            interaction.reply('Could not find any added channels for that server');
        }


    }
}