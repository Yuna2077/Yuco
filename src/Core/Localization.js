var config = require("./Config");
var strings = {
  "core-error-command": {
    "en": { type: "string", context: "%e_UI_X% Command errored while trying to process, please try later again!" },
    "de": { type: "string", context: "%e_UI_X% Kommand error beim ausführen, bitte probiere es später nochmal!" }
  },
  "bank-deposite": {
    "en": { type: "string", context: "%e_UI_Plus% You deposited %amount% %e_Cash% into the bank!\n- In bank: **%newAmount% %e_Cash%**" },
    "de": { type: "string", context: "%e_UI_Plus% Du hast %amount% %e_Cash% eingezahlt!\n- In Bank: **%newAmount% %e_Cash%**" }
  },
  "bank-withdraw": {
    "en": { type: "string", context: "%e_UI_Plus% You have withdrawn %amount% %e_Cash% from the bank!\n- In bank: **%newAmount% %e_Cash%**" },
    "de": { type: "string", context: "%e_UI_Plus% Du hast %amount% %e_Cash% abgehoben!\n- In Bank: **%newAmount% %e_Cash%**" }
  },

  "work-mine": {
    "en": { type: "string", context: "You descended into the mines and gathered **%amount%x %material%**! Your **%rarity%** discovery earned you **%earned%** %e_Cash%!" },
    "de": { type: "string", context: "Du begebst dich in die mine und sammelst **%amount%x %material%**! Deine **%rarity%** entdeckung bring dir **%amount%** %e_Cash% ein!" }
  },
  "work-fish": {
    "en": { type: "string", context: "You spent some time by the water and caught **%amount%x %material%**! Your **%rarity%** discovery earned you **%earned%** %e_Cash%!" },
    "de": { type: "string", context: "Du warst am wasser und hast **%amount%x %material%** geangelt! Deine **%rarity%** entdeckung bring dir **%amount%** %e_Cash% ein!" }
  },
  "work-farm": {
    "en": { type: "string", context: "You went to a field and harvested **%amount%x %material%**! Your harvest was from **%rarity%** rarity and earned you **%earned%** %e_Cash%!" },
    "de": { type: "string", context: "Du bist zu einem feld gegangen und hast **%amount%x %material%** gefarmt! Deine saar war von **%rarity%** qualität und bring dir **%earned%** %e_Cash% ein!" }
  },
  "work-hunt": {
    "en": { type: "string", context: "You returned from the wyld with **%amount%x %material%**! The seller said it was from **%rarity%** rarity and gave you **%earned%** %e_Cash%!" },
    "de": { type: "string", context: "Du kommst zurück von der wildness mit **%amount%x %material%**! Der verkäufer sagt es ist von **%rarity%** qualität und gibt dir **%earned%** %e_Cash% ein!" }
  },
  "wallet-bot": {
    "en": { type: "string", context: "%e_UI_X% The bot is richer then you, so its not worth checking out." },
    "de": { type: "string", context: "%e_UI_X% Der bot ist reicher als du, also es ist es nicht wert zu checken." }
  },

  "pay-bot": {
    "en": { type: "string", context: "%e_UI_X% Please stop giving money to bots... you would not pay for ai either right?" },
    "de": { type: "string", context: "%e_UI_X% Bitte hör auf denn bot geld zu geben... du würdest für ki ja auch nicht zahlen oder?" }
  },
  "pay-poor": {
    "en": { type: "string", context: "%e_UI_X% You are too poor to pay this much." },
    "de": { type: "string", context: "%e_UI_X% Du bist zu arm so viel zu bezahlen." }
  },
  "pay-self": {
    "en": { type: "string", context: "%e_UI_X% How do you expect to give yourself money?" },
    "de": { type: "string", context: "%e_UI_X% Wie willst du dir selbst geld geben?" }
  },
  "pay-paid": {
    "en": { type: "string", context: "%e_UI_Checkmark% You paid %amount% %e_Cash% to %ping%." },
    "de": { type: "string", context: "%e_UI_Checkmark% Du hast %amount% %e_Cash% an %ping% bezahlt." }
  },

  "daily-not-ready": {
    "en": { type: "string", context: "%e_UI_X% Daily not ready, next claim at %date%." },
    "de": { type: "string", context: "%e_UI_X% Tägliche belohnunh nicht bereit, nächster claim am %date%." }
  }
};


var parse_string = function (string, vars) {
  if (!string || typeof string !== 'string') {
    console.error("[ERROR]: parse failed due to invalid string beeing parsed: " + string(str));
    return string;
  };

  const emojiContext = Object.fromEntries(
    Object.entries(config.emojis)
      .map(([key, val]) => [`e_${key}`, val])
  );

  const context = {
    ...emojiContext,
    ...vars
  };

  let result = string;
  let prev;

  do {
    prev = result;
    result = result.replace(/%(\w+)%/g, (match, key) => {
      return context[key] !== undefined ? context[key] : match;
    });
  } while (result !== prev);

  return result;
};
var get_locale_raw = function (lang, id) { return strings[id][lang] };

var get_locale_parsed = function (lang, id, vars) {
  var returned = get_locale_raw(lang, id);
  switch (returned.type) {
    case "string":
      return parse_string(returned.context, vars);
    default:
      return "No translation found for: " + id;
  };
};

module.exports = {
  parse_string,
  get_locale_raw,
  get_locale_parsed
};