var { get_locale_parsed } = require("../../Core/Localization");
var { GetAsync, AddToAsync } = require("../../DataStorage/Datastore");

module.exports = {
  data: {
    name: "pay",
    description: "Pay money to another user.",
    options: [
      { name: 'user', type: 6, required: true, description: 'User' },
      { name: 'amount', type: 4, required: true, description: 'Amount' },
    ]
  },
  run: async function(interaction, client, vars) {
    var target = interaction.options.getUser("user");
    var amount = interaction.options.getInteger("amount");

    if (target && target.bot) return interaction.editReply(get_locale_parsed(vars.language, "pay-bot"));
    if (target.id == interaction.user.id) return interaction.editReply(get_locale_parsed(vars.language, "pay-self"));

    var cash = await GetAsync(interaction.user.id, "cash");
    if (cash < amount) return interaction.editReply(get_locale_parsed(vars.language, "pay-poor"));

    await AddToAsync(interaction.user.id, { cash: -amount });
    await AddToAsync(target.id, { cash: amount });

    return interaction.editReply(get_locale_parsed(vars.language, "pay-paid", { amount: amount, ping: `<@${target.id}>` }));
  }
};