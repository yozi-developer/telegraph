'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WsTgServer = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _jsonRpc = require('json-rpc2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = new _debug2.default('ws-telegraph:server');

/**
 * Telegraph-server
 */
class WsTgServer {
    /**
     * Create ws-server with provided settings
     * @see: Server from https://www.npmjs.com/package/json-rpc2
     */
    constructor() {
        debug('try create server');
        this.apiServer = _jsonRpc.Server.$create({
            'websocket': true,
            'headers': { // allow custom headers is empty by default
                'Access-Control-Allow-Origin': '*'
            }

        });
    }

    /**
     * Start server on port
     * @param {string} host
     * @param {number} port
     */
    start(host, port) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this.httpServer = _this.apiServer.listen(port, host);
        })();
    }

    /**
     * Close all connections and frees port
     */
    stop() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform server stop');
            yield new Promise(function (resolve, reject) {
                _this2.httpServer.close(function () {
                    debug('WsTgServer stopped, all connections closed');
                    delete _this2.httpServer;
                    resolve();
                });
            });
        })();
    }

    /**
     * Expose method
     * @param {String} methodName
     * @param {Function} methodCallback
     */
    expose(methodName, methodCallback) {
        this.apiServer.expose(methodName, function (args, conn, callback) {
            methodCallback(...args).then(result => {
                callback(null, result);
            }).catch(err => {
                if (!(err instanceof Error)) {
                    err = new Error(err);
                }
                callback(err, null);
            });
        });
    }
}
exports.WsTgServer = WsTgServer;
//# sourceMappingURL=server.js.map