var { get_locale_parsed } = require("../../Core/Localization");
var { choose } = require("../../Utilities/Helper");

var settings = {
  gifs: [
    "https://klipy.com/gifs/creepycat-loseurpower",
    "https://klipy.com/gifs/spookys-jumpscare-mansion-ringu-explosion",
    "https://klipy.com/gifs/jumpscare-cat",
    "https://klipy.com/gifs/fnaf-memes-5",
    "https://klipy.com/gifs/averageanatomy-tonio"
  ]
};

module.exports = {
  data: {
    name: "spook",
    description: "Spoookeee!!!",
    options: [
      { name: 'user', type: 6, required: true, description: 'User' },
    ]
  },
  run: async function (interaction, client, vars) {
    var target = interaction.options.getUser("user");
    var gif = choose(settings.gifs);

    if (target.bot) return interaction.editReply(get_locale_parsed(vars.language, "spook-bot", { user: `<@${interaction.user.id}>`, target: `<@${target.id}>`, gif: gif }));
    return interaction.editReply(get_locale_parsed(vars.language, "spook", { user: `<@${interaction.user.id}>`, target: `<@${target.id}>`, gif: gif }));
  }
};