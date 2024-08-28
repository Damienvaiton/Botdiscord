const { SlashCommandBuilder } = require("@discordjs/builders");
const functions = require("../functions");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("date")
		.setDescription("Répond avec la date actuelle"),
	async execute(interaction) {
		await interaction.reply("nous sommes le " + functions.getCurrentDate());
	},
};
