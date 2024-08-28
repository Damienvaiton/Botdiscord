const { SlashCommandBuilder } = require("@discordjs/builders");
const functions = require("../functions");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("time")
        .setDescription("Répond avec l'heure actuelle"),
    async execute(interaction) {
        await interaction.reply("il est " + functions.getCurrentTime());
    },
};