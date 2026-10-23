var { get_locale_parsed } = require("../../Core/Localization");
var { GetAsync, AddToAsync } = require("../../DataStorage/Datastore");

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
    var yesterday_str = (today.getDate() - 1).toISOString().split("T")[0];

    let data = await GetAsync(interaction.user.id, "daily");
    if (!data.STREAK || !data.BEST || !data.LAST) data = { STREAK: 0, BEST: 0, LAST: "1999-01-01" };

    if (data.LAST === today_str) return interaction.editReply(get_locale_parsed(vars.language, "daily-not-ready", { date: `<t:${Math.floor(today.setHours(24, 0, 0, 0) / 1000)}:F>` }));

    data.STREAK = (data.LAST === yesterday_str) ? data.STREAK +1 : 0;
    data.BEST = data.BEST < streak ? streak : DailyData.BEST
    var reward = Math.floor(Math.random() * (settings.payout.max - settings.payout.min) + settings.payout.min);
    var is_weekend = (dayName === 'Saturday' || dayName === 'Sunday');
    
  }
};