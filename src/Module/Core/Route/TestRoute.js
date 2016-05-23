'use strict';

const AbstractRoute = require('../../../AbstractRoute');

class TestRoute extends AbstractRoute {
    static get method() {
        return 'GET';
    }

    static get path() {
        return '/test';
    }
    
    static handler(request, reply) {
        reply("Hi");
    }  
}

module.exports = TestRoute;