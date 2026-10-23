var { get_locale_parsed } = require("../../Core/Localization");
var { core } = require("../../Core/Config");
var { choose, history, add_history } = require("../../Utilities/Helper");
var { AddToAsync, GetAsync, SetAsync } = require("../../DataStorage/Datastore");

var settings = {
  jobs: {
    default: [ "mine", "fish", "farm", "hunt" ],
    halloween: [ "trick-or-treat" ]
  },
  rarities: {
    common: { rarity: 150, worth: 10 },
    rare: { rarity: 75, worth: 25 },
    epic: { rarity: 20, worth: 50 },
    legendary: { rarity: 4, worth: 100 },
    mythic: { rarity: 1, worth: 250 }
  },
  materials: {
    mine: {
      common: ["Grass", "Stone", "Granite", "Diorite", "Gravel", "Zinc", "Obsidian", "Garnet", "Malachite"],
      rare: ["Coal", "Copper", "Iron", "Gold", "Chromium"],
      epic: ["Osmium", "Tin", "Sulfur", "Iridium", "Slate", "Platinum", "Lapiz", "Topaz"],
      legendary: ["Diamond", "Emerald", "Sapphire", "Ruby", "Mithdrill", "Sunstone", "Rainbownite"],
      mythic: ["Netherite", "Amethyst", "Uranium (Yummy)", "Yunium"],
    },
    fish: {
      common: ["Seaweed", "Kelp", "Old Sneaker", "Old High Heel"],
      rare: ["Cod", "Rainbow Trout", "Salmon", "Anchor"],
      epic: ["Tropical Fish", "Squid", "Shrimp", "Golden Carp"],
      legendary: ["Axolotl", "Plastic", "Fishing Rod", "Electronic Device", "Paper with 'Free Nitro' written on it"],
      mythic: ["Neptune's Trident", "Sunken Treasure Chest", "Pineapple House", "Squidward"],
    },
    farm: {
      common: ["Wheat", "Corn", "Carrot", "Potato"],
      rare: ["Tomato", "Pumkin", "Watermelon", "Banana"],
      epic: ["Strawberry", "Blueberry", "Sugar Cane", "Golden Corn"],
      legendary: ["Purple Carrot", "Giant Pumkin (Farmer was replaced)", "Crystal Berry", "Ancient Root"],
      mythic: ["Moon Blossom", "Spirit Crop", "Dragonfruit", "World Seed"],
    },
    hunt: {
      common: ["Feather", "Rabbit", "Pheasamt", "Gease"],
      rare: ["Boar", "Deer", "Capibara", "Wolf"],
      epic: ["Stag", "Griffin", "Dixi Toilet", "Eagle"],
      legendary: ["Ancient Silver Fox", "Pheonix", "Unicorn", "Yourself"],
      mythic: ["Flying Spaghetti Monster", "Sentient Chicken Nugget", "IPhone 21", "Godzilla's Smaller Brother (Kevin)", "The Marshmellow monster from Ghostbusters"],
    },

    "trick-or-treat": {
      common: [],
      rare: [],
      epic: [],
      legendary: [],
      mythic: [],
    }
  }
}

module.exports = {
  data: { name: "work", description: "Earn yourself some cash!" },
  run: async function(interaction, client, vars) {
    var job = choose(settings.jobs[core.THEME]);

    var rarityWeight = Object.values(settings.rarities).reduce((sum, r) => sum + r.rarity, 0);
    let roll = Math.random() * rarityWeight;
    let rarity = "common";
    for (const key in settings.rarities) {
      roll-=settings.rarities[key].rarity;
      if (roll < 0) { rarity = key; break; }
    };

    var amount = Math.round(Math.random() * 25);
    var earned = Math.round(amount * settings.rarities[rarity].worth);
    var material = choose(settings.materials[job][rarity])

    await AddToAsync(interaction.user.id, { cash: earned });

    let history = add_history(await GetAsync(interaction.user.id, "history") || [], "+ " + earned + " [Work]");
    await SetAsync(interaction.user.id, { history: history });

    return interaction.editReply(get_locale_parsed(vars.language, "work-" + job, {
      rarity: rarity, amount: amount, earned: earned, material: material
    }));
  }
};