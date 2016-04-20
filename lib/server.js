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
        let messageId, messageCall, messageArgs;
        try {
            const parsedData = JSON.parse(data);
            messageId = parsedData.id;
            messageCall = parsedData.call;
            messageArgs = parsedData.args || [];
            if (!messageId || !messageCall) {
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

        const handlerName = `on${ messageCall.charAt(0).toUpperCase() }${ messageCall.slice(1) }`;
        /**
         * Handler for method
         * @callback WsTgServer~methodHandler
         * @param {...*} messageArgs
         * @return {Promise}
         */
        const handler = this[handlerName];
        if (typeof handler === 'function') {
            handler(...messageArgs).then(result => {
                const responsePayload = {
                    id: messageId,
                    result: result
                };
                socket.send(JSON.stringify(responsePayload));
            }).catch(err => {
                debug({ event: 'Error in the method handler', err: err });
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxNQUFNLFFBQVEsb0JBQVUscUJBQVYsQ0FBUjs7Ozs7QUFLQyxNQUFNLFVBQU4sQ0FBaUI7Ozs7O0FBTXBCLGtCQUEwQjtZQUFkLGdFQUFVLGtCQUFJOztBQUN0QixjQUFNLG1CQUFOLEVBRHNCO0FBRXRCLGFBQUssT0FBTCxHQUFlLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsT0FBbEIsQ0FBZixDQUZzQjtBQUd0QixnQkFBUSxVQUFSLEdBQXFCLEtBQUssT0FBTCxDQUFhLFVBQWIsSUFBMkIsQ0FBQyxXQUFELENBQTNCLENBSEM7S0FBMUI7Ozs7Ozs7QUFOb0IsU0FpQnBCLENBQVksSUFBWixFQUFrQixJQUFsQixFQUF3Qjs7OztBQUNwQixrQkFBTSxhQUFhLGVBQUssWUFBTCxDQUFrQixVQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CO0FBQ3JELG9CQUFJLFNBQUosQ0FBYyxHQUFkLEVBRHFEO0FBRXJELG9CQUFJLEdBQUosQ0FBUSxpQkFBUixFQUZxRDthQUFwQixDQUEvQjtBQUlOLGtCQUFNLFlBQVksSUFBSSxpQkFBVSxNQUFWLENBQWlCLE1BQUssT0FBTCxDQUFqQztBQUNOLGtCQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBb0I7QUFDbEMsMkJBQVcsTUFBWCxDQUFrQixFQUFDLElBQUQsRUFBTyxJQUFQLEVBQWxCLEVBQWdDLFlBQVk7QUFDeEMsMEJBQU0sQ0FBQywrQkFBRCxHQUFrQyxJQUFsQyxFQUF1QyxDQUF2QyxHQUEwQyxJQUExQyxFQUErQyxDQUFyRCxFQUR3QztBQUV4QywyQkFBTyxTQUFQLENBRndDO2lCQUFaLENBQWhDLENBRGtDO0FBS2xDLDJCQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLFVBQUMsR0FBRCxFQUFTO0FBQzVCLDBCQUFNLG1DQUFOLEVBRDRCO0FBRTVCLDJCQUFPLE9BQU8sR0FBUCxDQUFQLENBRjRCO2lCQUFULENBQXZCLENBTGtDO2FBQXBCLENBQWxCO0FBVUEsc0JBQVUsTUFBVixDQUFpQixVQUFqQjtBQUNBLHNCQUFVLEVBQVYsQ0FBYSxZQUFiLEVBQTJCLFVBQUMsTUFBRCxFQUFXO0FBQ2xDLHVCQUFPLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLE1BQUssU0FBTCxDQUFlLElBQWYsUUFBMEIsTUFBMUIsQ0FBckIsRUFEa0M7YUFBWCxDQUEzQjs7QUFJQSxrQkFBSyxVQUFMLEdBQWtCLFVBQWxCO0FBQ0Esa0JBQUssU0FBTCxHQUFpQixTQUFqQjthQXRCb0I7S0FBeEI7Ozs7Ozs7QUFqQm9CLGFBK0NwQixDQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0I7QUFDcEIsWUFBSSxnQkFBZ0IsS0FBaEIsQ0FEZ0I7QUFFcEIsWUFBSSxTQUFKLEVBQWUsV0FBZixFQUE0QixXQUE1QixDQUZvQjtBQUdwQixZQUFJO0FBQ0Esa0JBQU0sYUFBYSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWIsQ0FETjtBQUVBLHdCQUFZLFdBQVcsRUFBWCxDQUZaO0FBR0EsMEJBQWMsV0FBVyxJQUFYLENBSGQ7QUFJQSwwQkFBYyxXQUFXLElBQVgsSUFBbUIsRUFBbkIsQ0FKZDtBQUtBLGdCQUFJLENBQUMsU0FBRCxJQUFjLENBQUMsV0FBRCxFQUFjO0FBQzVCLGdDQUFnQixJQUFoQixDQUQ0QjthQUFoQztTQUxKLENBUUUsT0FBTyxHQUFQLEVBQVk7QUFDViw0QkFBZ0IsSUFBaEIsQ0FEVTtTQUFaO0FBR0YsWUFBSSxhQUFKLEVBQW1CO0FBQ2Ysa0JBQU07QUFDRix1QkFBTyxnRkFBUDtBQUNBLHNCQUFNLElBQU47YUFGSixFQURlO0FBS2YsbUJBTGU7U0FBbkI7O0FBUUEsY0FBTSxjQUFjLENBQUMsRUFBRCxHQUFLLFlBQVksTUFBWixDQUFtQixDQUFuQixFQUFzQixXQUF0QixFQUFMLEVBQXlDLEdBQUUsWUFBWSxLQUFaLENBQWtCLENBQWxCLENBQTNDLEVBQWdFLENBQTlFOzs7Ozs7O0FBdEJjLGNBNkJkLFVBQVUsS0FBSyxXQUFMLENBQVYsQ0E3QmM7QUE4QnBCLFlBQUksT0FBTyxPQUFQLEtBQW1CLFVBQW5CLEVBQStCO0FBQy9CLG9CQUFRLEdBQUcsV0FBSCxDQUFSLENBQ0ssSUFETCxDQUNVLFVBQVc7QUFDYixzQkFBTSxrQkFBa0I7QUFDcEIsd0JBQUksU0FBSjtBQUNBLDRCQUFRLE1BQVI7aUJBRkUsQ0FETztBQUtiLHVCQUFPLElBQVAsQ0FBWSxLQUFLLFNBQUwsQ0FBZSxlQUFmLENBQVosRUFMYTthQUFYLENBRFYsQ0FRSyxLQVJMLENBUVcsT0FBTztBQUNWLHNCQUFNLEVBQUMsT0FBTyw2QkFBUCxFQUFzQyxLQUFLLEdBQUwsRUFBN0MsRUFEVTthQUFQLENBUlgsQ0FEK0I7U0FBbkM7S0E5Qko7Ozs7O0FBL0NvQixRQStGcEIsR0FBYTs7OztBQUNULGtCQUFNLHFCQUFOO0FBQ0EsbUJBQUssU0FBTCxDQUFlLEtBQWY7QUFDQSxtQkFBTyxPQUFLLFNBQUw7QUFDUCxrQkFBTSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQW9CO0FBQ2xDLHVCQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsQ0FBc0IsWUFBSztBQUN2QiwwQkFBTSw0Q0FBTixFQUR1QjtBQUV2QiwyQkFBTyxPQUFLLFVBQUwsQ0FGZ0I7QUFHdkIsOEJBSHVCO2lCQUFMLENBQXRCLENBRGtDO2FBQXBCLENBQWxCO2FBSlM7S0FBYjtDQS9GRztRQUFNIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBFaW9TZXJ2ZXIgZnJvbSAnZW5naW5lLmlvJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuY29uc3QgZGVidWcgPSBuZXcgRGVidWcoJ3dzLXRlbGVncmFwaDpzZXJ2ZXInKTtcblxuLyoqXG4gKiBUZWxlZ3JhcGgtc2VydmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBXc1RnU2VydmVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgd3Mtc2VydmVyIHdpdGggcHJvdmlkZWQgc2V0dGluZ3NcblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHNlZSBTZXJ2ZXIgT3B0aW9ucyBhdCBodHRwczovL2dpdGh1Yi5jb20vc29ja2V0aW8vZW5naW5lLmlvI21ldGhvZHMtMVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBkZWJ1ZygndHJ5IGNyZWF0ZSBzZXJ2ZXInKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMudHJhbnNwb3J0cyA9IHRoaXMub3B0aW9ucy50cmFuc3BvcnRzIHx8IFsnd2Vic29ja2V0J107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgc2VydmVyIG9uIHBvcnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3J0XG4gICAgICovXG4gICAgYXN5bmMgc3RhcnQoaG9zdCwgcG9ydCkge1xuICAgICAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMSk7XG4gICAgICAgICAgICByZXMuZW5kKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGVpb1NlcnZlciA9IG5ldyBFaW9TZXJ2ZXIuU2VydmVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgaHR0cFNlcnZlci5saXN0ZW4oe2hvc3QsIHBvcnR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoYFNlcnZlciBzdGFydGVkIHN1Y2Nlc3NmdWxseSBhdCAke2hvc3R9OiR7cG9ydH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodHRwU2VydmVyLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FuXFwndCBzdGFydCBodHRwU2VydmVyIGR1ZSBlcnJvcicpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZWlvU2VydmVyLmF0dGFjaChodHRwU2VydmVyKTtcbiAgICAgICAgZWlvU2VydmVyLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCk9PiB7XG4gICAgICAgICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMsIHNvY2tldCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyO1xuICAgICAgICB0aGlzLmVpb1NlcnZlciA9IGVpb1NlcnZlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgXCJtZXNzYWdlXCIgZXZlbnQgYW5kIGNhbGwgaGFuZGxlciBpZiBpdCBleGlzdFxuICAgICAqIEBwYXJhbSBzb2NrZXQgLSBjb25uZWN0aW9uIHdpdGggY2xpZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd8Kn0gZGF0YSAtIGRhdGEgaW4ganNvbiBmb3JtYXRcbiAgICAgKi9cbiAgICBvbk1lc3NhZ2Uoc29ja2V0LCBkYXRhKSB7XG4gICAgICAgIGxldCBlcnJvck9jY3VycmVkID0gZmFsc2U7XG4gICAgICAgIGxldCBtZXNzYWdlSWQsIG1lc3NhZ2VDYWxsLCBtZXNzYWdlQXJncztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgbWVzc2FnZUlkID0gcGFyc2VkRGF0YS5pZDtcbiAgICAgICAgICAgIG1lc3NhZ2VDYWxsID0gcGFyc2VkRGF0YS5jYWxsO1xuICAgICAgICAgICAgbWVzc2FnZUFyZ3MgPSBwYXJzZWREYXRhLmFyZ3MgfHwgW107XG4gICAgICAgICAgICBpZiAoIW1lc3NhZ2VJZCB8fCAhbWVzc2FnZUNhbGwpIHtcbiAgICAgICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JPY2N1cnJlZCkge1xuICAgICAgICAgICAgZGVidWcoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiAnV3JvbmcgZGF0YSByZWNlaXZlZC4gRGF0YSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGFuZCBtZXRob2QgZmllbGRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhbmRsZXJOYW1lID0gYG9uJHttZXNzYWdlQ2FsbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke21lc3NhZ2VDYWxsLnNsaWNlKDEpfWA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBtZXRob2RcbiAgICAgICAgICogQGNhbGxiYWNrIFdzVGdTZXJ2ZXJ+bWV0aG9kSGFuZGxlclxuICAgICAgICAgKiBAcGFyYW0gey4uLip9IG1lc3NhZ2VBcmdzXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpc1toYW5kbGVyTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlciguLi5tZXNzYWdlQXJncylcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VQYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlUGF5bG9hZCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpPT57XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKHtldmVudDogJ0Vycm9yIGluIHRoZSBtZXRob2QgaGFuZGxlcicsIGVycjogZXJyfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSBhbGwgY29ubmVjdGlvbnMgYW5kIGZyZWVzIHBvcnRcbiAgICAgKi9cbiAgICBhc3luYyBzdG9wKCkge1xuICAgICAgICBkZWJ1ZygnUGVyZm9ybSBzZXJ2ZXIgc3RvcCcpO1xuICAgICAgICB0aGlzLmVpb1NlcnZlci5jbG9zZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5laW9TZXJ2ZXI7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwU2VydmVyLmNsb3NlKCgpPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdXc1RnU2VydmVyIHN0b3BwZWQsIGFsbCBjb25uZWN0aW9ucyBjbG9zZWQnKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5odHRwU2VydmVyO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=