var config = require("./Config");
var { choose } = require("../Utilities/Helper");
var { EmbedBuilder } = require("discord.js");

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
    "de": { type: "string", context: "%e_UI_X% Tägliche belohnung nicht bereit, nächster claim am %date%." }
  },
  "daily-claimed": {
    "en": { type: "embed", context: {
      color: [100, 250, 100],
      title: "%e_UI_Checkmark% Daily claimed",
      description: "%e_Gift% Reward: %amount% %e_Cash%\n%e_Fire% Streak: %streak% | %e_PurpleFire% Best: %streak_best%"
    }},
    "de": { type: "embed", context: {
      color: [100, 250, 100],
      title: "%e_UI_Checkmark% Tägliche belohnung eingesammelt",
      description: "%e_Gift% Belohnung: %amount% %e_Cash%\n%e_Fire% Streak: %streak% | %e_PurpleFire% Best: %streak_best%"
    }},
  },
  "daily-claimed-boost": {
    "en": { type: "embed", context: {
      color: [200, 100, 250],
      title: "%e_UI_Checkmark% Daily claimed",
      description: "%e_Gift% Reward: %amount%\n%e_Fire% Streak: %streak% | %e_PurpleFire% Best: %streak_best%\n%e_PurpleLighting% 2x Weekend boost active!"
    }},
    "de": { type: "embed", context: {
      color: [200, 100, 250],
      title: "%e_UI_Checkmark% Tägliche belohnung eingesammelt",
      description: "%e_Gift% Belohnung: %amount%\n%e_Fire% Streak: %streak% | %e_PurpleFire% Best: %streak_best%\n%e_PurpleLighting% 2x Wochenend Boost aktiv!"
    }},
  },

  "rob-bot": {
    "en": { type: "string", context: "%e_UI_X% Robbing a bot huh... you hit a new low." },
    "de": { type: "string", context: "%e_UI_X% Einen bot ausrauben huh... du bist das aller letzte" }
  },
  "rob-self": {
    "en": { type: "string", context: "%e_UI_X% Sure rob yourself.. here... take your own money %amount%" },
    "de": { type: "string", context: "%e_UI_X% Sicherlich raub dich selbst aus... hier... nehm dein eigenes geld %amount%" }
  },
  "rob-succeed": {
    "en": { type: "string", context: "%e_UI_X% You have robbed %amount% %e_Cash% from %user%!" },
    "de": { type: "string", context: "%e_UI_X% Du hast %amount% %e_Cash% von %user% geklaut!" }
  },
  "rob-caught": {
    "en": { type: "string", context: "%e_Skull% You were caught in the attempt to rob %user% you have been fined %amount% %e_Cash%!" },
    "de": { type: "string", context: "%e_Skull% Du wurdest erwischt beim versuch %user% auszurauben, du musstest eine strafe von %amount% %e_Cash% zahlen!" }
  },

  "bonk-bot": {
    "en": { type: "string", context: "%e_Skull% %user% goes on to bonk the metal %target% where it hurts (Why would anyone bonk a bot...)!" },
    "de": { type: "string", context: "%e_Skull% %user% geht und bonk metal kopf %target% wo es weh tut (Warum man auch immer einen bot bonkt...)!" }
  },
  "bonk": {
    "en": { type: "random", context: [
      "🔨 %user% [bonked](%gif%) %target% into the next century!",
      "🌌 %user% [bonked](%gif%) %target% so hard they saw stars!",
      "🌕 %user% [bonked](%gif%) %target% all the way to the moon!",
      "💫 %user% [bonked](%gif%) %target% into another dimension!",
      "🪐 %user% [bonked](%gif%) %target% straight into orbit!"
    ]},
    "de": { type: "random", context: [
      "🔨 %user% [bonked](%gif%) %target% ins nächste jahrhundert!",
      "🌌 %user% [bonked](%gif%) %target% bis er sterne sah!",
      "🌕 %user% [bonked](%gif%) %target% bis zum mund und zurück!",
      "💫 %user% [bonked](%gif%) %target% in eine andere dimension!",
      "🪐 %user% [bonked](%gif%) %target% ins orbit!"
    ]},
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
  let returned;
  try {
    returned = get_locale_raw(lang, id);
  } catch(err) {
    return "translation is currently broken: " + err;
  };

  switch (returned.type) {
    case "string":
      return parse_string(returned.context, vars);
    case "random":
      return parse_string(choose(returned.context), vars);
    case "embed":
      {
        var embed = new EmbedBuilder();
        returned = returned.context;

        if (returned.color)
          embed.setColor(returned.color);
        if (returned.title)
          embed.setTitle(parse_string(returned.title, vars));
        if (returned.description)
          embed.setDescription(parse_string(returned.description, vars));
        if (returned.fields)
          embed.setFields(parse_string(returned.fields, vars));
        if (returned.footer)
          embed.setFields(parse_string(returned.footer, vars));

        return embed;
      }
    default:
      return "translation is currently broken: no type found for: " + id;
  };
};

module.exports = {
  parse_string,
  get_locale_raw,
  get_locale_parsed
};