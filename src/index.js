// index.js

// Main modules
var start = performance.now();
var version = require('../package.json').version;
var result = require('dotenv').config();
//const Testers = process.env.TESTER?.split(',') || [];
//const Developers = process.env.DEVELOPER?.split(',') || [];

var DISCORD_ERRORS = {
    UNKNOWN_INTERACTION: 10062,
    INTERACTION_ALREADY_ACKNOWLEDGED: 40060
};

const CONFIG = {
  DEBUG_LEVELS: {
    INFO: { ACTIVE: true, COLOR: "\x1b[36m [INFO]:" },
    WARN: { ACTIVE: true, COLOR: "\x1b[93m [WARN]:" },
    ERROR: { ACTIVE: true, COLOR: "\x1b[31m [ERROR]:" },
  }
};
function debug({ string, configSet }) {
  if (configSet.ACTIVE) console.log(configSet.COLOR, "\x1b[0m", string)
}

var { get_locale_parsed } = require("./Core/Localization");
var { initDB, GetAsync } = require("./DataStorage/Datastore");
var loadModules = require('./Utilities/LoadCommandsModules');
var { has_cooldown_for, set_cooldown_for } = require("./Utilities/Cooldown");

initDB();
var commandModules = loadModules('./src/Commands');

var token = process.env.BOT_TOKEN;
var clientId = process.env.BOT_CLIENT_ID;
var ownerId = process.env.OWNER_ID;
var testers = ["1041011108011577355"];

const { Client, GatewayIntentBits, Options } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const restClient = new REST({ version: '10' }).setToken(token);
const config = require('./config');
debug({ string: `Variables ready ${performance.now() - start} ms`, configSet: CONFIG.DEBUG_LEVELS.INFO });

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// #region Bot Status
bot.once('clientReady', async () => {
    const { ActivityType } = require('discord.js');

    bot.user.setPresence({
        activities: [{
            name: "Gathering Informations...",
            type: "Playing"
        }],
        status: "online"
    })

    setInterval(() => {
        const usage = process.memoryUsage();

        if (config.memory_debug)
            console.log({
                rss: (usage.rss / 1024 / 1024).toFixed(2) + " MB",
                heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + " MB",

                guilds: bot.guilds.cache.size,
                users: bot.users.cache.size,
                channels: bot.channels.cache.size
            });

        if (usage > config.memory_limit) {
            console.log("Memory limit exceeded, shutting down.");
            process.exit(1);
        };
    }, 10000);
    debug({ string: `Client ready ${performance.now() - start} ms`, configSet: CONFIG.DEBUG_LEVELS.INFO });
});
// #endregion




// #region Command Handler
bot.on('interactionCreate', async (interaction) => {
    if (!interaction?.isChatInputCommand()) return;

    const { commandName } = interaction;
    var vars = {
        language: await GetAsync(interaction.user.id, "SETTING_LANGUAGE")
    };

    if (`${interaction.user.id}` !== ownerId) {
        if (!testers.includes(interaction.user.id)) {
            return interaction.reply({ content: config.messages.command_error_not_allowed });
        };
    };


    if (!interaction.deferred && !interaction.replied) {
        try {
            await interaction.deferReply();
        } catch (err) {
            if (err.code === DISCORD_ERRORS.UNKNOWN_INTERACTION || err.code === DISCORD_ERRORS.INTERACTION_ALREADY_ACKNOWLEDGED) {
                interaction.editReply({ content: get_locale_parsed(vars.language, "core-error-defer", { seconds: duration }), flags: 64 });
                console.log(`[Interaction Log] ${interaction.user.tag} interaction expired or was already handled.`);
                return;
            }

            console.error("Critical error during deferral:", err);
            return;
        }
    }


    const module = commandModules[commandName];
    var duration = has_cooldown_for(interaction, commandName);
    if (duration) return interaction.editReply({ content: get_locale_parsed(vars.language, "core-cooldown", { seconds: duration }), flags: 64 });

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Command timeout")), 10000)
        );

        await Promise.race([
            module.run(interaction, bot, vars),
            timeoutPromise
        ])

    } catch (err) {
        console.error(`Error executing command ${commandName}:`, err);

        await interaction.editReply({ content: get_locale_parsed(vars.language, "core-error-command") + err, flags: 64 });
    }
});
debug({ string: `Cmd Handler ready ${performance.now() - start} ms`, configSet: CONFIG.DEBUG_LEVELS.INFO });
// #endregion




// #region SETUP COMMANDS

const formatted = Object.values(commandModules).map(cmd => ({
    ...cmd.data,

    // Allow command usage in DMs and user installs
    // Note 11.2026 - I am too lazy to remove this so ill just make the bot installable via guild only.
    dm_permission: false,
    integration_types: [0, 1], // Guild install + User install
    contexts: [0, 1, 2]       // Guilds + Bot DMs + Group DMs
}));

restClient.put(
    Routes.applicationCommands(clientId),
    { body: formatted }
);
debug({ string: `Commands ready ${performance.now() - start} ms`, configSet: CONFIG.DEBUG_LEVELS.INFO });

// #endregion

bot.login(token);
var colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    yellow: '\x1b[93m',
    bold: '\x1b[1m'
};
console.log();
console.log('\x1b[37m╔═══════════════════════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[37m║\x1b[0m');
console.log('\x1b[37m║\x1b[32m  ██╗   ██╗██╗   ██╗███╗   ██╗ █████╗       ██████╗ ██████╗ ██████╗ ███████╗\x1b[0m');
console.log('\x1b[37m║\x1b[32m  ╚██╗ ██╔╝██║   ██║████╗  ██║██╔══██╗     ██╔════╝██╔═══██╗██╔══██╗██╔════╝\x1b[0m');
console.log('\x1b[37m║\x1b[32m   ╚████╔╝ ██║   ██║██╔██╗ ██║███████║     ██║     ██║   ██║██║  ██║█████╗  \x1b[0m');
console.log('\x1b[37m║\x1b[32m    ╚██╔╝  ██║   ██║██║╚██╗██║██╔══██║     ██║     ██║   ██║██║  ██║██╔══╝  \x1b[0m');
console.log('\x1b[37m║\x1b[32m     ██║   ╚██████╔╝██║ ╚████║██║  ██║     ╚██████╗╚██████╔╝██████╔╝███████╗\x1b[0m');
console.log('\x1b[37m║\x1b[32m     ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝      ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝\x1b[0m');
console.log('\x1b[37m║\x1b[0m');
console.log('\x1b[37m╠═══════════════════════════════════════════════════════════════════════════════╣\x1b[0m');
console.log(`\x1b[37m║\x1b[31m  Developed and maintained by Yuna2077\x1b[0m`);
console.log(`\x1b[37m║\x1b[36m  Time taken: ${performance.now() - start} ms\x1b[0m`);
console.log('\x1b[37m╚═══════════════════════════════════════════════════════════════════════════════╝\x1b[0m');
console.log();
module.exports = { bot };