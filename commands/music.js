const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

let music = require("../assets/files/data").music;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("music")
		.setDescription("Joue de la musique"),
	async execute(interaction) {
		const randomMusic = music[Math.floor(Math.random() * music.length)];
		await interaction.reply(randomMusic);
	},
};
