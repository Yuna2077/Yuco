module.exports = {
    COMMANDS_PER_MINUTE: 10, // limits how many commands the user can send till timeout
    MAX_MEMORY_USAGE: 1024, // limits how much MB RAM the bot is allowed to use

    DEBUG_MEMORY: false,
    DEVELOPER_MODE: true,
    DEVELOPER_SERVER: 1515740577533136937,

    DEVELOPER_NORMAL_PREFIX: "!bot",
    DEVELOPER_DEV_PREFIX: "!dev",

    BOT_STATUS: {
        BOT: {
            SHOW_VERSION: true,
            STATUS: "online", // online, offline, idle, dnd
            NAME: "Summer ☀️ ",
            TYPE: "Playing"
        },
        DEV: {
            SHOW_VERSION: false,
            STATUS: "dnd",
            NAME: "Developing...",
            TYPE: "Playing"
        }
    },
    THEME: "default" // default, halloween
}