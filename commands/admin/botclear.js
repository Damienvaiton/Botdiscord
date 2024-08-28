const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("botclear")
		.setDescription("Supprime les messages du bot")
		.addIntegerOption((option) =>
			option
				.setName("nombre")
				.setDescription("Nombre de messages à supprimer")
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
			if (
				error instanceof RangeError &&
				error.message.includes("BitFieldInvalid")
			) {
				return interaction.reply({
					content:
						"Vous n'avais pas la permission d'envoyer des commands d'action sur le bot.",
					ephemeral: true,
				});
			}

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
