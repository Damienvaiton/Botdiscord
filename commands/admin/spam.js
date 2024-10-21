const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { idToPromote } = require("../../assets/files/data");
const { MessageSpam } = require("../../assets/files/messages");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("spam")
		.setDescription(
			"Gache la vie de quelqu'un ( ATTENTION CELA FAIT CRASH LE BOT )"
		)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Utilisateur à qui envoyer le message")
				.setRequired(true)
		)

		.addStringOption((option) =>
			option
				.setName("number_of_")
				.setDescription("Nombre de fois à envoyer le message")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("Le message à envoyer")
				.setRequired(false)
		),

	async execute(interaction) {
		//This command is only for god
		if (!idToPromote.includes(interaction.member.user.id)) {
			return interaction.reply({
				content:
					"Vous n'avez pas la permission d'utiliser cette commande. Seul Dieu peut l'utiliser.",
				ephemeral: true,
			});
		}

		const user = interaction.options.getUser("user");
		const message = interaction.options.getString("message");

		const number_of_ = interaction.options.getString("number_of_");

		console.log(message);

		if (message == null) {
			for (let i = 0; i < number_of_; i++) {
				await user.send(
					MessageSpam[Math.floor(Math.random() * MessageSpam.length)]
				);
				console.log("J'ai envoyer un message à " + user.username);
			}
		} else {
			for (let i = 0; i < number_of_; i++) {
				await user.send(message);
				await new Promise((resolve) => setTimeout(resolve, 500));
				console.log("J'ai envoyer un message à " + user.username);
			}
		}

		await interaction.reply({
			content: "Message envoyé!",
			ephemeral: true,
		});
	},
};
