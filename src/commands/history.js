var { GetAsync } = require("../DataStorage/Datastore");

module.exports = {
  data: {
    name: "history",
    description: "View your balance history."
  },
  run: async function(interaction, client, vars) {
    var history = JSON.parse(await GetAsync(interaction.user.id, "history"));

    let str = "```diff";
    for (var item of history) {
      str += "\n" + item;
    }; str += "```";

    return interaction.editReply(str);
  }
};