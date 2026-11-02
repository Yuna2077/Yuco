var { get_locale_parsed, parse_string } = require("../../Core/Localization");
var { GetAsync, AddToAsync, SetAsync } = require("../../DataStorage/Datastore");
var { sleep } = require("../../Utilities/Helper");
var { set_cooldown_for } = require("../../Utilities/Cooldown");

var settings = {
  placeholder: "%e_UI_QuestionMark%",
  symbols: [
    { emoji: "%e_BlueLighting%", weight: 3, jackpot: 3 },
    { emoji: "%e_Skull%", weight: 3, jackpot: 6 },
    { emoji: "%e_Fire%", weight: 2, jackpot: 9 },
    { emoji: "%e_Heart%", weight: 2, jackpot: 12 },
    { emoji: "%e_GoldenStar%", weight: 2, jackpot: 25 },
    { emoji: "%e_AngelHeart%", weight: 1, jackpot: 45 },
    { emoji: "%e_GoldenAngelHeart%", weight: 0.5, jackpot: 90 },
  ],
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
    name: "slots",
    description: "Gamble responsibly... or not idc.",
    options: [
      { name: 'amount', type: 4, required: true, description: 'Amount' },
    ]
  },
  run: async function (interaction, client, vars) {
    let amount = interaction.options.getInteger("amount");
    var cash = await GetAsync(interaction.user.id, "cash");

    if (amount > cash) return interaction.editReply(get_locale_parsed(vars.language, "gambling-slots-poor"));
    if (cash === 0) {
      var totalWeight = settings.symbols.reduce((sum, s) => sum + s.weight, 0);
      var infoLines = settings.symbols
        .map(s => `${s.emoji}: ${((s.weight / totalWeight) * 100).toFixed(1)}% chance - Jackpot: ${s.jackpot}`);

      var str = `Symboles:\n` + infoLines.join("\n") + `\n\nPair payout is 2x`
      return interaction.editReply({ embeds: [get_locale_parsed(vars.language, "gambling-slots-info", { description: str })] });
    };

    set_cooldown_for(interaction, "slots", 60);
    var result = [functions.get_symbol(), functions.get_symbol(), functions.get_symbol()];
    let display = [settings.placeholder, settings.placeholder, settings.placeholder];
    await interaction.editReply(parse_string(functions.build(display)));

    for (let i = 0; i < 3; i++) {
      await sleep(500);
      display[i] = result[i].emoji;
      await interaction.editReply(parse_string(functions.build(display)));
    };

    var [a, b, c] = result;
    let multiplier = 0;
    if (a.emoji === b.emoji && b.emoji === c.emoji) multiplier = a.jackpot;
    else if (a.emoji === b.emoji || b.emoji === c.emoji || c.emoji === a.emoji) multiplier = 2;

    if (multiplier === 0) {
      await AddToAsync(interaction.user.id, { cash: -amount })
      return interaction.editReply(get_locale_parsed(vars.language, "gambling-slots-lose", { amount: amount, result: functions.build(display) }));
    };

    var reward = Math.round(amount * multiplier);
    await AddToAsync(interaction.user.id, { cash: reward, total_gambled: reward });

    let history = add_history(await GetAsync(interaction.user.id, "history") || [], "+ " + earned + " [Slots]");
    await SetAsync(interaction.user.id, { history: history });

    return interaction.editReply(get_locale_parsed(vars.language, "gambling-slots-win", { amount: amount, multiplier: multiplier, result: functions.build(display) }));
  }
};