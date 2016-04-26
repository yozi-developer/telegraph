'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WsTgClient = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonRpc = require('json-rpc2');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = new _debug2.default('ws-telegraph:client');

/**
 * WsTgClient for Telegraph-server
 */
class WsTgClient {
    constructor() {
        debug('try create client');
    }

    /**
     * @param {string} host
     * @param {number} port
      */
    start(host, port) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Client call start');
            _this.apiClient = _jsonRpc.Client.$create(port, host);
            debug({ apiClient: _this.apiClient });
            _this.apiConn = yield new Promise(function (resolve, reject) {

                _this.apiClient.connectWebsocket(function (err, conn) {
                    debug({ err: err, conn: conn });
                    if (err) {
                        return reject(err);
                    }
                    if (!conn) {
                        return reject(new Error('Client connection don\'t opened'));
                    }
                    return resolve(conn);
                });
            });
            _this.apiConn.conn.on('error', function () {});
        })();
    }

    stop() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Client call stop');
            _this2.apiConn.conn.close();
        })();
    }

    /**
     * Perform RPC and wait result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     * @return {*}
     */
    call(method) {
        var _this3 = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'WsTgClient call', method: method, args: args });
            return yield new Promise(function (resolve, reject) {
                _this3.apiConn.call(method, args, function (err, result) {
                    if (err) {
                        if (!(err instanceof Error)) {
                            err = new Error(err);
                        }
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        })();
    }
}
exports.WsTgClient = WsTgClient;
//# sourceMappingURL=client.js.map