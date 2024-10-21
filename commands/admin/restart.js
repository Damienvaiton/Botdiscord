const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("restart")
		.setDescription("Redémarre le bot"),
	async execute(interaction) {
		await interaction.reply("Redémarrage en cours...");
		process.on("exit", function () {
			require("child_process").spawn(process.argv.shift(), process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: "inherit",
			});
		});
	},
};
