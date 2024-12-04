const axios = require('axios');

class SleeperAPI {
    static BASE_URL = 'https://api.sleeper.app/v1';

    static async getPlayer(playerId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/players/${playerId}`);
            return response.data;
        } catch (error) {
            console.error('Sleeper API Error:', error);
            throw error;
        }
    }

    static async searchPlayers(searchName) {
        try {
            // Get all players (this endpoint returns an object with player_id as keys)
            const response = await axios.get(`${this.BASE_URL}/players/nfl`);
            const players = Object.values(response.data);
            
            // Filter players by name
            return players.filter(player => 
                player.full_name?.toLowerCase().includes(searchName)
            ).slice(0, 5); // Limit to 5 results
        } catch (error) {
            console.error('Sleeper API Error:', error);
            throw error;
        }
    }
}

module.exports = SleeperAPI;
