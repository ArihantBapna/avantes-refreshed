# avantes-refreshed
> A complete recode of my previous discord bot Avantes (a.k.a PhysX) to allow for completely anonymous discord messaging in a server.

## What's different?
* Can be used in multiple servers instead of just Physics Lads. As long as you are in the servers you're trying to communicate between, there is nothing that can stop you.
* Built on MongoDB and Discord.js v13
* Permission based self-setup: Server Administrators are the only ones with the permission to add channels to be accessible via the bot.
* Slash commands with easy to understand prompts rather than prefix based text commands.
* Scalable code which is very readable (I think). Comments everywhere so that it's easier for people to maintain.

## How-to for Admins
* Once you add the bot to the server, just setup channels that you would like to be accessible anonymously.
* You can do this by the command /add-channel which has 2 params: the name and the description. The description can be anything but the name must be a unique identifier in the whole database.
* If at any point you would like to remove a channel from being accessible anonymously, just run the command /remove-channel in that channel.
* __WARNING:__ Avantes will override user chat privileges and anyone from your server will be able to send messages to the channels added to the anonymous list.

## Why was this made?
It was mainly made for the Discord server of WCHS' Physics students in order to make it easier for them to ask questions anonymously. It offers complete anonymity and people can even see the code for themselves to ensure there's nothing else going on here.

## Future
If someone decides to use / update / improve this bot and had questions for me regarding the code, please feel free to reach out to me on my email.
