var { get_locale_parsed } = require("../../Core/Localization");
var { choose } = require("../../Utilities/Helper");

var settings = {
  gifs: [
    "https://tenor.com/view/nobara-bonk-nobara-kugisaki-nobara-hammer-kugisaki-nobara-bonk-anime-gif-8518894744860326251",
    "https://tenor.com/view/teto-utau-sansansanxu-vocaloid-i%27m-talking-to-you-gif-2641126725330411734",
    "https://tenor.com/view/bonk-meme-dog-gif-9935778472248450901",
    "https://tenor.com/view/bonk-gif-20931372",
    "https://tenor.com/view/chainsawman-anime-slap-gif-26953570",
    "https://tenor.com/view/bonk-pramod-bonk-gif-26084438",
    "https://tenor.com/view/chikku-neesan-girl-hit-wall-stfu-anime-girl-smack-gif-17078255",
    "https://tenor.com/view/hitoribocchi-bocchi-aru-aru-chan-hitoribocchi-aru-gif-14409897",
    "https://tenor.com/view/yuru-yuri-chinatsu-yoshikawa-anime-anime-girl-bonk-gif-23853785",
    "https://tenor.com/view/bonk-gif-19410756",
    "https://tenor.com/view/spongebob-meme-bonk-gif-24279189",
    "https://tenor.com/view/bonk-anime-bonk-anime-telepurte-gif-27011014",
    "https://tenor.com/view/bonk-gif-19823428",
    "https://tenor.com/view/hammer-bonk-nice-funny-meme-gif-17679897",
    "https://tenor.com/view/cat-hammer-cat-being-hit-on-the-head-with-a-hammer-monjjunirawr-silly-cat-cat-hammered-gif-10390299470246788991",
    "https://tenor.com/view/bonk-anime-bonk-anime-telepurte-gif-27011014",
    "https://tenor.com/view/anime-yuru-camp-bonk-inuko-inuyama-aoi-gif-26248050",
    "https://tenor.com/view/anime-manga-japanese-anime-japanese-manga-good-morning-gif-5373995",
    "https://tenor.com/view/anime-hit-slap-ouch-angry-gif-16268549",
    "https://tenor.com/view/anime-couple-gif-21797661",
    "https://tenor.com/view/yuuri-gif-5801403741788878996",
    "https://tenor.com/view/anime-hurt-ouch-owie-ow-gif-2131009854309987640",
    "https://tenor.com/view/anime-slap-anime-bonk-maomao-mao-mao-the-apothecary-diaries-gif-5846501696894609621",
    "https://tenor.com/view/anime-anime-bonk-bonk-chione-rin-gif-13725879436249041605",
    "https://tenor.com/view/cat-smacking-other-cat-cat-cat-smack-cat-swat-gif-10347810988835752163",
    "https://tenor.com/ekIvtuSuPis.gif",
    "https://media.tenor.com/b5tAzjbsG68AAAAM/minmi-bonk.gif",
    "https://media.tenor.com/OLujEp3SITwAAAAM/gura-%E3%81%90%E3%82%89.gif",
    "https://media.tenor.com/nRRVfDVrTksAAAAM/sengoku-youko-tsukiko.gif",
    "https://media.tenor.com/P3ncSta36A8AAAAM/miku-hatsune-miku.gif",
    "https://media.tenor.com/GnafzH7LqWsAAAAm/rina-bonk-love-live.webp",
    "https://media.tenor.com/vd9BRgtG56oAAAAm/pepe-bonk-bonk.webp",
    "https://tenor.com/view/triple-baka-akita-neru-miku-gif-13058394147293592939",
    "https://tenor.com/view/patrick-star-smash-gif-19642208",
    "https://tenor.com/view/bonk-hit-book-school-anime-gif-24977313",
    "https://tenor.com/view/miku-bonk-teto-bonking-gif-3440206642400665161"
  ]
};

module.exports = {
  data: {
    name: "bonk",
    description: "Bonk these peasents!",
    options: [
      { name: 'user', type: 6, required: true, description: 'User' },
    ]
  },
  run: async function (interaction, client, vars) {
    var target = interaction.options.getUser("user");
    var gif = choose(settings.gifs);

    if (target.bot) return interaction.editReply(get_locale_parsed(vars.language, "bonk-bot", { user: `<@${interaction.user.id}>`, target: `<@${target.id}>`, gif: gif }));
    return interaction.editReply(get_locale_parsed(vars.language, "bonk", { user: `<@${interaction.user.id}>`, target: `<@${target.id}>`, gif: gif }));
  }
};