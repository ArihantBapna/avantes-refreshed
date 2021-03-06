const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const mongoose = require("mongoose");
const channelModel = require('../models/channels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-channel')
        .setDescription('Removes this channel from being able to anonymous messaged.'),
    async execute(interaction) {
        // Execute only if the message sent was in a server
        if(interaction.inGuild()){
            let member = interaction.member;

            // Confirm that the person executing is an admin
            if(member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
                let cid = interaction.channelId;

                // Check that the channel exists in the database
                let existChn = await channelModel.findOne({cid: cid});

                if(existChn){
                    // Delete the channel from the database
                    await channelModel.deleteOne({cid: cid});
                    await interaction.reply('Successfully removed this channel to be accessible anonymously');
                }else{
                    // If it doesn't exist in the database
                    await interaction.reply('This channel has not been added yet.');
                }

            }else{
                // If the user is not a server admin
                await interaction.reply('You don\'t have the required permissions for this command. Contact a server admin');
            }


        }else{
            // If the user direct messages
            await interaction.reply('This command must be used in a server');
        }
    }
}