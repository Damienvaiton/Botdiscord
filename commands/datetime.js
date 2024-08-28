const { SlashCommandBuilder } = require("@discordjs/builders");
const functions = require("../functions");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("datetime")
		.setDescription("Répond avec la date et l'heure actuelle"),
	async execute(interaction) {
		await interaction.reply(
			"nous sommes le " +
				functions.getCurrentDate() +
				" et il est " +
				functions.getCurrentTime()
		);
	},
};
