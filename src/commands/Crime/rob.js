var { get_locale_parsed } = require("../../Core/Localization");
var { GetAsync, AddToAsync, SetAsync } = require("../../DataStorage/Datastore");
var { add_history } = require("../../Utilities/Helper");

var settings = {
  takeaway_percentage_max: 50,
  fine_percentage_max: 50,
  succeed_percentage: 40
};

module.exports = {
  data: {
    name: "rob",
    description: "The art of robery, dont let them catch you!",
    options: [
      { name: 'user', type: 6, required: true, description: 'User' },
    ]
  },
  run: async function(interaction, client, vars) {
    var target = interaction.options.getUser("user");

    if (target && target.bot) return interaction.editReply(get_locale_parsed(vars.language, "rob-bot"));

    let cash = await GetAsync(interaction.user.id, "cash");
    if (target.id == interaction.user.id) return interaction.editReply(get_locale_parsed(vars.language, "rob-self", { amount: Math.floor(Math.random() * cash) }));

    if (Math.random() * 100 < settings.succeed_percentage ) {
      let target_cash = await GetAsync(target.id, "cash");
      target_cash = Math.floor(target_cash * (Math.random() * settings.takeaway_percentage_max/100) )
      let history = add_history(await GetAsync(interaction.user.id, "history") || [], "+ " + target_cash + " [Rob-Success]");

      await AddToAsync(target.id, { cash: -target_cash });
      await AddToAsync(interaction.user.id, { cash: target_cash });
      await SetAsync(interaction.user.id, { history: history });

      return interaction.editReply(get_locale_parsed(vars.language, "rob-succeed", { amount: cash, user: `<@${target.id}>` }));

    } else {
      cash = Math.floor(cash * (Math.random() * settings.fine_percentage_max/100));
      let history = add_history(await GetAsync(interaction.user.id, "history") || [], "- " + cash + " [Rob-Failed]");

      await AddToAsync(interaction.user.id, { cash: -cash });
      await SetAsync(interaction.user.id, { history: history });

      return interaction.editReply(get_locale_parsed(vars.language, "rob-caught", { amount: cash, user: `<@${target.id}>` }));
    }
  }
};