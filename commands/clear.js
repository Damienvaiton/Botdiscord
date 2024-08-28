const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription(
			"Supprime les messages de l'utilisateur qui a envoyé la commande"
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("Nombre de messages à supprimer")
				.setRequired(true)
		),
	async execute(interaction) {
		// Nombre de messages à supprimer
		const amount = interaction.options.getInteger("amount");

		if (amount < 1 || amount > 100) {
			return interaction.reply({
				content: "Veuillez entrer un nombre de messages entre 1 et 100.",
				ephemeral: true,
			});
		}

		try {
			// Récupère les messages récents du canal
			const messages = await interaction.channel.messages.fetch({
				limit: amount,
			});

			// Filtrer les messages pour garder uniquement ceux de l'utilisateur qui a envoyé la commande
			const userMessages = messages.filter(
				(message) => message.author.id === interaction.user.id
			);

			// Supprimer les messages filtrés
			await interaction.channel.bulkDelete(userMessages, true);

			// Réponse de confirmation
			await interaction.reply({
				content: `J'ai supprimé ${userMessages.size} message(s) de votre part.`,
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "Il y a eu une erreur en essayant de supprimer les messages.",
				ephemeral: true,
			});
		}
	},
};
