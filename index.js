// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});




// Send a message to a specific channel when the client is ready

client.on(Events.ClientReady, (readyClient) => {
    const channel = readyClient.channels.cache.find(
        (channel) => channel.name === "dev-bot"
    );
   // channel.send("@everyone Je m'appelle Mangeuse de Kinoa et je suis là pour vous servir !");
}
);

// Detect when a message is send in channel dev-bot and reply with a message

// Log in to Discord with your client's token
client.login(token);
