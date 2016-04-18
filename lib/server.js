'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = undefined;

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
class TgRequest {
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
class Server {
    /**
     * Create ws-server with provided settings
     * @param {string} host
     * @param {number} port
     * @param {Object} options see Server Options at https://github.com/socketio/engine.io#methods-1
     */
    static create(host, port) {
        var _this = this;

        let options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        return (0, _asyncToGenerator3.default)(function* () {
            debug('try create server');
            options.transports = options.transports || ['websocket'];
            const httpServer = _http2.default.createServer(function (req, res) {
                res.writeHead(501);
                res.end('Not Implemented');
            });

            const eioServer = new _engine2.default.Server(options);

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

            return new _this(httpServer, eioServer);
        })();
    }

    constructor(httpServer, eioServer) {
        eioServer.attach(httpServer);

        this.eioServer = eioServer;
        this.httpServer = httpServer;

        this.eioServer.on('connection', socket => {
            socket.on('message', this.onMessage.bind(this, socket));
        });
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

        const request = new TgRequest(socket, messageMethod, messageId, messageArgs);
        const handlerName = `on${ messageMethod.charAt(0).toUpperCase() }${ messageMethod.slice(1) }`;
        const handler = this[handlerName];
        if (typeof handler === 'function') {
            handler(request);
        }
    }

    /**
     * Close all connections and frees port
     */
    close() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform server stop');
            _this2.eioServer.close();
            yield new Promise(function (resolve, reject) {
                _this2.httpServer.close(function () {
                    debug('Server stopped, all connections closed');
                    resolve();
                });
            });
        })();
    }
}
exports.Server = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxNQUFNLFFBQVEsb0JBQVUscUJBQVYsQ0FBUjs7Ozs7QUFLTixNQUFNLFNBQU4sQ0FBZ0I7Ozs7Ozs7QUFPWixnQkFBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLEVBQXVDLElBQXZDLEVBQTZDO0FBQ3pDLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FEeUM7QUFFekMsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUZ5QztBQUd6QyxhQUFLLFNBQUwsR0FBaUIsU0FBakIsQ0FIeUM7QUFJekMsYUFBSyxJQUFMLEdBQVksSUFBWixDQUp5QztLQUE3Qzs7Ozs7O0FBUFksWUFrQlosQ0FBUyxJQUFULEVBQWU7QUFDWCxjQUFNLFVBQVU7QUFDWixnQkFBSSxLQUFLLFNBQUw7QUFDSixvQkFBUSxLQUFLLE1BQUw7QUFDUixvQkFBUSxJQUFSO1NBSEUsQ0FESztBQU1YLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsS0FBSyxTQUFMLENBQWUsT0FBZixDQUFqQixFQU5XO0tBQWY7Q0FsQko7Ozs7QUE4Qk8sTUFBTSxNQUFOLENBQWE7Ozs7Ozs7QUFPaEIsV0FBYSxNQUFiLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQThDOzs7WUFBZCxnRUFBVSxrQkFBSTs7QUFDMUMsa0JBQU0sbUJBQU47QUFDQSxvQkFBUSxVQUFSLEdBQXFCLFFBQVEsVUFBUixJQUFzQixDQUFDLFdBQUQsQ0FBdEI7QUFDckIsa0JBQU0sYUFBYSxlQUFLLFlBQUwsQ0FBa0IsVUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQjtBQUNyRCxvQkFBSSxTQUFKLENBQWMsR0FBZCxFQURxRDtBQUVyRCxvQkFBSSxHQUFKLENBQVEsaUJBQVIsRUFGcUQ7YUFBcEIsQ0FBL0I7O0FBS04sa0JBQU0sWUFBWSxJQUFJLGlCQUFVLE1BQVYsQ0FB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aWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IEVpb1NlcnZlciBmcm9tICdlbmdpbmUuaW8nO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5jb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zygnd3MtdGVsZWdyYXBoOnNlcnZlcicpO1xuXG4vKipcbiAqIFJlcHJlc2VudCBpbmNvbWluZyBSUEMtcmVxdWVzdFxuICovXG5jbGFzcyBUZ1JlcXVlc3Qge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBzb2NrZXQgLSBjbGllbnQgc29ja2V0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIHJwYy1tZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gcmVxdWVzdElkXG4gICAgICogQHBhcmFtIHtbXX0gYXJnc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNvY2tldCwgbWV0aG9kLCByZXF1ZXN0SWQsIGFyZ3MpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICB0aGlzLnJlcXVlc3RJZCA9IHJlcXVlc3RJZDtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHJlc3BvbnNlXG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICovXG4gICAgcmVzcG9uc2UoZGF0YSkge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgICAgaWQ6IHRoaXMucmVxdWVzdElkLFxuICAgICAgICAgICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICAgICAgICAgIHJlc3VsdDogZGF0YVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICB9XG59XG4vKipcbiAqIFRlbGVncmFwaC1zZXJ2ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFNlcnZlciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHdzLXNlcnZlciB3aXRoIHByb3ZpZGVkIHNldHRpbmdzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHNlZSBTZXJ2ZXIgT3B0aW9ucyBhdCBodHRwczovL2dpdGh1Yi5jb20vc29ja2V0aW8vZW5naW5lLmlvI21ldGhvZHMtMVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUoaG9zdCwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGRlYnVnKCd0cnkgY3JlYXRlIHNlcnZlcicpO1xuICAgICAgICBvcHRpb25zLnRyYW5zcG9ydHMgPSBvcHRpb25zLnRyYW5zcG9ydHMgfHwgWyd3ZWJzb2NrZXQnXTtcbiAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDEpO1xuICAgICAgICAgICAgcmVzLmVuZCgnTm90IEltcGxlbWVudGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGVpb1NlcnZlciA9IG5ldyBFaW9TZXJ2ZXIuU2VydmVyKG9wdGlvbnMpO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuXG4gICAgICAgICAgICBodHRwU2VydmVyLmxpc3Rlbih7aG9zdCwgcG9ydH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgU2VydmVyIHN0YXJ0ZWQgc3VjY2Vzc2Z1bGx5IGF0ICR7aG9zdH06JHtwb3J0fWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGh0dHBTZXJ2ZXIub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYW5cXCd0IHN0YXJ0IGh0dHBTZXJ2ZXIgZHVlIGVycm9yJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGh0dHBTZXJ2ZXIsIGVpb1NlcnZlcik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoaHR0cFNlcnZlciwgZWlvU2VydmVyKSB7XG4gICAgICAgIGVpb1NlcnZlci5hdHRhY2goaHR0cFNlcnZlcik7XG5cbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIgPSBlaW9TZXJ2ZXI7XG4gICAgICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KT0+IHtcbiAgICAgICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcywgc29ja2V0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBcIm1lc3NhZ2VcIiBldmVudCBhbmQgY2FsbCBoYW5kbGVyIGlmIGl0IGV4aXN0XG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNvbm5lY3Rpb24gd2l0aCBjbGllbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3wqfSBkYXRhIC0gZGF0YSBpbiBqc29uIGZvcm1hdFxuICAgICAqL1xuICAgIG9uTWVzc2FnZShzb2NrZXQsIGRhdGEpIHtcbiAgICAgICAgbGV0IGVycm9yT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1lc3NhZ2VJZCwgbWVzc2FnZU1ldGhvZCwgbWVzc2FnZUFyZ3M7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIG1lc3NhZ2VJZCA9IHBhcnNlZERhdGEuaWQ7XG4gICAgICAgICAgICBtZXNzYWdlTWV0aG9kID0gcGFyc2VkRGF0YS5tZXRob2Q7XG4gICAgICAgICAgICBtZXNzYWdlQXJncyA9IHBhcnNlZERhdGEuYXJncyB8fCBbXTtcbiAgICAgICAgICAgIGlmICghbWVzc2FnZUlkIHx8ICFtZXNzYWdlTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yT2NjdXJyZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKHtcbiAgICAgICAgICAgICAgICBldmVudDogJ1dyb25nIGRhdGEgcmVjZWl2ZWQuIERhdGEgbXVzdCBiZSBpbiBqc29uIGZvcm1hdCBhbmQgaGF2ZSBpZCBhbmQgbWV0aG9kIGZpZWxkcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFRnUmVxdWVzdChzb2NrZXQsIG1lc3NhZ2VNZXRob2QsIG1lc3NhZ2VJZCwgbWVzc2FnZUFyZ3MpO1xuICAgICAgICBjb25zdCBoYW5kbGVyTmFtZSA9IGBvbiR7bWVzc2FnZU1ldGhvZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke21lc3NhZ2VNZXRob2Quc2xpY2UoMSl9YDtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXNbaGFuZGxlck5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGhhbmRsZXIocmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSBhbGwgY29ubmVjdGlvbnMgYW5kIGZyZWVzIHBvcnRcbiAgICAgKi9cbiAgICBhc3luYyBjbG9zZSgpIHtcbiAgICAgICAgZGVidWcoJ1BlcmZvcm0gc2VydmVyIHN0b3AnKTtcbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmh0dHBTZXJ2ZXIuY2xvc2UoKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ1NlcnZlciBzdG9wcGVkLCBhbGwgY29ubmVjdGlvbnMgY2xvc2VkJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==