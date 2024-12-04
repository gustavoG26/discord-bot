module.exports = {// Exporting the command
    name: 'ping',
    description: 'Ping!',
    execute(message){// Function that runs when the command is called
        message.channel.send('Pong!'); // Sends a message to the channel the command was called in
    },
};