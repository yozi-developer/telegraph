'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WsTgClient = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('source-map-support/register');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _engine = require('engine.io-client');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = new _debug2.default('ws-telegraph:client');

/**
 * Represent incoming RPC-response
 */
class WsTgClientResponse {
    /**
     * @param socket - client socket
     * @param {string} method - rpc-method name
     * @param {string|number} requestId
     * @param {*} result
     */
    constructor(socket, method, requestId, result) {
        this.socket = socket;
        this.method = method;
        this.requestId = requestId;
        this.result = result;
    }
}
/**
 * WsTgClient for Telegraph-server
 */
class WsTgClient {
    /**
     * Create connection to WS-server and instantiate client with it
     * @param {string} host
     * @param {number} port
     * @returns {WsTgClient}
     */
    static create(host, port) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('try create client');
            const url = `ws://${ host }:${ port }`;
            const eioClient = new _engine2.default(url, { transports: ['websocket'] });

            yield new Promise(function (resolve, reject) {
                eioClient.on('open', function () {
                    debug(`Connection successfully opened with url ${ url }`);
                    return resolve();
                });
                eioClient.on('error', function (err) {
                    debug('Can\'t open connection due error');
                    return reject(err);
                });
            });

            return new _this(eioClient);
        })();
    }

    /**
     *
     * @param eioClient
     * @param {Object} [options] - options for request
     * @param {number} [options.timeout=100] - ms
     */
    constructor(eioClient) {
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.eioClient = eioClient;
        this.options = options;
        this.options.timeout = options.timeout || 100;
        this.callId = 0;

        this.eioClient.on('message', this.onMessage.bind(this, eioClient));
    }

    /**
     * Generate new id for mark call
     * If id too big,  resets it to 1 again
     * @returns {number}
     */
    generateId() {
        if (this.callId > 1000000) {
            this.callId = 0;
        }
        const newId = ++this.callId;
        debug(`Generated id: ${ newId }`);
        return newId;
    }

    /**
     * Perform RPC and wait result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     * @return {*}
     */
    callWithResult(method) {
        var _this2 = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'WsTgClient callWithResult', method: method, args: args });
            const requestId = _this2.generateId();

            const request = JSON.stringify({
                id: requestId,
                method: method,
                args: args
            });
            yield new Promise(function (resolve) {
                _this2.eioClient.send(request, {}, function () {
                    debug('Call sent');
                    return resolve();
                });
            });

            let listener; // ref to listener for possible removeListener
            const result = yield new Promise(function (resolve) {
                const timeoutException = setTimeout(function () {
                    debug('CallWithResult response timeout');
                    resolve(new Error('WsTgClientResponse timeout'));
                }, _this2.options.timeout);

                /**
                 * @param {WsTgClientResponse} response
                 * @returns {*}
                 */
                listener = function (response) {
                    if (response.requestId === requestId) {
                        debug('WsTgClientResponse received');
                        clearTimeout(timeoutException);
                        return resolve(response.result);
                    }
                };

                _this2.eioClient.on('rpc_response', listener);
            });

            _this2.eioClient.removeListener('rpc_response', listener);
            if (result instanceof Error) {
                throw result;
            } else {
                return result;
            }
        })();
    }

    /**
     * Perform RPC without getting result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     */
    call(method) {
        var _this3 = this;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'WsTgClient call', method: method, args: args });
            const requestId = _this3.generateId();

            const request = JSON.stringify({
                id: requestId,
                method: method,
                args: args
            });
            yield new Promise(function (resolve) {
                _this3.eioClient.send(request, {}, function () {
                    debug('Call sent');
                    return resolve();
                });
            });
        })();
    }

    /**
     * Handle response "message"
     * @param socket - connection with server
     * @param {string|*} data - data in json format
     */
    onMessage(socket, data) {
        debug({ event: 'receive message', data: data });
        let errorOccurred = false;
        let requestId, requestMethod, responseResult;
        try {
            const parsedData = JSON.parse(data);
            requestId = parsedData.id;
            requestMethod = parsedData.method;
            responseResult = parsedData.result;
            if (!requestId || !responseResult) {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong response received. WsTgClientResponse must be in json format and have id and result fields',
                data: data
            });
            return;
        }

        const eventName = 'rpc_response';

        const response = new WsTgClientResponse(socket, requestMethod, requestId, responseResult);
        debug('emit rpc_response event');
        this.eioClient.emit(eventName, response);
    }

    /**
     * Close connection with server
     * @note: async for consistency with the server.close
     */
    close() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform close connection');

            _this4.eioClient.close();
        })();
    }
}
exports.WsTgClient = WsTgClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsTUFBTSxRQUFRLG9CQUFVLHFCQUFWLENBQVI7Ozs7O0FBS04sTUFBTSxrQkFBTixDQUF5Qjs7Ozs7OztBQU9yQixnQkFBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLEVBQXVDLE1BQXZDLEVBQStDO0FBQzNDLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FEMkM7QUFFM0MsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUYyQztBQUczQyxhQUFLLFNBQUwsR0FBaUIsU0FBakIsQ0FIMkM7QUFJM0MsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUoyQztLQUEvQztDQVBKOzs7O0FBaUJPLE1BQU0sVUFBTixDQUFpQjs7Ozs7OztBQU9wQixXQUFhLE1BQWIsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0M7Ozs7QUFDNUIsa0JBQU0sbUJBQU47QUFDQSxrQkFBTSxNQUFNLENBQUMsS0FBRCxHQUFRLElBQVIsRUFBYSxDQUFiLEdBQWdCLElBQWhCLEVBQXFCLENBQTNCO0FBQ04sa0JBQU0sWUFBWSxxQkFBYyxHQUFkLEVBQW1CLEVBQUMsWUFBWSxDQUFDLFdBQUQsQ0FBWixFQUFwQixDQUFaOztBQUVOLGtCQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDbkMsMEJBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBTTtBQUN2QiwwQkFBTSxDQUFDLHdDQUFELEdBQTJDLEdBQTNDLEVBQStDLENBQXJELEVBRHVCO0FBRXZCLDJCQUFPLFNBQVAsQ0FGdUI7aUJBQU4sQ0FBckIsQ0FEbUM7QUFLbkMsMEJBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsVUFBQyxHQUFELEVBQVM7QUFDM0IsMEJBQU0sa0NBQU4sRUFEMkI7QUFFM0IsMkJBQU8sT0FBTyxHQUFQLENBQVAsQ0FGMkI7aUJBQVQsQ0FBdEIsQ0FMbUM7YUFBckIsQ0FBbEI7O0FBWUEsbUJBQU8sVUFBUyxTQUFULENBQVA7YUFqQjRCO0tBQWhDOzs7Ozs7OztBQVBvQixlQWlDcEIsQ0FBWSxTQUFaLEVBQXFDO1lBQWQsZ0VBQVUsa0JBQUk7O0FBQ2pDLGFBQUssU0FBTCxHQUFpQixTQUFqQixDQURpQztBQUVqQyxhQUFLLE9BQUwsR0FBZSxPQUFmLENBRmlDO0FBR2pDLGFBQUssT0FBTCxDQUFhLE9BQWIsR0FBdUIsUUFBUSxPQUFSLElBQW1CLEdBQW5CLENBSFU7QUFJakMsYUFBSyxNQUFMLEdBQWMsQ0FBZCxDQUppQzs7QUFNakMsYUFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixTQUFsQixFQUE2QixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLEVBQTBCLFNBQTFCLENBQTdCLEVBTmlDO0tBQXJDOzs7Ozs7O0FBakNvQixjQWdEcEIsR0FBYTtBQUNULFlBQUksS0FBSyxNQUFMLEdBQWMsT0FBZCxFQUF1QjtBQUN2QixpQkFBSyxNQUFMLEdBQWMsQ0FBZCxDQUR1QjtTQUEzQjtBQUdBLGNBQU0sUUFBUSxFQUFFLEtBQUssTUFBTCxDQUpQO0FBS1QsY0FBTSxDQUFDLGNBQUQsR0FBaUIsS0FBakIsRUFBdUIsQ0FBN0IsRUFMUztBQU1ULGVBQU8sS0FBUCxDQU5TO0tBQWI7Ozs7Ozs7O0FBaERvQixrQkErRHBCLENBQXFCLE1BQXJCLEVBQXNDOzs7MENBQU47O1NBQU07OztBQUNsQyxrQkFBTSxFQUFDLE9BQU8sMkJBQVAsRUFBb0MsUUFBUSxNQUFSLEVBQWdCLE1BQU0sSUFBTixFQUEzRDtBQUNBLGtCQUFNLFlBQVksT0FBSyxVQUFMLEVBQVo7O0FBRU4sa0JBQU0sVUFBVSxLQUFLLFNBQUwsQ0FBZTtBQUMzQixvQkFBSSxTQUFKO0FBQ0Esd0JBQVEsTUFBUjtBQUNBLHNCQUFNLElBQU47YUFIWSxDQUFWO0FBS04sa0JBQU0sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVk7QUFDMUIsdUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsT0FBcEIsRUFBNkIsRUFBN0IsRUFBaUMsWUFBSztBQUNsQywwQkFBTSxXQUFOLEVBRGtDO0FBRWxDLDJCQUFPLFNBQVAsQ0FGa0M7aUJBQUwsQ0FBakMsQ0FEMEI7YUFBWixDQUFsQjs7QUFPQSxnQkFBSSxRQUFKO0FBQ0Esa0JBQU0sU0FBUyxNQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFZO0FBQ3pDLHNCQUFNLG1CQUFtQixXQUFXLFlBQUs7QUFDckMsMEJBQU0saUNBQU4sRUFEcUM7QUFFckMsNEJBQVEsSUFBSSxLQUFKLENBQVUsNEJBQVYsQ0FBUixFQUZxQztpQkFBTCxFQUdqQyxPQUFLLE9BQUwsQ0FBYSxPQUFiLENBSEc7Ozs7OztBQURtQyx3QkFVekMsR0FBVyxVQUFDLFFBQUQsRUFBYTtBQUNwQix3QkFBSSxTQUFTLFNBQVQsS0FBdUIsU0FBdkIsRUFBa0M7QUFDbEMsOEJBQU0sNkJBQU4sRUFEa0M7QUFFbEMscUNBQWEsZ0JBQWIsRUFGa0M7QUFHbEMsK0JBQU8sUUFBUSxTQUFTLE1BQVQsQ0FBZixDQUhrQztxQkFBdEM7aUJBRE8sQ0FWOEI7O0FBa0J6Qyx1QkFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixjQUFsQixFQUFrQyxRQUFsQyxFQWxCeUM7YUFBWixDQUFsQjs7QUFxQmYsbUJBQUssU0FBTCxDQUFlLGNBQWYsQ0FBOEIsY0FBOUIsRUFBOEMsUUFBOUM7QUFDQSxnQkFBSSxrQkFBa0IsS0FBbEIsRUFBeUI7QUFDekIsc0JBQU0sTUFBTixDQUR5QjthQUE3QixNQUVPO0FBQ0gsdUJBQU8sTUFBUCxDQURHO2FBRlA7YUF2Q2tDO0tBQXRDOzs7Ozs7O0FBL0RvQixRQWtIcEIsQ0FBVyxNQUFYLEVBQTRCOzs7MkNBQU47O1NBQU07OztBQUN4QixrQkFBTSxFQUFDLE9BQU8saUJBQVAsRUFBMEIsUUFBUSxNQUFSLEVBQWdCLE1BQU0sSUFBTixFQUFqRDtBQUNBLGtCQUFNLFlBQVksT0FBSyxVQUFMLEVBQVo7O0FBRU4sa0JBQU0sVUFBVSxLQUFLLFNBQUwsQ0FBZTtBQUMzQixvQkFBSSxTQUFKO0FBQ0Esd0JBQVEsTUFBUjtBQUNBLHNCQUFNLElBQU47YUFIWSxDQUFWO0FBS04sa0JBQU0sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVk7QUFDMUIsdUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsT0FBcEIsRUFBNkIsRUFBN0IsRUFBaUMsWUFBSztBQUNsQywwQkFBTSxXQUFOLEVBRGtDO0FBRWxDLDJCQUFPLFNBQVAsQ0FGa0M7aUJBQUwsQ0FBakMsQ0FEMEI7YUFBWixDQUFsQjthQVR3QjtLQUE1Qjs7Ozs7OztBQWxIb0IsYUF3SXBCLENBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QjtBQUNwQixjQUFNLEVBQUMsT0FBTyxpQkFBUCxFQUEwQixNQUFNLElBQU4sRUFBakMsRUFEb0I7QUFFcEIsWUFBSSxnQkFBZ0IsS0FBaEIsQ0FGZ0I7QUFHcEIsWUFBSSxTQUFKLEVBQWUsYUFBZixFQUE4QixjQUE5QixDQUhvQjtBQUlwQixZQUFJO0FBQ0Esa0JBQU0sYUFBYSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWIsQ0FETjtBQUVBLHdCQUFZLFdBQVcsRUFBWCxDQUZaO0FBR0EsNEJBQWdCLFdBQVcsTUFBWCxDQUhoQjtBQUlBLDZCQUFpQixXQUFXLE1BQVgsQ0FKakI7QUFLQSxnQkFBSSxDQUFDLFNBQUQsSUFBYyxDQUFDLGNBQUQsRUFBaUI7QUFDL0IsZ0NBQWdCLElBQWhCLENBRCtCO2FBQW5DO1NBTEosQ0FRRSxPQUFPLEdBQVAsRUFBWTtBQUNWLDRCQUFnQixJQUFoQixDQURVO1NBQVo7QUFHRixZQUFJLGFBQUosRUFBbUI7QUFDZixrQkFBTTtBQUNGLHVCQUFPLGtHQUFQO0FBQ0Esc0JBQU0sSUFBTjthQUZKLEVBRGU7QUFLZixtQkFMZTtTQUFuQjs7QUFRQSxjQUFNLFlBQVksY0FBWixDQXZCYzs7QUF5QnBCLGNBQU0sV0FBVyxJQUFJLGtCQUFKLENBQXVCLE1BQXZCLEVBQStCLGFBQS9CLEVBQThDLFNBQTlDLEVBQXlELGNBQXpELENBQVgsQ0F6QmM7QUEwQnBCLGNBQU0seUJBQU4sRUExQm9CO0FBMkJwQixhQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLFNBQXBCLEVBQStCLFFBQS9CLEVBM0JvQjtLQUF4Qjs7Ozs7O0FBeElvQixTQTBLcEIsR0FBYzs7OztBQUNWLGtCQUFNLDBCQUFOOztBQUVBLG1CQUFLLFNBQUwsQ0FBZSxLQUFmO2FBSFU7S0FBZDtDQTFLRztRQUFNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBFaW9DbGllbnQgZnJvbSAnZW5naW5lLmlvLWNsaWVudCc7XG5jb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zygnd3MtdGVsZWdyYXBoOmNsaWVudCcpO1xuXG4vKipcbiAqIFJlcHJlc2VudCBpbmNvbWluZyBSUEMtcmVzcG9uc2VcbiAqL1xuY2xhc3MgV3NUZ0NsaWVudFJlc3BvbnNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY2xpZW50IHNvY2tldFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBycGMtbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHJlcXVlc3RJZFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzdWx0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc29ja2V0LCBtZXRob2QsIHJlcXVlc3RJZCwgcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbn1cbi8qKlxuICogV3NUZ0NsaWVudCBmb3IgVGVsZWdyYXBoLXNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgV3NUZ0NsaWVudCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGNvbm5lY3Rpb24gdG8gV1Mtc2VydmVyIGFuZCBpbnN0YW50aWF0ZSBjbGllbnQgd2l0aCBpdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvcnRcbiAgICAgKiBAcmV0dXJucyB7V3NUZ0NsaWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlKGhvc3QsIHBvcnQpIHtcbiAgICAgICAgZGVidWcoJ3RyeSBjcmVhdGUgY2xpZW50Jyk7XG4gICAgICAgIGNvbnN0IHVybCA9IGB3czovLyR7aG9zdH06JHtwb3J0fWA7XG4gICAgICAgIGNvbnN0IGVpb0NsaWVudCA9IG5ldyBFaW9DbGllbnQodXJsLCB7dHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXX0pO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGVpb0NsaWVudC5vbignb3BlbicsICgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgQ29ubmVjdGlvbiBzdWNjZXNzZnVsbHkgb3BlbmVkIHdpdGggdXJsICR7dXJsfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVpb0NsaWVudC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhblxcJ3Qgb3BlbiBjb25uZWN0aW9uIGR1ZSBlcnJvcicpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcyhlaW9DbGllbnQpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlaW9DbGllbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gb3B0aW9ucyBmb3IgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lb3V0PTEwMF0gLSBtc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVpb0NsaWVudCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuZWlvQ2xpZW50ID0gZWlvQ2xpZW50O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLm9wdGlvbnMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAxMDA7XG4gICAgICAgIHRoaXMuY2FsbElkID0gMDtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcywgZWlvQ2xpZW50KSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBuZXcgaWQgZm9yIG1hcmsgY2FsbFxuICAgICAqIElmIGlkIHRvbyBiaWcsICByZXNldHMgaXQgdG8gMSBhZ2FpblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2VuZXJhdGVJZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbElkID4gMTAwMDAwMCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsSWQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0lkID0gKyt0aGlzLmNhbGxJZDtcbiAgICAgICAgZGVidWcoYEdlbmVyYXRlZCBpZDogJHtuZXdJZH1gKTtcbiAgICAgICAgcmV0dXJuIG5ld0lkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gUlBDIGFuZCB3YWl0IHJlc3VsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7Li4ue319IFthcmdzXSAgYXJndW1lbnRzIGZvciByZW1vdGUgcHJvY2VkdXJlXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBjYWxsV2l0aFJlc3VsdChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAnV3NUZ0NsaWVudCBjYWxsV2l0aFJlc3VsdCcsIG1ldGhvZDogbWV0aG9kLCBhcmdzOiBhcmdzfSk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5zZW5kKHJlcXVlc3QsIHt9LCAoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbCBzZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbGlzdGVuZXI7IC8vIHJlZiB0byBsaXN0ZW5lciBmb3IgcG9zc2libGUgcmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZW91dEV4Y2VwdGlvbiA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGxXaXRoUmVzdWx0IHJlc3BvbnNlIHRpbWVvdXQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBFcnJvcignV3NUZ0NsaWVudFJlc3BvbnNlIHRpbWVvdXQnKSk7XG4gICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMudGltZW91dCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHBhcmFtIHtXc1RnQ2xpZW50UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdGVuZXIgPSAocmVzcG9uc2UpPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXF1ZXN0SWQgPT09IHJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygnV3NUZ0NsaWVudFJlc3BvbnNlIHJlY2VpdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0RXhjZXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzcG9uc2UucmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5vbigncnBjX3Jlc3BvbnNlJywgbGlzdGVuZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5yZW1vdmVMaXN0ZW5lcigncnBjX3Jlc3BvbnNlJywgbGlzdGVuZXIpO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIFJQQyB3aXRob3V0IGdldHRpbmcgcmVzdWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIG1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHsuLi57fX0gW2FyZ3NdICBhcmd1bWVudHMgZm9yIHJlbW90ZSBwcm9jZWR1cmVcbiAgICAgKi9cbiAgICBhc3luYyBjYWxsKG1ldGhvZCwgLi4uYXJncykge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdXc1RnQ2xpZW50IGNhbGwnLCBtZXRob2Q6IG1ldGhvZCwgYXJnczogYXJnc30pO1xuICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgdGhpcy5laW9DbGllbnQuc2VuZChyZXF1ZXN0LCB7fSwgKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGwgc2VudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHJlc3BvbnNlIFwibWVzc2FnZVwiXG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNvbm5lY3Rpb24gd2l0aCBzZXJ2ZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3wqfSBkYXRhIC0gZGF0YSBpbiBqc29uIGZvcm1hdFxuICAgICAqL1xuICAgIG9uTWVzc2FnZShzb2NrZXQsIGRhdGEpIHtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAncmVjZWl2ZSBtZXNzYWdlJywgZGF0YTogZGF0YX0pO1xuICAgICAgICBsZXQgZXJyb3JPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgcmVxdWVzdElkLCByZXF1ZXN0TWV0aG9kLCByZXNwb25zZVJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgcmVxdWVzdElkID0gcGFyc2VkRGF0YS5pZDtcbiAgICAgICAgICAgIHJlcXVlc3RNZXRob2QgPSBwYXJzZWREYXRhLm1ldGhvZDtcbiAgICAgICAgICAgIHJlc3BvbnNlUmVzdWx0ID0gcGFyc2VkRGF0YS5yZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RJZCB8fCAhcmVzcG9uc2VSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JPY2N1cnJlZCkge1xuICAgICAgICAgICAgZGVidWcoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiAnV3JvbmcgcmVzcG9uc2UgcmVjZWl2ZWQuIFdzVGdDbGllbnRSZXNwb25zZSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGFuZCByZXN1bHQgZmllbGRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9ICdycGNfcmVzcG9uc2UnO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gbmV3IFdzVGdDbGllbnRSZXNwb25zZShzb2NrZXQsIHJlcXVlc3RNZXRob2QsIHJlcXVlc3RJZCwgcmVzcG9uc2VSZXN1bHQpO1xuICAgICAgICBkZWJ1ZygnZW1pdCBycGNfcmVzcG9uc2UgZXZlbnQnKTtcbiAgICAgICAgdGhpcy5laW9DbGllbnQuZW1pdChldmVudE5hbWUsIHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSBjb25uZWN0aW9uIHdpdGggc2VydmVyXG4gICAgICogQG5vdGU6IGFzeW5jIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBzZXJ2ZXIuY2xvc2VcbiAgICAgKi9cbiAgICBhc3luYyBjbG9zZSgpIHtcbiAgICAgICAgZGVidWcoJ1BlcmZvcm0gY2xvc2UgY29ubmVjdGlvbicpO1xuXG4gICAgICAgIHRoaXMuZWlvQ2xpZW50LmNsb3NlKCk7XG4gICAgfVxufVxuXG4iXX0=