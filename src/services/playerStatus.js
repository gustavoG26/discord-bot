const SleeperAPI = require('./sleeperApi');

class PlayerStatus {
    constructor() {
        this.statusCache = new Map(); // Store previous statuses
    }

    async checkStatusChanges(playerId) {
        try {
            const player = await SleeperAPI.getPlayer(playerId);
            const oldStatus = this.statusCache.get(playerId);
            const newStatus = player.injury_status || 'healthy';

            if (oldStatus !== newStatus) {
                this.statusCache.set(playerId, newStatus);
                return {
                    changed: true,
                    player: player.full_name,
                    oldStatus,
                    newStatus
                };
            }

            return { changed: false };
        } catch (error) {
            console.error('Status Check Error:', error);
            throw error;
        }
    }
}

module.exports = PlayerStatus;