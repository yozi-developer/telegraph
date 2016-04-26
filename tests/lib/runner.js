'use strict';
/*
 global before: true, describe: true, it: true
 */

require('source-map-support/register');

var _client = require('./client');

var _server = require('./server');

describe('WsTgClient', function () {
    before(function () {
        const self = this;
    });

    (0, _client.runClientTests)();
});

describe('WsTgServer', function () {
    before(function () {
        const self = this;
    });

    (0, _server.runServerTests)();
});
//# sourceMappingURL=runner.js.map