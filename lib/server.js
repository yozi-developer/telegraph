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
     * @param {string} host
     * @param {number} port
     * @param {Object} options see WsTgServer Options at https://github.com/socketio/engine.io#methods-1
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
    close() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform server stop');
            _this2.eioServer.close();
            yield new Promise(function (resolve, reject) {
                _this2.httpServer.close(function () {
                    debug('WsTgServer stopped, all connections closed');
                    resolve();
                });
            });
        })();
    }
}
exports.WsTgServer = WsTgServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxNQUFNLFFBQVEsb0JBQVUscUJBQVYsQ0FBUjs7Ozs7QUFLTixNQUFNLGlCQUFOLENBQXdCOzs7Ozs7O0FBT3BCLGdCQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBNEIsU0FBNUIsRUFBdUMsSUFBdkMsRUFBNkM7QUFDekMsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUR5QztBQUV6QyxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRnlDO0FBR3pDLGFBQUssU0FBTCxHQUFpQixTQUFqQixDQUh5QztBQUl6QyxhQUFLLElBQUwsR0FBWSxJQUFaLENBSnlDO0tBQTdDOzs7Ozs7QUFQb0IsWUFrQnBCLENBQVMsSUFBVCxFQUFlO0FBQ1gsY0FBTSxVQUFVO0FBQ1osZ0JBQUksS0FBSyxTQUFMO0FBQ0osb0JBQVEsS0FBSyxNQUFMO0FBQ1Isb0JBQVEsSUFBUjtTQUhFLENBREs7QUFNWCxhQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBakIsRUFOVztLQUFmO0NBbEJKOzs7O0FBOEJPLE1BQU0sVUFBTixDQUFpQjs7Ozs7OztBQU9wQixXQUFhLE1BQWIsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBOEM7OztZQUFkLGdFQUFVLGtCQUFJOztBQUMxQyxrQkFBTSxtQkFBTjtBQUNBLG9CQUFRLFVBQVIsR0FBcUIsUUFBUSxVQUFSLElBQXNCLENBQUMsV0FBRCxDQUF0QjtBQUNyQixrQkFBTSxhQUFhLGVBQUssWUFBTCxDQUFrQixVQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CO0FBQ3JELG9CQUFJLFNBQUosQ0FBYyxHQUFkLEVBRHFEO0FBRXJELG9CQUFJLEdBQUosQ0FBUSxpQkFBUixFQUZxRDthQUFwQixDQUEvQjs7QUFLTixrQkFBTSxZQUFZLElBQUksaUJBQVUsTUFB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UUFBTSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgRWlvU2VydmVyIGZyb20gJ2VuZ2luZS5pbyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmNvbnN0IGRlYnVnID0gbmV3IERlYnVnKCd3cy10ZWxlZ3JhcGg6c2VydmVyJyk7XG5cbi8qKlxuICogUmVwcmVzZW50IGluY29taW5nIFJQQy1yZXF1ZXN0XG4gKi9cbmNsYXNzIFdzVGdTZXJ2ZXJSZXF1ZXN0IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY2xpZW50IHNvY2tldFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBycGMtbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHJlcXVlc3RJZFxuICAgICAqIEBwYXJhbSB7W119IGFyZ3NcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQsIG1ldGhvZCwgcmVxdWVzdElkLCBhcmdzKSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZCByZXNwb25zZVxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YVxuICAgICAqL1xuICAgIHJlc3BvbnNlKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLnJlcXVlc3RJZCxcbiAgICAgICAgICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgICAgICAgICByZXN1bHQ6IGRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgfVxufVxuLyoqXG4gKiBUZWxlZ3JhcGgtc2VydmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBXc1RnU2VydmVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgd3Mtc2VydmVyIHdpdGggcHJvdmlkZWQgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgc2VlIFdzVGdTZXJ2ZXIgT3B0aW9ucyBhdCBodHRwczovL2dpdGh1Yi5jb20vc29ja2V0aW8vZW5naW5lLmlvI21ldGhvZHMtMVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUoaG9zdCwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGRlYnVnKCd0cnkgY3JlYXRlIHNlcnZlcicpO1xuICAgICAgICBvcHRpb25zLnRyYW5zcG9ydHMgPSBvcHRpb25zLnRyYW5zcG9ydHMgfHwgWyd3ZWJzb2NrZXQnXTtcbiAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDEpO1xuICAgICAgICAgICAgcmVzLmVuZCgnTm90IEltcGxlbWVudGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGVpb1NlcnZlciA9IG5ldyBFaW9TZXJ2ZXIuU2VydmVyKG9wdGlvbnMpO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuXG4gICAgICAgICAgICBodHRwU2VydmVyLmxpc3Rlbih7aG9zdCwgcG9ydH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgU2VydmVyIHN0YXJ0ZWQgc3VjY2Vzc2Z1bGx5IGF0ICR7aG9zdH06JHtwb3J0fWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGh0dHBTZXJ2ZXIub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYW5cXCd0IHN0YXJ0IGh0dHBTZXJ2ZXIgZHVlIGVycm9yJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGh0dHBTZXJ2ZXIsIGVpb1NlcnZlcik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoaHR0cFNlcnZlciwgZWlvU2VydmVyKSB7XG4gICAgICAgIGVpb1NlcnZlci5hdHRhY2goaHR0cFNlcnZlcik7XG5cbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIgPSBlaW9TZXJ2ZXI7XG4gICAgICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICAgICAgdGhpcy5laW9TZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KT0+IHtcbiAgICAgICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcywgc29ja2V0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBcIm1lc3NhZ2VcIiBldmVudCBhbmQgY2FsbCBoYW5kbGVyIGlmIGl0IGV4aXN0XG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNvbm5lY3Rpb24gd2l0aCBjbGllbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3wqfSBkYXRhIC0gZGF0YSBpbiBqc29uIGZvcm1hdFxuICAgICAqL1xuICAgIG9uTWVzc2FnZShzb2NrZXQsIGRhdGEpIHtcbiAgICAgICAgbGV0IGVycm9yT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1lc3NhZ2VJZCwgbWVzc2FnZU1ldGhvZCwgbWVzc2FnZUFyZ3M7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIG1lc3NhZ2VJZCA9IHBhcnNlZERhdGEuaWQ7XG4gICAgICAgICAgICBtZXNzYWdlTWV0aG9kID0gcGFyc2VkRGF0YS5tZXRob2Q7XG4gICAgICAgICAgICBtZXNzYWdlQXJncyA9IHBhcnNlZERhdGEuYXJncyB8fCBbXTtcbiAgICAgICAgICAgIGlmICghbWVzc2FnZUlkIHx8ICFtZXNzYWdlTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yT2NjdXJyZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKHtcbiAgICAgICAgICAgICAgICBldmVudDogJ1dyb25nIGRhdGEgcmVjZWl2ZWQuIERhdGEgbXVzdCBiZSBpbiBqc29uIGZvcm1hdCBhbmQgaGF2ZSBpZCBhbmQgbWV0aG9kIGZpZWxkcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFdzVGdTZXJ2ZXJSZXF1ZXN0KHNvY2tldCwgbWVzc2FnZU1ldGhvZCwgbWVzc2FnZUlkLCBtZXNzYWdlQXJncyk7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJOYW1lID0gYG9uJHttZXNzYWdlTWV0aG9kLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7bWVzc2FnZU1ldGhvZC5zbGljZSgxKX1gO1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpc1toYW5kbGVyTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlcihyZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlIGFsbCBjb25uZWN0aW9ucyBhbmQgZnJlZXMgcG9ydFxuICAgICAqL1xuICAgIGFzeW5jIGNsb3NlKCkge1xuICAgICAgICBkZWJ1ZygnUGVyZm9ybSBzZXJ2ZXIgc3RvcCcpO1xuICAgICAgICB0aGlzLmVpb1NlcnZlci5jbG9zZSgpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cFNlcnZlci5jbG9zZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnV3NUZ1NlcnZlciBzdG9wcGVkLCBhbGwgY29ubmVjdGlvbnMgY2xvc2VkJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==