'use strict';

class ArrayHelper {
    reverse(array) {
        let tmp = [];
        for (let i = array.length-1; i >= 0; i--) {
            tmp.push(array[i]);
        }
        return tmp;
    }
}

module.exports = ArrayHelper;