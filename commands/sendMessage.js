const { SlashCommandBuilder } = require('@discordjs/builders');

const channelModel = require('../models/channels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send a message anonymously to a channel')
        .addStringOption(option => option.setName('channel_name').setDescription('The name of the channel').setRequired(true))
        .addStringOption(option => option.setName('message_content').setDescription('The message content').setRequired(true)),
    async execute(interaction) {
        let chnName = interaction.options.getString('channel_name');
        let msgCnt = interaction.options.getString('message_content');

        let client = interaction.client;

        // Try and find such a channel
        let chn = await channelModel.findOne({name: chnName});

        // Return if the channel was not found in the database
        if(!chn){
            interaction.reply('No such channel was found in the database');
            return;
        }

        let chnId = chn.cid;

        // Confirm that the channel's server exists
        let selGuild = await client.guilds.fetch(chn.sid);

        // Return if the server doesn't exist anymore
        if(!selGuild){
            await interaction.reply('That server no longer exists on discord');
            return;
        }

        // Return if the server is currently unavailable
        if(!selGuild.available){
            await interaction.reply('That server is currently unavailable (Server down)');
            return;
        }

        // Check if the user exists in the server
        let userExists = await selGuild.members.fetch(interaction.user.id);

        // Return if the user doesn't exist
        if(!userExists){
            await interaction.reply('You are not a part of that server.');
            return;
        }

        // Try and send the users message
        try{
            await client.channels.cache.get(chnId).send(msgCnt);
        }catch(error){
            // If anything stops it, log the error and return
            console.error(error);
            await interaction.reply('Could not send your message right now, please try again later. Contact the developer if the problem persists.');
            return;
        }

        // Send success message and end interaction.
        await interaction.reply('Your message has been sent!');
    }
}