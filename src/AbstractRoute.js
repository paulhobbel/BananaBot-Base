'use strict';

class AbstractRoute {
    constructor() {
        if (this.constructor === AbstractRoute) {
            throw new Error('Cannot instantiate AbstractRoute!');
        }
    }

    get method() {
        throw new Error('method is not extended, this should either be GET or POST');
    }

    get path() {
        throw new Error('path is not extended');
    }
    
    handler() {
        throw Error("Routes must override the handle function!");
    }  
}

module.exports = AbstractRoute;