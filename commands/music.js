const { SlashCommandBuilder } = require("@discordjs/builders");
const { createReadStream } = require("fs");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	AudioPlayerStatus,
	entersState,
	VoiceConnectionStatus,
	StreamType,
} = require("@discordjs/voice");
const { ChannelType } = require("discord.js");

const path = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("music")
		.setDescription("Joue de la musique"),
	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) {
			const existingChannel = interaction.guild.channels.cache.find(
				(channel) =>
					channel.name === "musique" && channel.type === ChannelType.GuildVoice
			);

			if (!existingChannel) {
				// Trouver la catégorie "Salons vocaux"
				const voiceCategory = interaction.guild.channels.cache.find(
					(channel) =>
						channel.name === "Salons vocaux" &&
						channel.type === ChannelType.GuildCategory
				);

				const newChannel = await interaction.guild.channels.create({
					name: "musique",
					type: ChannelType.GuildVoice,
					parent: voiceCategory?.id || null,
					userLimit: 10,
				});
			}
			await interaction.reply({
				content:
					"Veuillez rejoindre le salon vocal 'musique' pour jouer de la musique.",
				ephemeral: true,
			});

			return;
		} else {
			//Le user est dans un salon vocal, move le bot dans le salon vocal ou est le user
			const botChannel = interaction.guild.members.me.voice.channel;

			if (botChannel === null || voiceChannel.id !== botChannel.id) {
				// Connexion
				const connection = joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
					selfDeaf: false,
					selfMute: false,
				});

				try {
					// Attendre que la connexion soit prête
					await entersState(connection, VoiceConnectionStatus.Ready, 5_000);

					// Jouer le son
					const player = createAudioPlayer();
					const resource = createAudioResource(
						createReadStream(path.join(__dirname, "../assets/audio/aube.wav")),
						{
							inputType: StreamType.Arbitrary,
						}
					);
					const audioPath = path.join(__dirname, "../assets/audio/aube.wav");

					// Affiche le chemin dans la console pour débogage
					console.log("Chemin du fichier audio:", audioPath);

					// Utilise la variable dans ta réponse
					await interaction.reply({
						content:
							"Je joue de la musique à l'adresse suivante : " + audioPath,
						ephemeral: true,
					});
					player.on("stateChange", (oldState, newState) => {
						console.log(
							`Audio player state changed from ${oldState.status} to ${newState.status}`
						);
					});
					player.on("error", (error) => {
						console.error("Erreur du player audio :", error);
					});

					//test d ajouter un wait avant de jouer le son
					await new Promise((resolve) => setTimeout(resolve, 1000));

					player.play(resource);

					connection.subscribe(player);
				} catch (error) {
					console.error(
						"Erreur lors de la connexion ou de la lecture :",
						error
					);
				}
			} else if (botChannel.id === voiceChannel.id) {
				// Réponse à l'utilisateur
				// Déconnexion du bot
				await interaction.reply({
					content: "Je me déconnecte, à bientôt !",
					ephemeral: true,
				});

				// Ajoute un délai avant de déconnecter pour s'assurer que la réponse est envoyée
				setTimeout(() => {
					const connection = getVoiceConnection(interaction.guild.id);
					if (connection) {
						console.log("Tentative de déconnexion du salon vocal");
						try {
							connection.destroy();
							console.log("Déconnexion réussie");
						} catch (error) {
							console.error("Erreur lors de la déconnexion:", error);
						}
					} else {
						console.log("Aucune connexion trouvée pour ce serveur");
					}
				}, 500);
			}
		}
	},
};
