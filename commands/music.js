const { SlashCommandBuilder } = require("@discordjs/builders");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	AudioPlayerStatus,
	entersState,
	VoiceConnectionStatus,
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
						path.join(__dirname, "./assets/audio/feur.mp3")
					);
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
				await interaction.reply({
					content: "Bye bye",
					ephemeral: true,
				});

				// Déconnexion du bot
				const connection = getVoiceConnection(interaction.guild.id);
				if (connection) {
					connection.destroy();
				}
			}
		}
	},
};
