module.exports = {
    name: 'stopmonitor',
    description: 'Stop monitoring a player\'s status',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a player ID to stop monitoring.');
        }

        const playerId = args[0];
        
        if (message.client.statusMonitors?.has(playerId)) {
            clearInterval(message.client.statusMonitors.get(playerId));
            message.client.statusMonitors.delete(playerId);
            message.reply(`Stopped monitoring player ${playerId}`);
        } else {
            message.reply(`No active monitor found for player ${playerId}`);
        }
    },
}; 