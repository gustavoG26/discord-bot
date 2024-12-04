const SleeperAPI = require('../services/sleeperApi');

module.exports = {
    name: 'lookup',
    description: 'Look up a player by name',
    async execute(message, args) {
        if(!args.length){
            return message.reply('Please provide a player name to search for.');
        }

        try{
            const searchName = args.join(' ').toLowerCase();
            const players = await SleeperAPI.searchPlayers(searchName);

            if(players.length === 0){
                return message.reply('No players found matching that name.');
            }
            const playerList = players.slice(0, 5).map(player => 
                `ID: ${player.player_id} | ${player.full_name} - ${player.position} (${player.team || 'FA'})\n` +
                `Status: ${player.injury_status || 'Healthy'}`
            ).join('\n\n');

            message.channel.send(`Found players:\n\`\`\`${playerList}\`\`\``);

        } catch(error){
            console.error('Lookup command error:', error);
            message.reply('An error occured while lookuping up the player.')
        }
    },
};