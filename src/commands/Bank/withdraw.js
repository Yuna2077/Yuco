var { get_locale_parsed } = require("../../Core/Localization");
var { GetAsync, AddToAsync, SetAsync } = require("../../DataStorage/Datastore");

module.exports = {
  data: {
    name: "withdraw",
    description: "Withdraw money from your bank",
    options: [
      { name: 'amount', type: 4, required: true, description: 'Amount' },
    ]
  },
  run: async function(interaction, client, vars) {
    let amount = interaction.options.getInteger("amount");
    var cash = await GetAsync(interaction.user.id, "cash");
    var deposited = await GetAsync(interaction.user.id, "deposited");

    if (amount > deposited) amount = deposited;
    deposited -= amount;
    cash += amount;
    await SetAsync(interaction.user.id, { cash: cash, deposited: deposited })

    return interaction.editReply(get_locale_parsed(vars.language, "bank-withdraw", { amount: amount, deposited: deposited }));
  }
};