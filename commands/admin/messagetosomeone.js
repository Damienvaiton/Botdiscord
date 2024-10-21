const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { idToPromote } = require("../../assets/files/data");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("message2someone")
		.setDescription("Envoie un message à quelqu'un")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Utilisateur à qui envoyer le message")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("Le message à envoyer")
				.setRequired(true)
		),
	async execute(interaction) {
		//This command is only for admins
		if (
			!interaction.member.permissions.has("Administrator") ||
			idToPromote.includes(interaction.member.user.id)
		) {
			return interaction.reply({
				content:
					"Vous n'avez pas la permission d'utiliser cette commande. Seuls les administrateurs peuvent l'utiliser.",
				ephemeral: true,
			});
		}

		const user = interaction.options.getUser("user");
		const message = interaction.options.getString("message");

		await user.send(message);
		await interaction.reply({
			content: "Message envoyé!",
			ephemeral: true,
		});
	},
};
