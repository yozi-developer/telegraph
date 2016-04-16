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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

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
class Client extends _events2.default {
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
        super();
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

                _this2.on('rpc_response', listener);
            });

            _this2.removeListener('rpc_response', listener);
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
        this.emit(eventName, response);
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
//# sourceMappingURL=data:application/json;base64,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QXFCLFFBQXJCLEVBM0JvQjtLQUF4Qjs7Ozs7O0FBbklxQyxTQXFLckMsR0FBYzs7OztBQUNWLGtCQUFNLDBCQUFOOztBQUVBLG1CQUFLLFNBQUwsQ0FBZSxLQUFmO2FBSFU7S0FBZDtDQXJLRztRQUFNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBFaW9DbGllbnQgZnJvbSAnZW5naW5lLmlvLWNsaWVudCc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5jb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zygnd3MtdGVsZWdyYXBoOmNsaWVudCcpO1xuXG4vKipcbiAqIFJlcHJlc2VudCBpbmNvbWluZyBSUEMtcmVzcG9uc2VcbiAqL1xuY2xhc3MgVGdSZXNwb25zZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNsaWVudCBzb2NrZXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gcnBjLW1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSByZXF1ZXN0SWRcbiAgICAgKiBAcGFyYW0geyp9IHJlc3VsdFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNvY2tldCwgbWV0aG9kLCByZXF1ZXN0SWQsIHJlc3VsdCkge1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMucmVxdWVzdElkID0gcmVxdWVzdElkO1xuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG59XG4vKipcbiAqIENsaWVudCBmb3IgVGVsZWdyYXBoLXNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgY29ubmVjdGlvbiB0byBXUy1zZXJ2ZXIgYW5kIGluc3RhbnRpYXRlIGNsaWVudCB3aXRoIGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydFxuICAgICAqIEByZXR1cm5zIHtDbGllbnR9XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShob3N0LCBwb3J0KSB7XG4gICAgICAgIGRlYnVnKCd0cnkgY3JlYXRlIGNsaWVudCcpO1xuICAgICAgICBjb25zdCB1cmwgPSBgd3M6Ly8ke2hvc3R9OiR7cG9ydH1gO1xuICAgICAgICBjb25zdCBlaW9DbGllbnQgPSBuZXcgRWlvQ2xpZW50KHVybCwge3RyYW5zcG9ydHM6IFsnd2Vic29ja2V0J119KTtcblxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoYENvbm5lY3Rpb24gc3VjY2Vzc2Z1bGx5IG9wZW5lZCB3aXRoIHVybCAke3VybH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYW5cXCd0IG9wZW4gY29ubmVjdGlvbiBkdWUgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoZWlvQ2xpZW50KTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihlaW9DbGllbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5laW9DbGllbnQgPSBlaW9DbGllbnQ7XG4gICAgICAgIHRoaXMuY2FsbElkID0gMDtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcywgZWlvQ2xpZW50KSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBuZXcgaWQgZm9yIG1hcmsgY2FsbFxuICAgICAqIElmIGlkIHRvbyBiaWcsICByZXNldHMgaXQgdG8gMSBhZ2FpblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2VuZXJhdGVJZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbElkID4gMTAwMDAwMCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsSWQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0lkID0gKyt0aGlzLmNhbGxJZDtcbiAgICAgICAgZGVidWcoYEdlbmVyYXRlZCBpZDogJHtuZXdJZH1gKTtcbiAgICAgICAgcmV0dXJuIG5ld0lkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gUlBDIGFuZCB3YWl0IHJlc3VsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7e3RpbWVvdXQ6IG51bWJlcn19IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7e319IFthcmdzXSAgYXJndW1lbnRzIGZvciByZW1vdGUgcHJvY2VkdXJlXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBjYWxsV2l0aFJlc3VsdChtZXRob2QsIG9wdGlvbnMgPSB7fSwgYXJncykge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdDbGllbnQgY2FsbFdpdGhSZXN1bHQnLCBtZXRob2Q6IG1ldGhvZCwgb3B0aW9uczogb3B0aW9ucywgYXJnczogYXJnc30pO1xuICAgICAgICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgNTA7IC8vIDUwIG1zXG4gICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5zZW5kKHJlcXVlc3QsIHt9LCAoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbCBzZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbGlzdGVuZXI7IC8vIHJlZiB0byBsaXN0ZW5lciBmb3IgcG9zc2libGUgcmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZW91dEV4Y2VwdGlvbiA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGxXaXRoUmVzdWx0IHJlc3BvbnNlIHRpbWVvdXQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBFcnJvcignVGdSZXNwb25zZSB0aW1lb3V0JykpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lb3V0KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1RnUmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdGVuZXIgPSAocmVzcG9uc2UpPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXF1ZXN0SWQgPT09IHJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygnVGdSZXNwb25zZSByZWNlaXZlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEV4Y2VwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vbigncnBjX3Jlc3BvbnNlJywgbGlzdGVuZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdycGNfcmVzcG9uc2UnLCBsaXN0ZW5lcik7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gUlBDIHdpdGhvdXQgZ2V0dGluZyByZXN1bHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0ge3t9fSBbYXJnc10gIGFyZ3VtZW50cyBmb3IgcmVtb3RlIHByb2NlZHVyZVxuICAgICAqL1xuICAgIGFzeW5jIGNhbGwobWV0aG9kLCBhcmdzKXtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAnQ2xpZW50IGNhbGwnLCBtZXRob2Q6IG1ldGhvZCwgYXJnczogYXJnc30pO1xuICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgdGhpcy5laW9DbGllbnQuc2VuZChyZXF1ZXN0LCB7fSwgKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGwgc2VudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHJlc3BvbnNlIFwibWVzc2FnZVwiXG4gICAgICogQHBhcmFtIHNvY2tldCAtIGNvbm5lY3Rpb24gd2l0aCBzZXJ2ZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3wqfSBkYXRhIC0gZGF0YSBpbiBqc29uIGZvcm1hdFxuICAgICAqL1xuICAgIG9uTWVzc2FnZShzb2NrZXQsIGRhdGEpIHtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAncmVjZWl2ZSBtZXNzYWdlJywgZGF0YTogZGF0YX0pO1xuICAgICAgICBsZXQgZXJyb3JPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgcmVxdWVzdElkLCByZXF1ZXN0TWV0aG9kLCByZXNwb25zZVJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgcmVxdWVzdElkID0gcGFyc2VkRGF0YS5pZDtcbiAgICAgICAgICAgIHJlcXVlc3RNZXRob2QgPSBwYXJzZWREYXRhLm1ldGhvZDtcbiAgICAgICAgICAgIHJlc3BvbnNlUmVzdWx0ID0gcGFyc2VkRGF0YS5yZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RJZCB8fCAhcmVzcG9uc2VSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JPY2N1cnJlZCkge1xuICAgICAgICAgICAgZGVidWcoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiAnV3JvbmcgcmVzcG9uc2UgcmVjZWl2ZWQuIFRnUmVzcG9uc2UgbXVzdCBiZSBpbiBqc29uIGZvcm1hdCBhbmQgaGF2ZSBpZCBhbmQgcmVzdWx0IGZpZWxkcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudE5hbWUgPSAncnBjX3Jlc3BvbnNlJztcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IG5ldyBUZ1Jlc3BvbnNlKHNvY2tldCwgcmVxdWVzdE1ldGhvZCwgcmVxdWVzdElkLCByZXNwb25zZVJlc3VsdCk7XG4gICAgICAgIGRlYnVnKCdlbWl0IHJwY19yZXNwb25zZSBldmVudCcpO1xuICAgICAgICB0aGlzLmVtaXQoZXZlbnROYW1lLCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgY29ubmVjdGlvbiB3aXRoIHNlcnZlclxuICAgICAqIEBub3RlOiBhc3luYyBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgc2VydmVyLmNsb3NlXG4gICAgICovXG4gICAgYXN5bmMgY2xvc2UoKSB7XG4gICAgICAgIGRlYnVnKCdQZXJmb3JtIGNsb3NlIGNvbm5lY3Rpb24nKTtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5jbG9zZSgpO1xuICAgIH1cbn1cblxuIl19