/**
 * Cooldown.js
 * 
 * Version: 2026.10.2
 * Creator: @Yuna2077
 */

var cooldowns = new Map();
var cleaner = {
    count: 0,
    max_map_age: 600000, // Any map older then 600 seconds will be deleted.
    clean_maps_after: 20 // If counter reaches 20 it will clean all cooldowns if they are older then set setting
}

var internal = {
    get_map: function(interaction) {
        let map = cooldowns.get(interaction.user.id);
        if (map) {
            map.last_date = Date.now() + cleaner.max_map_age;
            return map;
        };

        map = {
            last_date: Date.now() + cleaner.max_map_age,
            cooldowns: {}
        };
        cooldowns.set(interaction.user.id, map);
        return map.cooldowns;
    },
    clean_expired(map, now) {
        if (Object.keys(map).length > 0) return;
        for (var [key, expires] of Object.entries(map)) {
            if (expires <= now) {
                delete map[key];
            };
        };
        cleaner.count++;
        if (cleaner.count >= cleaner.clean_maps_after) {
            cleaner.count = 0;
            for (var [key, data] of cooldowns.entries) {
                if (data.last_date <= now) cooldowns.delete(key);
            };
        };
        return;
    }
};

/**
 * Checks if an interaction has any cooldown.
 * @param {Interaction} interaction
 * @returns {Boolean}
 */
function has_cooldown(interaction) {
    var now = Date.now();
    let map = internal.get_map(interaction);
    internal.clean_expired(map, now);
    if (Object.keys(map).length > 0) { return true } else { return false };
};

/**
 * Check if an interaction has a cooldownn with the given key.
 * @param {Interaction} interaction 
 * @param {String} key 
 * @returns {Boolean/Number}
 */
function has_cooldown_for(interaction, key) {
    var now = Date.now();
    let map = internal.get_map(interaction);
    internal.clean_expired(map, now);

    var expiration_date = map[key];
    if (expiration_date && expiration_date > now) {
        return Math.round((now - expiration_date) / 1000);
    } else { return false };
};

/**
 * Set the cooldown duration for an interaction.
 * @param {Interaction} interaction 
 * @param {String} key 
 * @param {Number} duration 
 */
function set_cooldown_for(interaction, key, duration) {
    var now = Date.now()
    let map = internal.get_map(interaction);
    internal.clean_expired(map, now);
    map[key] = now + (duration * 1000);
};

/**
 * Remove one cooldown for an interaction.
 * @param {Interaction} interaction
 * @param {String} key
 */
function remove_cooldown_for(interaction, key) {
    let map = internal.get_map(interaction);
    if (map[key]) delete map[key];
};

/**
 * Remove all current cooldowns for an interaction.
 * @param {Interaction} interaction 
 */
function remove_cooldowns(interaction) {
    cooldowns.delete(interaction.user.id);
};

module.exports = {
    has_cooldown,
    has_cooldown_for,

    set_cooldown_for,

    remove_cooldown_for,
    remove_cooldowns
};