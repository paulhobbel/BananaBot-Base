'use strict';

class RegexHelper {
    getMatches(content, regex, callback) {
        let matches = regex.exec(content);

        if (matches === null) {
            return false;
        }

        callback(matches);
    }
}

module.exports = RegexHelper;