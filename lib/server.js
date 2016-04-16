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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

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
class Server extends _events2.default {
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
        super();
        eioServer.attach(httpServer);

        this.eioServer = eioServer;
        this.httpServer = httpServer;

        this.eioServer.on('connection', socket => {
            socket.on('message', this.onMessage.bind(this, socket));
        });
    }

    /**
     * Handle "message" event and rise events for all RPC
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

        const eventName = `${ messageMethod }`;

        const request = new TgRequest(socket, messageMethod, messageId, messageArgs);
        this.emit(eventName, request);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUNBLE1BQU0sUUFBUSxvQkFBVSxxQkFBVixDQUFSOzs7OztBQUtOLE1BQU0sU0FBTixDQUFnQjs7Ozs7OztBQU9aLGdCQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBNEIsU0FBNUIsRUFBdUMsSUFBdkMsRUFBNkM7QUFDekMsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUR5QztBQUV6QyxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRnlDO0FBR3pDLGFBQUssU0FBTCxHQUFpQixTQUFqQixDQUh5QztBQUl6QyxhQUFLLElBQUwsR0FBWSxJQUFaLENBSnlDO0tBQTdDOzs7Ozs7QUFQWSxZQWtCWixDQUFTLElBQVQsRUFBZTtBQUNYLGNBQU0sVUFBVTtBQUNaLGdCQUFJLEtBQUssU0FBTDtBQUNKLG9CQUFRLEtBQUssTUFBTDtBQUNSLG9CQUFRLElBQVI7U0FIRSxDQURLO0FBTVgsYUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQWpCLEVBTlc7S0FBZjtDQWxCSjs7OztBQThCTyxNQUFNLE1BQU4sMEJBQWtDOzs7Ozs7O0FBT3JDLFdBQWEsTUFBYixDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUE4Qzs7O1lBQWQsZ0VBQVUsa0JBQUk7O0FBQzFDLGtCQUFNLG1CQUFOO0FBQ0Esb0JBQVEsVUFBUixHQUFxQixRQUFRLFVBQVIsSUFBc0IsQ0FBQyxXQUFELENBQXRCO0FBQ3JCLGtCQUFNLGFBQWEsZUFBSyxZQUFMLENBQWtCLFVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0I7QUFDckQsb0JBQUksU0FBSixDQUFjLEdBQWQsRUFEcUQ7QUFFckQsb0JBQUksR0FBSixDQUFRLGlCQUFSLEVBRnFEO2FBQXBCLENBQS9COztBQUtOLGtCQUFNLFlBQVksSUFBSSxpQkFBVSxNQUFWLENBQWlCLE9BQXJCLENBQVo7O0FBRU4sa0JBQU0sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFvQjs7QUFFbEMsMkJBQVcsTUFBWCxDQUFrQixFQUFDLElBQUQsRUFBTyxJQUFQLEVBQWxCLEVBQWdDLFlBQVk7QUFDeEMsMEJBQU0sQ0FBQywrQkFBRCxHQUFrQyxJQUFsQyxFQUF1QyxDQUF2QyxHQUEwQyxJQUExQyxFQUErQyxDQUFyRCxFQUR3QztBQUV4QywyQkFBTyxTQUFQLENBRndDO2lCQUFaLENBQWhDLENBRmtDO0FBTWxDLDJCQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLFVBQUMsR0FBRCxFQUFTO0FBQzVCLDBCQUFNLG1DQUFOLEVBRDRCO0FBRTVCLDJCQUFPLE9BQU8sR0FBUCxDQUFQLENBRjRCO2lCQUFULENBQXZCLENBTmtDO2FBQXBCLENBQWxCOztBQWFBLG1CQUFPLFVBQVMsVUFBVCxFQUFxQixTQUFyQixDQUFQO2FBdkIwQztLQUE5Qzs7QUEwQkEsZ0JBQVksVUFBWixFQUF3QixTQUF4QixFQUFtQztBQUMvQixnQkFEK0I7QUFFL0Isa0JBQVUsTUFBVixDQUFpQixVQUFqQixFQUYrQjs7QUFJL0IsYUFBSyxTQUFMLEdBQWlCLFNBQWpCLENBSitCO0FBSy9CLGFBQUssVUFBTCxHQUFrQixVQUFsQixDQUwrQjs7QUFPL0IsYUFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixZQUFsQixFQUFnQyxVQUFXO0FBQ3ZDLG1CQUFPLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEIsTUFBMUIsQ0FBckIsRUFEdUM7U0FBWCxDQUFoQyxDQVArQjtLQUFuQzs7Ozs7OztBQWpDcUMsYUFrRHJDLENBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QjtBQUNwQixZQUFJLGdCQUFnQixLQUFoQixDQURnQjtBQUVwQixZQUFJLFNBQUosRUFBZSxhQUFmLEVBQThCLFdBQTlCLENBRm9CO0FBR3BCLFlBQUk7QUFDQSxrQkFBTSxhQUFhLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBYixDQUROO0FBRUEsd0JBQVksV0FBVyxFQUFYLENBRlo7QUFHQSw0QkFBZ0IsV0FBVyxNQUFYLENBSGhCO0FBSUEsMEJBQWMsV0FBVyxJQUFYLElBQW1CLEVBQW5CLENBSmQ7QUFLQSxnQkFBSSxDQUFDLFNBQUQsSUFBYyxDQUFDLGFBQUQsRUFBZ0I7QUFDOUIsZ0NBQWdCLElBQWhCLENBRDhCO2FBQWxDO1NBTEosQ0FRRSxPQUFPLEdBQVAsRUFBWTtBQUNWLDRCQUFnQixJQUFoQixDQURVO1NBQVo7QUFHRixZQUFJLGFBQUosRUFBbUI7QUFDZixrQkFBTTtBQUNGLHVCQUFPLGdGQUFQO0FBQ0Esc0JBQU0sSUFBTjthQUZKLEVBRGU7QUFLZixtQkFMZTtTQUFuQjs7QUFRQSxjQUFNLFlBQVksQ0FBQyxHQUFFLGFBQUgsRUFBaUIsQ0FBN0IsQ0F0QmM7O0FBd0JwQixjQUFNLFVBQVUsSUFBSSxTQUFKLENBQWMsTUFBZCxFQUFzQixhQUF0QixFQUFxQyxTQUFyQyxFQUFnRCxXQUFoRCxDQUFWLENBeEJjO0FBeUJwQixhQUFLLElBQUwsQ0FBVSxTQUFWLEVBQXFCLE9BQXJCLEVBekJvQjtLQUF4Qjs7Ozs7QUFsRHFDLFNBaUZyQyxHQUFjOzs7O0FBQ1Ysa0JBQU0scUJBQU47QUFDQSxtQkFBSyxTQUFMLENBQWUsS0FBZjtBQUNBLGtCQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBb0I7QUFDbEMsdUJBQUssVUFBTCxDQUFnQixLQUFoQixDQUFzQixZQUFLO0FBQ3ZCLDBCQUFNLHdDQUFOLEVBRHVCO0FBRXZCLDhCQUZ1QjtpQkFBTCxDQUF0QixDQURrQzthQUFwQixDQUFsQjthQUhVO0tBQWQ7Q0FqRkc7UUFBTSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgRWlvU2VydmVyIGZyb20gJ2VuZ2luZS5pbyc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmNvbnN0IGRlYnVnID0gbmV3IERlYnVnKCd3cy10ZWxlZ3JhcGg6c2VydmVyJyk7XG5cbi8qKlxuICogUmVwcmVzZW50IGluY29taW5nIFJQQy1yZXF1ZXN0XG4gKi9cbmNsYXNzIFRnUmVxdWVzdCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNsaWVudCBzb2NrZXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gcnBjLW1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSByZXF1ZXN0SWRcbiAgICAgKiBAcGFyYW0ge1tdfSBhcmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc29ja2V0LCBtZXRob2QsIHJlcXVlc3RJZCwgYXJncykge1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMucmVxdWVzdElkID0gcmVxdWVzdElkO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgcmVzcG9uc2VcbiAgICAgKiBAcGFyYW0geyp9IGRhdGFcbiAgICAgKi9cbiAgICByZXNwb25zZShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5yZXF1ZXN0SWQsXG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgICAgICAgICAgcmVzdWx0OiBkYXRhXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgIH1cbn1cbi8qKlxuICogVGVsZWdyYXBoLXNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgU2VydmVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgd3Mtc2VydmVyIHdpdGggcHJvdmlkZWQgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgc2VlIFNlcnZlciBPcHRpb25zIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9zb2NrZXRpby9lbmdpbmUuaW8jbWV0aG9kcy0xXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShob3N0LCBwb3J0LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgZGVidWcoJ3RyeSBjcmVhdGUgc2VydmVyJyk7XG4gICAgICAgIG9wdGlvbnMudHJhbnNwb3J0cyA9IG9wdGlvbnMudHJhbnNwb3J0cyB8fCBbJ3dlYnNvY2tldCddO1xuICAgICAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMSk7XG4gICAgICAgICAgICByZXMuZW5kKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZWlvU2VydmVyID0gbmV3IEVpb1NlcnZlci5TZXJ2ZXIob3B0aW9ucyk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG5cbiAgICAgICAgICAgIGh0dHBTZXJ2ZXIubGlzdGVuKHtob3N0LCBwb3J0fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKGBTZXJ2ZXIgc3RhcnRlZCBzdWNjZXNzZnVsbHkgYXQgJHtob3N0fToke3BvcnR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaHR0cFNlcnZlci5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhblxcJ3Qgc3RhcnQgaHR0cFNlcnZlciBkdWUgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoaHR0cFNlcnZlciwgZWlvU2VydmVyKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihodHRwU2VydmVyLCBlaW9TZXJ2ZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgZWlvU2VydmVyLmF0dGFjaChodHRwU2VydmVyKTtcblxuICAgICAgICB0aGlzLmVpb1NlcnZlciA9IGVpb1NlcnZlcjtcbiAgICAgICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlcjtcblxuICAgICAgICB0aGlzLmVpb1NlcnZlci5vbignY29ubmVjdGlvbicsIChzb2NrZXQpPT4ge1xuICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzLCBzb2NrZXQpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIFwibWVzc2FnZVwiIGV2ZW50IGFuZCByaXNlIGV2ZW50cyBmb3IgYWxsIFJQQ1xuICAgICAqIEBwYXJhbSBzb2NrZXQgLSBjb25uZWN0aW9uIHdpdGggY2xpZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd8Kn0gZGF0YSAtIGRhdGEgaW4ganNvbiBmb3JtYXRcbiAgICAgKi9cbiAgICBvbk1lc3NhZ2Uoc29ja2V0LCBkYXRhKSB7XG4gICAgICAgIGxldCBlcnJvck9jY3VycmVkID0gZmFsc2U7XG4gICAgICAgIGxldCBtZXNzYWdlSWQsIG1lc3NhZ2VNZXRob2QsIG1lc3NhZ2VBcmdzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICBtZXNzYWdlSWQgPSBwYXJzZWREYXRhLmlkO1xuICAgICAgICAgICAgbWVzc2FnZU1ldGhvZCA9IHBhcnNlZERhdGEubWV0aG9kO1xuICAgICAgICAgICAgbWVzc2FnZUFyZ3MgPSBwYXJzZWREYXRhLmFyZ3MgfHwgW107XG4gICAgICAgICAgICBpZiAoIW1lc3NhZ2VJZCB8fCAhbWVzc2FnZU1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGVycm9yT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvck9jY3VycmVkKSB7XG4gICAgICAgICAgICBkZWJ1Zyh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdXcm9uZyBkYXRhIHJlY2VpdmVkLiBEYXRhIG11c3QgYmUgaW4ganNvbiBmb3JtYXQgYW5kIGhhdmUgaWQgYW5kIG1ldGhvZCBmaWVsZHMnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYCR7bWVzc2FnZU1ldGhvZH1gO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgVGdSZXF1ZXN0KHNvY2tldCwgbWVzc2FnZU1ldGhvZCwgbWVzc2FnZUlkLCBtZXNzYWdlQXJncyk7XG4gICAgICAgIHRoaXMuZW1pdChldmVudE5hbWUsIHJlcXVlc3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlIGFsbCBjb25uZWN0aW9ucyBhbmQgZnJlZXMgcG9ydFxuICAgICAqL1xuICAgIGFzeW5jIGNsb3NlKCkge1xuICAgICAgICBkZWJ1ZygnUGVyZm9ybSBzZXJ2ZXIgc3RvcCcpO1xuICAgICAgICB0aGlzLmVpb1NlcnZlci5jbG9zZSgpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cFNlcnZlci5jbG9zZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnU2VydmVyIHN0b3BwZWQsIGFsbCBjb25uZWN0aW9ucyBjbG9zZWQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19