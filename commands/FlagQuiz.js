const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

const quizState = {}; // Pour garder une trace des quiz en cours

module.exports = {
	data: new SlashCommandBuilder()
		.setName("flagquiz")
		.setDescription("Démarre un quiz sur les drapeaux"),
	requiresQuizState: true, // Indique que cette commande a besoin de quizState
	async execute(interaction, quizState) {
		try {
			const response = await axios.get("https://restcountries.com/v3.1/all");
			const data = response.data;
			const randomCountry = data[Math.floor(Math.random() * data.length)];
			const countryName = randomCountry.name.common;
			const flag = randomCountry.flags.png;
			const capital = randomCountry.capital
				? randomCountry.capital[0]
				: "Inconnue";

			quizState[interaction.user.id] = {
				id: 0,
				countryName,
				capital,
				active: true,
				nbHit: 0,
			};

			await interaction.reply({
				content: `**Quel est le nom du pays dont le drapeau est le suivant**\n`,
				embeds: [
					{
						title: "Devinez le pays !",
						description:
							"Répondez avec le nom du pays.\nVous pouvez obtenir un indice en tapant 'indice'.\nVous pouvez abandonner en tapant 'abandon'.",
						image: { url: flag },
					},
				],
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des données des pays :",
				error
			);
			await interaction.reply({
				content:
					"Une erreur est survenue en essayant de récupérer les données. Veuillez réessayer plus tard.",
				ephemeral: true,
			});
		}
	},
};
