(() => {
    'use strict';

    /* globals Story */

    const SETTINGS_PASSAGE = "inventory.strings";
    const DEFAULT_SEPARATOR = ":";

    function splitLines (text) {
        return text
            .replace(/\r+/g, '\n')
            .replace(/\n+/, '\n')
            .replace(/ +/g, ' ')
            .trim()
            .split(/\n/g);
    }

    function breakPairs (line) {
        return line.trim().split(DEFAULT_SEPARATOR);
    }

    function parseText (text) {
        const lines = splitLines(text);
        const ret = {};
        lines.forEach(l => {
            if (l && l.trim() && l.includes(DEFAULT_SEPARATOR)) {
                const pair = breakPairs(l);
                ret[pair[0].trim()] = pair[1].trim();
            }
        });
        return ret;
    }

    function parseSourcePassage (psg) {
        try {
            if (!Story.has(psg)) {
                return {};
            }
            const settings = parseText(Story.get(psg).text);
            return settings;
        } catch (err) {
            console.error(err.message, err);
            return {};
        }
    }

    // parse source passage and set strings
    const userSettings = parseSourcePassage(SETTINGS_PASSAGE);
    if (userSettings.empty && typeof userSettings.empty === "string" && userSettings.empty.trim()) {
        setup.Inventory.emptyMessage = userSettings.empty;
        delete userSettings.empty;
    }
    setup.Inventory.strings = userSettings || {};

})();