// index.js

// Main modules
var result = require('dotenv').config();
//const Testers = process.env.TESTER?.split(',') || [];
//const Developers = process.env.DEVELOPER?.split(',') || [];

var DISCORD_ERRORS = {
    UNKNOWN_INTERACTION: 10062,
    INTERACTION_ALREADY_ACKNOWLEDGED: 40060
};

var { get_locale_parsed } = require("./Core/Localization");
var { initDB } = require("./DataStorage/Datastore");
var loadModules = require('./Utilities/LoadCommandsModules');

initDB();
var commandModules = loadModules('./src/Commands');

var token = process.env.BOT_TOKEN;
var clientId = process.env.BOT_CLIENT_ID;
var ownerId = process.env.OWNER_ID;

const { Client, GatewayIntentBits, Options } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const restClient = new REST({ version: '10' }).setToken(token);
const config = require('./config');

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
});
// #endregion




// #region Command Handler
bot.on('interactionCreate', async (interaction) => {
    if (!interaction?.isChatInputCommand()) return;

    const { commandName, user, guild } = interaction;

    if (`${interaction.user.id}` !== ownerId) {
        return interaction.reply({ content: config.messages.command_error_not_allowed });
    };

    // ========================
    // Defer
    // ========================
    if (!interaction.deferred && !interaction.replied) {
        try {
            await interaction.deferReply();
        } catch (err) {
            if (err.code === DISCORD_ERRORS.UNKNOWN_INTERACTION || err.code === DISCORD_ERRORS.INTERACTION_ALREADY_ACKNOWLEDGED) {
                console.log(`[Interaction Log] ${interaction.user.tag} interaction expired or was already handled.`);
                return;
            }

            // Log other serious errors (API down, etc.)
            console.error("Critical error during deferral:", err);
            return;
        }
    }

    // ========================
    // Gather base variables
    // ========================
    const module = commandModules[commandName];

    if (!module) {
        return interaction.editReply({ content: config.messages.command_error_unable_to_use, flags: 64 });
    }

    // ========================
    // Command
    // ========================
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Command timeout")), 10000)
        );

        await Promise.race([
            module.run(interaction, bot, { language: "en" }),
            timeoutPromise
        ])

    } catch (err) {
        console.error(`Error executing command ${commandName}:`, err);

        await interaction.editReply(get_locale_parsed("en", "core-error-command")).catch(() => { });
    }
});
// #endregion




// #region SETUP COMMANDS

const formatted = Object.values(commandModules).map(cmd => ({
    ...cmd.data,

    // Allow command usage in DMs and user installs
    dm_permission: false,
    integration_types: [0, 1], // Guild install + User install
    contexts: [0, 1, 2]       // Guilds + Bot DMs + Group DMs
}));

restClient.put(
    Routes.applicationCommands(clientId),
    { body: formatted }
);

// #endregion

bot.login(token);
module.exports = { bot };