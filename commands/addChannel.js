const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const mongoose = require("mongoose");
const channelModel = require('../models/channels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-channel')
        .setDescription('Adds this channel with the specified name to be anonymously messaged.')
        .addStringOption(option => option.setName('channel_name').setDescription('The name you want users to use when sending messages to this channel').setRequired(true))
        .addStringOption(option => option.setName('channel_desc').setDescription('A channel description for users').setRequired(true)),
    async execute(interaction) {
        // Execute only if the message sent was in a server
        if(interaction.inGuild()){
            var member = interaction.member;

            // Confirm that the person executing is an admin
            if(member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){

                var name = interaction.options.getString('channel_name');

                var lastChn = await channelModel.findOne({}).sort({id: -1});
                var count = 0;

                if(!lastChn) count = 1;
                else count = lastChn.id + 1;

                // Create channel object
                var chn = {
                    _id: mongoose.Types.ObjectId(),
                    id: count,
                    cid: interaction.channelId,
                    sid: interaction.guildId,
                    name: name,
                    desc: interaction.options.getString('channel_desc')
                }

                // Check if another channel exists in the db with the same name
                var sameName = await channelModel.findOne({name: name});
                if(sameName){
                    await interaction.reply('That name already exists in our databases. Please pick a different name');
                    return;
                }

                // Check if another channel exists in the db with the same id
                var sameCid = await channelModel.findOne({cid: interaction.channelId, sid: interaction.guildId});
                if(sameCid){
                    await interaction.reply('That channel from this server has already been added to the server as ' +sameCid.name);
                    return;
                }

                // If everything validates, then save the the channel object to the database.
                await channelModel.create(chn);
                await interaction.reply("Added channel " +name);
            }else{
                interaction.reply('I\'m sorry, but you do not have the required permissions to do that');
            }
        }else{
            await interaction.reply('You must use this command in a server channel.')
        }

    },
};