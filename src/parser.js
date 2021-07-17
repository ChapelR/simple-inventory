(() => {
    'use strict';

    /* globals Story */

    const SETTINGS_PASSAGE = "inventory.config";

    function splitLines (text) {
        return text
            .replace(/\r/g, '\n')
            .replace(/\n+/, '\n')
            .replace(/ +/g, ' ')
            .trim()
            .split(/\n/g);
    }

    function breakPairs (line, sep) {
        sep = sep || ':';
        return line.trim().split(sep);
    }

    function parseText (text, sep) {
        const lines = splitLines(text);
        const ret = {};
        lines.forEach(l => {
            const pair = breakPairs(l, sep);
            ret[pair[0]] = pair[1];
        });
        return ret;
    }

    function parseSourcePassage (psg) {
        if (!Story.has(psg)) {
            return {};
        }
        return parseText(Story.get(psg).text);
    }

    // export

})();