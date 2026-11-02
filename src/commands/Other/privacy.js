var { GetAsync, getAsync, createUser, removeUser } = require("../../DataStorage/Datastore");
var { get_locale_parsed } = require("../../Core/Localization");

module.exports = {
  data: {
    name: "privacy",
    description: "View your balance history.",
    options: [
      {
        name: "option",
        description: "Option",
        type: 3,
        required: true,
        choices: [
          { name: "Delete my Data", value: "delete" },
          { name: "Request my Data", value: "request" }
        ]
      }
    ]
  },
  run: async function (interaction, client, vars) {
    switch (interaction.options.getString("option")) {
      case "delete": {
        await removeUser(interaction.user.id);
        return interaction.editReply(get_locale_parsed(vars.language, "core-privacy-delete"));
      }
      case "request": {
        await createUser(interaction.user.id);
        var row = await getAsync(`SELECT * FROM users WHERE id = ?`, [interaction.user.id]);
        return interaction.editReply(get_locale_parsed(vars.language, "core-privacy-request", { data: JSON.stringify(row) }));
      }
    }
  }
};