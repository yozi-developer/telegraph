'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true, 
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.runTests = runTests;

var _client = require('../../../lib/client');

var _server = require('../../../lib/server');

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || 3000;

function runTests() {
    describe('RPC', function () {
        before(function () {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this.server = new _server.WsTgServer();
                yield _this.server.start('localhost', port);
                _this.client = new _client.WsTgClient();
                yield _this.client.start('localhost', port);
            })();
        });
        after(function () {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                yield _this2.client.stop();
                yield _this2.server.stop();
            })();
        });
        it('Can call RPC', function () {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this3.server.expose('hello', (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        return 'world';
                    });

                    function onHello() {
                        return ref.apply(this, arguments);
                    }

                    return onHello;
                })());
                const result = yield _this3.client.call('hello');
                (0, _should2.default)(result).equal('world');
            })();
        });

        it('Can call RPC with positional arguments', function () {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this4.server.expose('hello2', (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* (name) {
                        return `Hello, ${ name }`;
                    });

                    function onHello2(_x) {
                        return ref.apply(this, arguments);
                    }

                    return onHello2;
                })());
                const result = yield _this4.client.call('hello2', 'Yozi');

                (0, _should2.default)(result).be.equal('Hello, Yozi');
            })();
        });

        it('Throw error for undefined method', function () {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                let errorRaised = false;
                yield _this5.client.call('undefined').catch(function () {
                    errorRaised = true;
                });
                (0, _should2.default)(errorRaised).be.true();
            })();
        });

        it('Throw error for broken method', function () {
            var _this6 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                let error = null;
                _this6.server.expose('broken', (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        throw new Error('I am broken');
                    });

                    function onBroken() {
                        return ref.apply(this, arguments);
                    }

                    return onBroken;
                })());
                yield _this6.client.call('broken').catch(function (err) {
                    error = err;
                });
                (0, _should2.default)(error).be.instanceof(Error);
                (0, _should2.default)(error.message).be.equal('Error: I am broken');
            })();
        });
    });
}
//# sourceMappingURL=tests.js.map