// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");
const path = require("path");

// List of required modules
const Filter = require("bad-words");
const axios = require("axios");
const { CommandKit } = require("commandkit");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// include the file functions.js
const functions = require("./functions.js");

const insultes = require("./assets/files/bad-words-fr.js");

const messages = require("./assets/files/messages.js");

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandAdminPath = path.join(__dirname, "commands/admin");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

const commandAdminFiles = fs
	.readdirSync(commandAdminPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	try {
		const command = require(path.join(commandsPath, file));
		console.log(`Chargement de la commande : ${file}`);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(
				`Le fichier de commande ${file} est manquant des propriétés nécessaires.`
			);
		}
	} catch (error) {
		console.error(`Erreur de chargement de la commande ${file}:`, error);
	}
}

for (const file of commandAdminFiles) {
	try {
		const command = require(path.join(commandAdminPath, file));
		console.log(`Chargement de la commande : ${file}`);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		}
	} catch (error) {
		console.error(`Erreur de chargement de la commande ${file}:`, error);
	}
}

// Filter the message to detect insults
const filter = new Filter();

filter.addWords(...insultes);

const quizState = {};

const admin = client.users.cache.get("378634441503014913");

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

//Send a dm to the admin when a people join the server

// Send a message to a specific channel when the client is ready

client.on(Events.ClientReady, async (readyClient) => {
	// get the id of the server where the bot is install
	const guildId = "1053328889956532234";
	const guild = client.guilds.cache.get(guildId);

	if (!guild) {
		console.log("Guild not found");
		return;
	}

	try {
		await guild.commands.set(client.commands.map((command) => command.data));
		console.log("Commandes slash enregistrées");
	} catch (error) {
		console.error("Erreur lors de l'enregistrement des commandes :", error);
	}
	/*
	const channel = readyClient.channels.cache.find(
		(channel) => channel.name === "dev-bot"
	);
	channel.send(
		messages.MessageUp[
			Math.floor(Math.random() * messages.MessageUp.length - 1)
		]
	);
	const random = Math.floor(Math.random() * 5);
	if (random === 1) {
		setTimeout(() => {
			channel.send("L'auteur de ce bot est un génie");
		}, 1000);
	}*/
});

client.on(Events.GuildMemberAdd, (member) => {
	if (member.guild.id === "1053328889956532234") {
		member.createDM().then((dm) => {
			dm.send(
				"Un nouveau membre a rejoint le serveur de devloppement de Damien"
			);
			setTimeout(() => {
				dm.send(
					"Vous n'avez accès qu'au channel dev-bot ainsi qu'aux channels vocaux"
				);
			}, 1000);
		});
		setTimeout(() => {
			member.roles.add("1276297734898454629");
			member.createDM().then((dm) => {
				dm.send(
					"Vous avez reçu le role " +
						member.guild.roles.cache.get("1276297734898454629").name
				);
			});
		}, 3000);
	}
});

// Check if the bot is on
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
	if (message.channel.name === "dev-bot") {
		// Si on mentionne le bot sans rien d'autre alors on répond présent
		if (message.content === "<@1264264462840369212>") {
			message.reply(
				messages.MessageHere[
					Math.floor(Math.random() * messages.MessageHere.length)
				]
			);
		}
	}
});

// Detect when a message is send in channel dev-bot and reply with a message
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
	if (message.channel.name === "dev-bot") {
		console.log(
			"message received in dev-bot channel from " +
				message.author.username +
				" : " +
				message.content
		);
		transformedMessage = message.content.toLowerCase();

		const voiceChannel = message.guild.channels.cache.find(
			(channel) => channel.name === "Général"
		);
		if (
			transformedMessage.includes("koi") ||
			transformedMessage.includes("quoi")
		) {
			nb = Math.floor(Math.random() * 3);
			console.log(nb);
			if (nb === 0) {
				message.reply("feur");
			} else if (nb === 1) {
				message.author.createDM().then((dm) => {
					dm.send("feur");
				});
			} else if (nb === 2) {
				message.author.createDM().then((dm) => {
					dm.send({
						files: ["./assets/audio/feur.mp3"],
					});
				});
			}
		} else {
			return;
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Il y a eu une erreur lors de l'exécution de cette commande !",
			ephemeral: true,
		});
	}
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
 if (command === "clear") {
		// This command removes all messages from the user who write the command in the channel, up to 100.
		const user = message.author;
		const amount = parseInt(args[0]);

		if (isNaN(amount)) {
			return message.reply("Il faut entrer un nombre !");
		} else if (amount <= 1 || amount > 100) {
			return message.reply("Il faut entrer un nombre entre 1 et 100 exclus !");
		}

		message.channel.messages.fetch({ limit: amount }).then((messages) => {
			const userMessages = messages.filter((msg) => msg.author.id === user.id);
			message.channel.bulkDelete(userMessages);
		});

		// Fait un message qui se supprime au bout de 5 secondes
		message.channel.send("Messages supprimés").then((msg) => {
			msg.delete({ timeout: 50000 });
		});
	} else if (command === "bot-clear") {
		if (message.member.permissions.has("Administrator")) {
			// This command removes all messages from the bot
			const amount = parseInt(args[0]);

			if (isNaN(amount)) {
				return message.reply("Il faut entrer un nombre !");
			} else if (amount <= 1 || amount > 100) {
				return message.reply(
					"Il faut entrer un nombre entre 1 et 100 exclus !"
				);
			}

			//delete the numer of the message from the bot
			message.channel.messages.fetch({ limit: amount }).then((messages) => {
				const botMessages = messages.filter((msg) => msg.author.bot);
				message.channel.bulkDelete(botMessages);
			});

			message.channel.send("Messages supprimés").then((msg) => {
				msg.delete({ timeout: 50000 });
			});
		} else {
			message.reply("Vous n'avez pas les droits pour cette commande");
		}
	} else if (command === "bot-down") {
		if (message.member.permissions.has("Administrator")) {
			const channel = client.channels.cache.find(
				(channel) => channel.name === "dev-bot"
			);
			channel.send(
				messages.MessageDown[
					Math.floor(Math.random() * messages.MessageDown.length)
				]
			);

			client.destroy();
			console.log("Bot was down by a command");
		} else {
			message.reply("Vous n'avez pas les droits pour cette commande");
		}
	} else if (command === "quizdrapeau") {
		axios
			.get("https://restcountries.com/v3.1/all")
			.then((response) => {
				const data = response.data;
				const randomCountry = data[Math.floor(Math.random() * data.length)];
				const countryName = randomCountry.name.common;
				const flag = randomCountry.flags.png;
				const capital = randomCountry.capital[0];

				quizState[message.author.id] = {
					id: 0,
					countryName,
					capital,
					active: true,
					nbHit: 0,
				};

				message.channel.send("Quel est le drapeau de ce pays ? ");
				message.channel.send(flag);
				message.channel.send("Répondez avec le nom du pays");
				message.channel.send("Vous pouvez avoir un indice en tapant 'indice'");
				message.channel.send("Vous pouvez abandonner en tapant 'abandon'");

				//clear the cache
			})
			.catch((error) => {
				console.log(error);
			});
	} else if (command === "quizcapital") {
		axios
			.get("https://restcountries.com/v3.1/all")
			.then((response) => {
				const data = response.data;
				const randomCountry = data[Math.floor(Math.random() * data.length)];
				const countryName = randomCountry.name.common;
				const flag = randomCountry.flags.png;
				const capital = randomCountry.capital[0];

				quizState[message.author.id] = {
					id: 1,
					countryName,
					capital,
					active: true,
					nbHit: 0,
				};

				message.channel.send("Quel est la capital de ce pays : " + countryName);
				message.channel.send("Vous pouvez avoir un indice en tapant 'indice'");
				message.channel.send("Vous pouvez abandonner en tapant 'abandon'");

				//clear the cache
			})
			.catch((error) => {
				console.log(error);
			});
	} else {
		const random = Math.floor(Math.random() * 100);
		if (random === 0) {
			message.reply("Selon mes calculs, vous avez fait une erreur");
		} else if (random === 1 || random === 4 || random === 5 || random === 69) {
			message.reply("https://http.cat/418");
		} else if (random === 2) {
			message.reply(
				"En voilà une commande intéressante , je ne sais pas quoi en penser"
			);
		} else if (random === 3 || random === 6 || random === 7) {
			message.reply(
				"Selon le theoreme de la Daronne à " +
					message.author.username +
					" , vous avez fait une erreur"
			);
		} else if (random < 50) {
			message.reply("https://http.cat/404");
		} else {
			message.reply("Commande inconnue");
		}
	}
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	const userQuiz = quizState[message.author.id];
	if (userQuiz && userQuiz.active) {
		userQuiz.nbHit += 1;
		if (userQuiz.id === 0) {
			const answer = userQuiz.countryName;
			if (
				(answer === "France" && message.content === "Algeria") ||
				message.content === "Morocco" ||
				message.content === "Tunisia" ||
				message.content === "Arabes" ||
				message.content === "Maghreb"
			) {
				message.reply(
					"Bravo, vous avez trouvé la bonne réponse ! Vous avez trouvé en " +
						userQuiz.nbHit +
						" coups"
				);

				delete quizState[message.author.id];
			}
			if (message.content === answer) {
				message.reply(
					"Bravo, vous avez trouvé la bonne réponse ! Vous avez trouvé en " +
						userQuiz.nbHit +
						" coups"
				);
				message.reply(
					"https://servimg.eyrolles.com/static/media/9089/9782307519089_internet_h1400.jpg"
				);
				delete quizState[message.author.id];
			} else if (message.content === "indice") {
				message.reply("La capitale de ce pays est " + userQuiz.capital);
			} else if (message.content === "abandon") {
				message.reply("Vous avez abandonné ! La bonne réponse était " + answer);
				delete quizState[message.author.id];
			}
		} else if (userQuiz.id === 1) {
			const answer = userQuiz.capital;
			if (message.content === answer) {
				message.reply("Bravo, vous avez trouvé la bonne réponse !");
			} else if (message.content === "indice") {
				const len = answer.length;
				console.log(len);
				console.log(userQuiz.nbHit);
				if (userQuiz.nbHit === len - 1) {
					message.reply(
						"Malhaueusement il y a plus d'indice. Vous pouvez abandonné si vous ne trouvez pas"
					);
				} else {
					message.reply(
						"Voici le debut de la réponse:" +
							answer.substring(0, userQuiz.nbHit + 1)
					);
				}
			} else if (message.content === "abandon") {
				message.reply("Vous avez abandonné ! La bonne réponse était " + answer);
				delete quizState[message.author.id];
			}
		}
	}
});

// Easter egg
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	transformedMessage = message.content.toLowerCase();

	if (transformedMessage.includes("banane²")) {
		message.reply({
			files: ["./assets/images/banane.jpg"],
		});
	} else if (transformedMessage.includes("subway")) {
		message.reply({
			files: ["./assets/images/jules.jpg"],
		});
	}
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	if (filter.isProfane(message.content)) {
		admin.createDM().then((dm) => {
			dm.send(
				"Attention, " +
					message.author.username +
					" a envoyé un message insultant : " +
					message.content
			);
		});

		message.delete();
		setTimeout(() => {
			message.author.createDM().then((dm) => {
				dm.send(
					"Attention, les insultes ne sont pas autorisées sur le serveur !"
				);
			});
		}, 3000);
	}
});

client.on(Events.MessageCreate, async (message) => {});

// Commmand to down the bot
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
});

// Log in to Discord with your client's token
client.login(token);
