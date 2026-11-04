var { SetAsync } = require("../../DataStorage/Datastore");
var { get_locale_parsed } = require("../../Core/Localization");

module.exports = {
  data: {
    name: "setting-language",
    description: "Change in what language the bot responds",
    options: [
      {
        name: "option",
        description: "Change your language",
        type: 3,
        required: true,
        choices: [
          { name: "English", value: "en" },
          { name: "Deutsch", value: "de" }
        ]
      }
    ]
  },
  run: async function (interaction, client, vars) {
    var option = interaction.options.getString("option");
    SetAsync(interaction.user.id, { SETTING_LANGUAGE: option });
    return interaction.editReply(get_locale_parsed(option, "setting-language"));
  }
};