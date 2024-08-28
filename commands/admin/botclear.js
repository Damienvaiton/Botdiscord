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
		//This command is only for admins
		if (!interaction.member.permissions.has("Administrator")) {
			return interaction.reply({
				content:
					"Vous n'avez pas la permission d'utiliser cette commande. Seuls les administrateurs peuvent l'utiliser.",
				ephemeral: true,
			});
		}

		const amount = interaction.options.getInteger("nombre");

		if (amount <= 1 || amount > 100) {
			return interaction.reply({
				content: "Vous devez saisir un nombre entre 1 et 99.",
				ephemeral: true,
			});
		}

		await interaction.channel.bulkDelete(amount, true).catch((error) => {
			console.error(error);
			return interaction.reply({
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
