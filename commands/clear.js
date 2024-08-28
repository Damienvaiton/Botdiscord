const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription(
			"Supprime un nombre de messages donné de l'utilisateur qui execute la commande"
		)
		.addIntegerOption((option) =>
			option
				.setName("nombre")
				.setDescription("Le nombre de messages à supprimer")
				.setRequired(true)
		),
	async execute(interaction) {
		const amount = interaction.options.getInteger("nombre");

		if (amount <= 1 || amount > 100) {
			return interaction.reply({
				content: "Vous devez saisir un nombre entre 1 et 99.",
				ephemeral: true,
			});
		}

		await interaction.channel.bulkDelete(amount, true).catch((error) => {
			console.error(error);
			interaction.reply({
				content: "Il y a eu une erreur en essayant de supprimer les messages.",
				ephemeral: true,
			});
		});

		await interaction.reply({
			content: `J'ai supprimé ${amount} messages`,
			ephemeral: true,
		});
	},
};
