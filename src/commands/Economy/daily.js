var { get_locale_parsed } = require("../../Core/Localization");
var { add_history } = require("../../Utilities/Helper");
var { GetAsync, AddToAsync, SetAsync } = require("../../DataStorage/Datastore");

var settings = {
  payout: { min: 500, max: 2500 },
  weekend_multiplier: 2,
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
}

module.exports = {
  data: {
    name: "daily",
    description: "Pay money to another user."
  },
  run: async function(interaction, client, vars) {
    var today = new Date();
    var name = settings.days[today.getDay()];
    var today_str = today.toISOString().split("T")[0];
    let yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    var yesterday_str = yesterday.toISOString().split("T")[0]

    let data = await GetAsync(interaction.user.id, "daily");
    data = JSON.parse(data);

    if (data.LAST === today_str) return interaction.editReply(get_locale_parsed(vars.language, "daily-not-ready", { date: `<t:${Math.floor(today.setHours(24, 0, 0, 0) / 1000)}:F>` }));

    data.LAST = today_str;
    data.STREAK = (data.LAST === yesterday_str) ? data.STREAK + 1 : 1;
    data.BEST = data.BEST < data.STREAK ? data.STREAK : data.BEST;

    var reward = Math.floor(Math.random() * (settings.payout.max - settings.payout.min) + settings.payout.min);
    var is_weekend = (name === 'Saturday' || name === 'Sunday');

    await AddToAsync(interaction.user.id, { cash: reward, total_cash: reward });

    let history = add_history(await GetAsync(interaction.user.id, "history") || [], "+ " + reward + " [Daily]");
    await SetAsync(interaction.user.id, { history: history, daily: data });

    var embed = (is_weekend) ? get_locale_parsed(vars.language, "daily-claimed-boost", { amount: reward, streak: data.STREAK, streak_best: data.BEST }) : get_locale_parsed(vars.language, "daily-claimed", { amount: reward, streak: data.STREAK, streak_best: data.BEST });
    return interaction.editReply({ embeds: [embed] });
  }
};