var { get_locale_parsed } = require("../../Core/Localization");
var { GetAsync } = require("../../DataStorage/Datastore");

module.exports = {
  data: {
    name: "wallet",
    description: "View your current balance.",
    options: [
      { name: 'user', type: 6, required: true, description: 'User' },
    ]
  },
  run: async function(interaction, client, vars) {
    var target = interaction.options.getUser("user");
    if (target && target.bot) return interaction.editReply(get_locale_parsed(vars.language, "bank-balance-bot"));

    var userID = target.id || interaction.user.id;

    var cash = await GetAsync(userID, "cash");
    var deposited = await GetAsync(userID, "deposited");

    return interaction.editReply({ embeds: [get_locale_parsed(vars.language, "bank-balance", { cash_amount: cash, deposited_amount: deposited })]});
  }
};