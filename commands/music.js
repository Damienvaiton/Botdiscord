const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType } = require("discord.js");

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
			if (botChannel) {
				if (botChannel.id !== voiceChannel.id) {
					await interaction.member.voice.setChannel(botChannel);
				}
			} else {
				await interaction.member.voice.setChannel(voiceChannel);
			}
		}
	},
};
