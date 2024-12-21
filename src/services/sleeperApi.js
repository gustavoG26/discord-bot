const axios = require('axios');

class SleeperAPI {
    //API endpoint
    static BASE_URL = 'https://api.sleeper.app/v1';

    //Fetch all players

    static async fetchAllPlayers() {
        try{
            const response = await axios.get(this.BASE_URL + '/players/nfl');
            const players = response.data;

            const filteredPlayers = Object.values(players)
            .filter(player => 
                player.team !== null && 
                players.status !== 'Inactive' && 
                player.depth_chart_order !== null &&
                player.depth_chart_position !== null
            )
            .map(player => ({
                player_id: player.player_id,
                name: `${player.first_name} ${player.last_name}`,
                position: player.position,
                team: player.team,
                status: player.status,
                injury_status: player.injury_status,
                depth_chart_order: player.depth_chart_order,
                depth_chart_position: player.depth_chart_position
            }));
            //localStorage.setItem('players', JSON.stringify(filteredPlayers));
            console.log("Filterted Players: ",filteredPlayers);
            return filteredPlayers;
        }catch(error){
            console.error("Error fetching players:", error)
        }
    }

    static async getPlayer(playerId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/players/${playerId}`);
            return response.data;
        } catch (error) {
            console.error('Sleeper API Error:', error);
            throw error;
        }
    }

    // static async searchPlayers(searchName) {
    //     try {
    //         // Get all players (this endpoint returns an object with player_id as keys)
    //         const response = await axios.get(`${this.BASE_URL}/players/nfl`);
    //         const players = Object.values(response.data);
            
    //         // Filter players by name
    //         return players.filter(player => 
    //             player.full_name?.toLowerCase().includes(searchName)
    //         ).slice(0, 5); // Limit to 5 results
    //     } catch (error) {
    //         console.error('Sleeper API Error:', error);
    //         throw error;
    //     }
    // }

    static async getTrendingPlayers(type = 'add', limit = 15){
        try{
            const trendingResponse = await axios.get(
                `${this.BASE_URL}/players/nfl/trending/${type}?limit=${limit}`
            );
            console.log(trendingResponse.data);
        }catch(error){
            console.error('Sleeper API Error:', error)
        }
    }
    static async getTrendingPlayers2(type = 'add', limit = 15) {
        try {
            // Get trending players
            const trendingResponse = await axios.get(
                `${this.BASE_URL}/players/nfl/trending/${type}?limit=${limit}`
            );
            
            // Process each trending player individually
            const trendingPlayers = await Promise.all(
                trendingResponse.data.map(async (trend) => {
                    try {
                        const playerResponse = await axios.get(`${this.BASE_URL}/players/${trend.player_id}`);
                        
                        // Log to inspect the structure of playerResponse.data
                        console.log(playerResponse.data);
    
                        return {
                            full_name: playerResponse.data.first_name || 'Unknown Player',
                            count: trend.count,
                            status: playerResponse.data.status || 'N/A',
                            position: playerResponse.data.position || 'Unknown Position',
                            team: playerResponse.data.team || 'FA',
                            player_id: trend.player_id
                        };
                    } catch (error) {
                        console.log(`Skipping player ${trend.player_id} due to error`);
                        return null;
                    }
                })
            );
            
            // Filter out any failed requests
            return trendingPlayers.filter(player => player !== null);
                
        } catch (error) {
            console.error('Sleeper API Error:', error);
            throw error;
        }
    }
    
    static async testTrending() {
        try {
            const trending = await SleeperAPI.getTrendingPlayers2();
            trending.forEach(player => {
                console.log(`
                    Name: ${player.full_name} 
                    Count: ${player.count}
                    Status: ${player.status}
                    Position: ${player.position}
                    Team: ${player.team || 'FA'}
                    Player ID: ${player.player_id}
                `);
            });
        } catch (error) {
            console.error('Sleeper API BITCH Error:', error);
        }
    }
    
}


module.exports = SleeperAPI;
