'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = undefined;

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
class TgResponse {
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
 * Client for Telegraph-server
 */
class Client {
    /**
     * Create connection to WS-server and instantiate client with it
     * @param {string} host
     * @param {number} port
     * @returns {Client}
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

    constructor(eioClient) {
        this.eioClient = eioClient;
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
     * @param {{timeout: number}} [options]
     * @param {{}} [args]  arguments for remote procedure
     * @return {*}
     */
    callWithResult(method) {
        var _this2 = this;

        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        let args = arguments[2];
        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'Client callWithResult', method: method, options: options, args: args });
            options.timeout = options.timeout || 50; // 50 ms
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
                    resolve(new Error('TgResponse timeout'));
                }, options.timeout);

                /**
                 * @param {TgResponse} response
                 * @returns {*}
                 */
                listener = function (response) {
                    if (response.requestId === requestId) {
                        debug('TgResponse received');
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
     * @param {{}} [args]  arguments for remote procedure
     */
    call(method, args) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'Client call', method: method, args: args });
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
                event: 'Wrong response received. TgResponse must be in json format and have id and result fields',
                data: data
            });
            return;
        }

        const eventName = 'rpc_response';

        const response = new TgResponse(socket, requestMethod, requestId, responseResult);
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
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,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b0IsU0FBcEIsRUFBK0IsUUFBL0IsRUEzQm9CO0tBQXhCOzs7Ozs7QUFsSWlCLFNBb0tqQixHQUFjOzs7O0FBQ1Ysa0JBQU0sMEJBQU47O0FBRUEsbUJBQUssU0FBTCxDQUFlLEtBQWY7YUFIVTtLQUFkO0NBcEtHO1FBQU0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IEVpb0NsaWVudCBmcm9tICdlbmdpbmUuaW8tY2xpZW50JztcbmNvbnN0IGRlYnVnID0gbmV3IERlYnVnKCd3cy10ZWxlZ3JhcGg6Y2xpZW50Jyk7XG5cbi8qKlxuICogUmVwcmVzZW50IGluY29taW5nIFJQQy1yZXNwb25zZVxuICovXG5jbGFzcyBUZ1Jlc3BvbnNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY2xpZW50IHNvY2tldFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBycGMtbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHJlcXVlc3RJZFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzdWx0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc29ja2V0LCBtZXRob2QsIHJlcXVlc3RJZCwgcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbn1cbi8qKlxuICogQ2xpZW50IGZvciBUZWxlZ3JhcGgtc2VydmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGllbnQgIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgY29ubmVjdGlvbiB0byBXUy1zZXJ2ZXIgYW5kIGluc3RhbnRpYXRlIGNsaWVudCB3aXRoIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydFxuICAgICAqIEByZXR1cm5zIHtDbGllbnR9XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShob3N0LCBwb3J0KSB7XG4gICAgICAgIGRlYnVnKCd0cnkgY3JlYXRlIGNsaWVudCcpO1xuICAgICAgICBjb25zdCB1cmwgPSBgd3M6Ly8ke2hvc3R9OiR7cG9ydH1gO1xuICAgICAgICBjb25zdCBlaW9DbGllbnQgPSBuZXcgRWlvQ2xpZW50KHVybCwge3RyYW5zcG9ydHM6IFsnd2Vic29ja2V0J119KTtcblxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoYENvbm5lY3Rpb24gc3VjY2Vzc2Z1bGx5IG9wZW5lZCB3aXRoIHVybCAke3VybH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYW5cXCd0IG9wZW4gY29ubmVjdGlvbiBkdWUgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoZWlvQ2xpZW50KTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihlaW9DbGllbnQpIHtcbiAgICAgICAgdGhpcy5laW9DbGllbnQgPSBlaW9DbGllbnQ7XG4gICAgICAgIHRoaXMuY2FsbElkID0gMDtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcywgZWlvQ2xpZW50KSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBuZXcgaWQgZm9yIG1hcmsgY2FsbFxuICAgICAqIElmIGlkIHRvbyBiaWcsICByZXNldHMgaXQgdG8gMSBhZ2FpblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2VuZXJhdGVJZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbElkID4gMTAwMDAwMCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsSWQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0lkID0gKyt0aGlzLmNhbGxJZDtcbiAgICAgICAgZGVidWcoYEdlbmVyYXRlZCBpZDogJHtuZXdJZH1gKTtcbiAgICAgICAgcmV0dXJuIG5ld0lkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gUlBDIGFuZCB3YWl0IHJlc3VsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7e3RpbWVvdXQ6IG51bWJlcn19IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7e319IFthcmdzXSAgYXJndW1lbnRzIGZvciByZW1vdGUgcHJvY2VkdXJlXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBjYWxsV2l0aFJlc3VsdChtZXRob2QsIG9wdGlvbnMgPSB7fSwgYXJncykge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdDbGllbnQgY2FsbFdpdGhSZXN1bHQnLCBtZXRob2Q6IG1ldGhvZCwgb3B0aW9uczogb3B0aW9ucywgYXJnczogYXJnc30pO1xuICAgICAgICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgNTA7IC8vIDUwIG1zXG4gICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5zZW5kKHJlcXVlc3QsIHt9LCAoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbCBzZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbGlzdGVuZXI7IC8vIHJlZiB0byBsaXN0ZW5lciBmb3IgcG9zc2libGUgcmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZW91dEV4Y2VwdGlvbiA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGxXaXRoUmVzdWx0IHJlc3BvbnNlIHRpbWVvdXQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBFcnJvcignVGdSZXNwb25zZSB0aW1lb3V0JykpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lb3V0KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1RnUmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdGVuZXIgPSAocmVzcG9uc2UpPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXF1ZXN0SWQgPT09IHJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygnVGdSZXNwb25zZSByZWNlaXZlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEV4Y2VwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5laW9DbGllbnQub24oJ3JwY19yZXNwb25zZScsIGxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5laW9DbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3JwY19yZXNwb25zZScsIGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBSUEMgd2l0aG91dCBnZXR0aW5nIHJlc3VsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7e319IFthcmdzXSAgYXJndW1lbnRzIGZvciByZW1vdGUgcHJvY2VkdXJlXG4gICAgICovXG4gICAgYXN5bmMgY2FsbChtZXRob2QsIGFyZ3Mpe1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdDbGllbnQgY2FsbCcsIG1ldGhvZDogbWV0aG9kLCBhcmdzOiBhcmdzfSk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5zZW5kKHJlcXVlc3QsIHt9LCAoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbCBzZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgcmVzcG9uc2UgXCJtZXNzYWdlXCJcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY29ubmVjdGlvbiB3aXRoIHNlcnZlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfCp9IGRhdGEgLSBkYXRhIGluIGpzb24gZm9ybWF0XG4gICAgICovXG4gICAgb25NZXNzYWdlKHNvY2tldCwgZGF0YSkge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdyZWNlaXZlIG1lc3NhZ2UnLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIGxldCBlcnJvck9jY3VycmVkID0gZmFsc2U7XG4gICAgICAgIGxldCByZXF1ZXN0SWQsIHJlcXVlc3RNZXRob2QsIHJlc3BvbnNlUmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICByZXF1ZXN0SWQgPSBwYXJzZWREYXRhLmlkO1xuICAgICAgICAgICAgcmVxdWVzdE1ldGhvZCA9IHBhcnNlZERhdGEubWV0aG9kO1xuICAgICAgICAgICAgcmVzcG9uc2VSZXN1bHQgPSBwYXJzZWREYXRhLnJlc3VsdDtcbiAgICAgICAgICAgIGlmICghcmVxdWVzdElkIHx8ICFyZXNwb25zZVJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGVycm9yT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvck9jY3VycmVkKSB7XG4gICAgICAgICAgICBkZWJ1Zyh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdXcm9uZyByZXNwb25zZSByZWNlaXZlZC4gVGdSZXNwb25zZSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGFuZCByZXN1bHQgZmllbGRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9ICdycGNfcmVzcG9uc2UnO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gbmV3IFRnUmVzcG9uc2Uoc29ja2V0LCByZXF1ZXN0TWV0aG9kLCByZXF1ZXN0SWQsIHJlc3BvbnNlUmVzdWx0KTtcbiAgICAgICAgZGVidWcoJ2VtaXQgcnBjX3Jlc3BvbnNlIGV2ZW50Jyk7XG4gICAgICAgIHRoaXMuZWlvQ2xpZW50LmVtaXQoZXZlbnROYW1lLCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgY29ubmVjdGlvbiB3aXRoIHNlcnZlclxuICAgICAqIEBub3RlOiBhc3luYyBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgc2VydmVyLmNsb3NlXG4gICAgICovXG4gICAgYXN5bmMgY2xvc2UoKSB7XG4gICAgICAgIGRlYnVnKCdQZXJmb3JtIGNsb3NlIGNvbm5lY3Rpb24nKTtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5jbG9zZSgpO1xuICAgIH1cbn1cblxuIl19