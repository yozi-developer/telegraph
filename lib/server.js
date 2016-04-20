'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WsTgServer = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('source-map-support/register');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _engine = require('engine.io');

var _engine2 = _interopRequireDefault(_engine);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = new _debug2.default('ws-telegraph:server');

/**
 * Represent incoming RPC-request
 */
class WsTgServerRequest {
    /**
     * @param socket - client socket
     * @param {string} method - rpc-method name
     * @param {string|number} requestId
     * @param {[]} args
     */
    constructor(socket, method, requestId, args) {
        this.socket = socket;
        this.method = method;
        this.requestId = requestId;
        this.args = args;
    }

    /**
     * Send response
     * @param {*} data
     */
    response(data) {
        const payload = {
            id: this.requestId,
            method: this.method,
            result: data
        };
        this.socket.send(JSON.stringify(payload));
    }
}
/**
 * Telegraph-server
 */
class WsTgServer {
    /**
     * Create ws-server with provided settings
      * @param {Object} options see Server Options at https://github.com/socketio/engine.io#methods-1
     */
    constructor() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        debug('try create server');
        this.options = Object.assign({}, options);
        options.transports = this.options.transports || ['websocket'];
    }

    /**
     * Start server on port
     * @param {string} host
     * @param {number} port
     */
    start(host, port) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const httpServer = _http2.default.createServer(function (req, res) {
                res.writeHead(501);
                res.end('Not Implemented');
            });
            const eioServer = new _engine2.default.Server(_this.options);
            yield new Promise(function (resolve, reject) {
                httpServer.listen({ host, port }, function () {
                    debug(`Server started successfully at ${ host }:${ port }`);
                    return resolve();
                });
                httpServer.on('error', function (err) {
                    debug('Can\'t start httpServer due error');
                    return reject(err);
                });
            });
            eioServer.attach(httpServer);
            eioServer.on('connection', function (socket) {
                socket.on('message', _this.onMessage.bind(_this, socket));
            });

            _this.httpServer = httpServer;
            _this.eioServer = eioServer;
        })();
    }

    /**
     * Handle "message" event and call handler if it exist
     * @param socket - connection with client
     * @param {string|*} data - data in json format
     */
    onMessage(socket, data) {
        let errorOccurred = false;
        let messageId, messageMethod, messageArgs;
        try {
            const parsedData = JSON.parse(data);
            messageId = parsedData.id;
            messageMethod = parsedData.method;
            messageArgs = parsedData.args || [];
            if (!messageId || !messageMethod) {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong data received. Data must be in json format and have id and method fields',
                data: data
            });
            return;
        }

        const request = new WsTgServerRequest(socket, messageMethod, messageId, messageArgs);
        const handlerName = `on${ messageMethod.charAt(0).toUpperCase() }${ messageMethod.slice(1) }`;
        const handler = this[handlerName];
        if (typeof handler === 'function') {
            handler(request);
        }
    }

    /**
     * Close all connections and frees port
     */
    stop() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform server stop');
            _this2.eioServer.close();
            delete _this2.eioServer;
            yield new Promise(function (resolve, reject) {
                _this2.httpServer.close(function () {
                    debug('WsTgServer stopped, all connections closed');
                    delete _this2.httpServer;
                    resolve();
                });
            });
        })();
    }
}
exports.WsTgServer = WsTgServer;
//# sourceMappingURL=data:application/json;base64,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Q0FEa0M7YUFBcEIsQ0FBbEI7YUFKUztLQUFiO0NBaEZHO1FBQU0iLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IEVpb1NlcnZlciBmcm9tICdlbmdpbmUuaW8nO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5jb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zygnd3MtdGVsZWdyYXBoOnNlcnZlcicpO1xuXG4vKipcbiAqIFJlcHJlc2VudCBpbmNvbWluZyBSUEMtcmVxdWVzdFxuICovXG5jbGFzcyBXc1RnU2VydmVyUmVxdWVzdCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNsaWVudCBzb2NrZXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gcnBjLW1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSByZXF1ZXN0SWRcbiAgICAgKiBAcGFyYW0ge1tdfSBhcmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc29ja2V0LCBtZXRob2QsIHJlcXVlc3RJZCwgYXJncykge1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMucmVxdWVzdElkID0gcmVxdWVzdElkO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgcmVzcG9uc2VcbiAgICAgKiBAcGFyYW0geyp9IGRhdGFcbiAgICAgKi9cbiAgICByZXNwb25zZShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5yZXF1ZXN0SWQsXG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgICAgICAgICAgcmVzdWx0OiBkYXRhXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgIH1cbn1cbi8qKlxuICogVGVsZWdyYXBoLXNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgV3NUZ1NlcnZlciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHdzLXNlcnZlciB3aXRoIHByb3ZpZGVkIHNldHRpbmdzXG5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBzZWUgU2VydmVyIE9wdGlvbnMgYXQgaHR0cHM6Ly9naXRodWIuY29tL3NvY2tldGlvL2VuZ2luZS5pbyNtZXRob2RzLTFcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgZGVidWcoJ3RyeSBjcmVhdGUgc2VydmVyJyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLnRyYW5zcG9ydHMgPSB0aGlzLm9wdGlvbnMudHJhbnNwb3J0cyB8fCBbJ3dlYnNvY2tldCddO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHNlcnZlciBvbiBwb3J0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydFxuICAgICAqL1xuICAgIGFzeW5jIHN0YXJ0KGhvc3QsIHBvcnQpIHtcbiAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDEpO1xuICAgICAgICAgICAgcmVzLmVuZCgnTm90IEltcGxlbWVudGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBlaW9TZXJ2ZXIgPSBuZXcgRWlvU2VydmVyLlNlcnZlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIGh0dHBTZXJ2ZXIubGlzdGVuKHtob3N0LCBwb3J0fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKGBTZXJ2ZXIgc3RhcnRlZCBzdWNjZXNzZnVsbHkgYXQgJHtob3N0fToke3BvcnR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaHR0cFNlcnZlci5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhblxcJ3Qgc3RhcnQgaHR0cFNlcnZlciBkdWUgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVpb1NlcnZlci5hdHRhY2goaHR0cFNlcnZlcik7XG4gICAgICAgIGVpb1NlcnZlci5vbignY29ubmVjdGlvbicsIChzb2NrZXQpPT4ge1xuICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzLCBzb2NrZXQpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlcjtcbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIgPSBlaW9TZXJ2ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIFwibWVzc2FnZVwiIGV2ZW50IGFuZCBjYWxsIGhhbmRsZXIgaWYgaXQgZXhpc3RcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY29ubmVjdGlvbiB3aXRoIGNsaWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfCp9IGRhdGEgLSBkYXRhIGluIGpzb24gZm9ybWF0XG4gICAgICovXG4gICAgb25NZXNzYWdlKHNvY2tldCwgZGF0YSkge1xuICAgICAgICBsZXQgZXJyb3JPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgbWVzc2FnZUlkLCBtZXNzYWdlTWV0aG9kLCBtZXNzYWdlQXJncztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgbWVzc2FnZUlkID0gcGFyc2VkRGF0YS5pZDtcbiAgICAgICAgICAgIG1lc3NhZ2VNZXRob2QgPSBwYXJzZWREYXRhLm1ldGhvZDtcbiAgICAgICAgICAgIG1lc3NhZ2VBcmdzID0gcGFyc2VkRGF0YS5hcmdzIHx8IFtdO1xuICAgICAgICAgICAgaWYgKCFtZXNzYWdlSWQgfHwgIW1lc3NhZ2VNZXRob2QpIHtcbiAgICAgICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JPY2N1cnJlZCkge1xuICAgICAgICAgICAgZGVidWcoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiAnV3JvbmcgZGF0YSByZWNlaXZlZC4gRGF0YSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGFuZCBtZXRob2QgZmllbGRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgV3NUZ1NlcnZlclJlcXVlc3Qoc29ja2V0LCBtZXNzYWdlTWV0aG9kLCBtZXNzYWdlSWQsIG1lc3NhZ2VBcmdzKTtcbiAgICAgICAgY29uc3QgaGFuZGxlck5hbWUgPSBgb24ke21lc3NhZ2VNZXRob2QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHttZXNzYWdlTWV0aG9kLnNsaWNlKDEpfWA7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzW2hhbmRsZXJOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBoYW5kbGVyKHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgYWxsIGNvbm5lY3Rpb25zIGFuZCBmcmVlcyBwb3J0XG4gICAgICovXG4gICAgYXN5bmMgc3RvcCgpIHtcbiAgICAgICAgZGVidWcoJ1BlcmZvcm0gc2VydmVyIHN0b3AnKTtcbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWlvU2VydmVyO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cFNlcnZlci5jbG9zZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnV3NUZ1NlcnZlciBzdG9wcGVkLCBhbGwgY29ubmVjdGlvbnMgY2xvc2VkJyk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuaHR0cFNlcnZlcjtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19