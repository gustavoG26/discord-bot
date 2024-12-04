const PlayerStatus = require('../services/playerStatus');
const playerStatus = new PlayerStatus();

module.exports = {
    name: 'monitor',
    description: 'Monitor a player\'s injury status',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a player ID to monitor.');
        }

        const playerId = args[0];
        
        try {
            // Initial status check
            const status = await playerStatus.checkStatusChanges(playerId);
            message.channel.send(`Started monitoring ${status.player || playerId}. Current status: ${status.newStatus || 'healthy'}`);

            // Set up interval to check status
            const interval = setInterval(async () => {
                try {
                    const update = await playerStatus.checkStatusChanges(playerId);
                    if (update.changed) {
                        message.channel.send(
                            `🚨 Status Change Alert 🚨\n` +
                            `Player: ${update.player}\n` +
                            `Old Status: ${update.oldStatus || 'healthy'}\n` +
                            `New Status: ${update.newStatus || 'healthy'}`
                        );
                    }
                } catch (error) {
                    console.error('Monitor interval error:', error);
                }
            }, 300000); // Check every 5 minutes

            // Store interval reference (optional: for cleanup)
            if (!message.client.statusMonitors) {
                message.client.statusMonitors = new Map();
            }
            message.client.statusMonitors.set(playerId, interval);

        } catch (error) {
            console.error('Monitor command error:', error);
            message.reply('Error setting up player monitoring.');
        }
    },
};
