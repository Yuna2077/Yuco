var { get_locale_parsed, parse_string } = require("../../Core/Localization");
var { GetAsync, AddToAsync, SetAsync } = require("../../DataStorage/Datastore");
var { sleep, add_history } = require("../../Utilities/Helper");
var { set_cooldown_for } = require("../../Utilities/Cooldown");

var settings = {
  win_chance: 49
};

var functions = {
  build: function (display) { return `🎰 ${display.join(" | ")}`; },
  get_symbol: function () {
    var total_weight = settings.symbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * total_weight;

    for (var s of settings.symbols) {
      if (random < s.weight) return s;
      random -= s.weight;
    };
  }
}

module.exports = {
  data: {
    name: "coinflip",
    description: "Double or nothing!",
    options: [
      { name: 'amount', type: 4, required: true, description: 'Amount' },
      {
        name: "option",
        description: "Option",
        type: 3,
        required: true,
        choices: [
          { name: "Head", value: "head" },
          { name: "Tails", value: "tails" }
        ]
      }
    ]
  },
  run: async function (interaction, client, vars) {
    let amount = interaction.options.getInteger("amount");
    let option = interaction.options.getString("option");
    let opposite_option
    var cash = await GetAsync(interaction.user.id, "cash");

    if (amount > cash) return interaction.editReply(get_locale_parsed(vars.language, "gambling-coinflip-poor"));
    set_cooldown_for(interaction, "coinflip", 60);

    // Option something weird idk
    if (option === "head") {
      option = get_locale_parsed(vars.language, "gambling-coinlfip-head");
      opposite_option = get_locale_parsed(vars.language, "gambling-coinlfip-tails");
    } else {
      option = get_locale_parsed(vars.language, "gambling-coinlfip-tails");
      opposite_option = get_locale_parsed(vars.language, "gambling-coinlfip-head");
    };

    if (Math.random() * 100 < settings.win_chance) {
      let history = add_history(await GetAsync(interaction.user.id, "history") || [], "+ " + amount + " [Coinflip]");
      await SetAsync(interaction.user.id, { history: history });
      await AddToAsync(interaction.user.id, { cash: amount });

      return interaction.editReply(get_locale_parsed(vars.language, "gambling-coinflip-win", { face: option, amount: amount }));
    };

    let history = add_history(await GetAsync(interaction.user.id, "history") || [], "- " + amount + " [Coinflip]");
    await SetAsync(interaction.user.id, { history: history });
    await AddToAsync(interaction.user.id, { cash: -amount });

     return interaction.editReply(get_locale_parsed(vars.language, "gambling-coinflip-lose", { face: opposite_option, amount: amount }));
  }
};