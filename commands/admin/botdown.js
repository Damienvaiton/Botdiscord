const { SlashCommandBuilder } = require("@discordjs/builders");
const message = require("../../assets/files/messages");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("botdown")
		.setDescription("Eteint le bot"),
	async execute(interaction) {
		//This command is only for admins
		if (!interaction.member.permissions.has("Administrator")) {
			return interaction.reply({
				content:
					"Vous n'avez pas la permission d'utiliser cette commande. Seuls les administrateurs peuvent l'utiliser.",
				ephemeral: true,
			});
		}

		const msg =
			message.MessageDown[
				Math.floor(Math.random() * message.MessageDown.length)
			];

		await interaction.reply({
			content: msg,
			ephemeral: false,
		});
		process.exit();
	},
};
