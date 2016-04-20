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
     * @param {Object} [options] - options for request
     * @param {number} [options.timeout=100] - ms
     * @returns {WsTgClient}
     */
    constructor() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        debug('try create client');
        this.options = Object.assign({}, options);
        this.options.timeout = options.timeout || 100;
    }

    /**
     * @param {string} host
     * @param {number} port
      */
    start(host, port) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const url = `ws://${ host }:${ port }`;
            const eioClient = new _engine2.default(url, { transports: ['websocket'] });
            _this.eioClient = eioClient;
            _this.callId = 0;

            yield new Promise(function (resolve, reject) {
                eioClient.on('open', function () {
                    debug(`Connection successfully opened with url ${ url }`);
                    _this.onOpen();
                    return resolve();
                });
                eioClient.on('error', function (err) {
                    debug('Can\'t open connection due error');
                    return reject(err);
                });
            });

            eioClient.on('message', _this.onMessage.bind(_this));
        })();
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

                _this2.eioClient.on('rpcResponse', listener);
            });

            _this2.eioClient.removeListener('rpcResponse', listener);
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

    onOpen() {}

    /**
     * Handle response "message"
     * @param {string|*} data - data in json format
     * @fires EioClient#rpcResponse
     */
    onMessage(data) {
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

        const response = new WsTgClientResponse(this.eioClient, requestMethod, requestId, responseResult);
        debug('emit rpcResponse event');
        /**
         * RPC response event.
         *
         * @event EioClient#rpcResponse
         * @type {WsTgClientResponse}
         */
        this.eioClient.emit('rpcResponse', response);
    }

    /**
     * Close connection with server
     * @note: async for consistency with the WsTgServer.close
     */
    stop() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            debug('Perform close connection');

            _this4.eioClient.close();
            delete _this4.eioClient;
        })();
    }
}
exports.WsTgClient = WsTgClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsTUFBTSxRQUFRLG9CQUFVLHFCQUFWLENBQVI7Ozs7O0FBS04sTUFBTSxrQkFBTixDQUF5Qjs7Ozs7OztBQU9yQixnQkFBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLEVBQXVDLE1BQXZDLEVBQStDO0FBQzNDLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FEMkM7QUFFM0MsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUYyQztBQUczQyxhQUFLLFNBQUwsR0FBaUIsU0FBakIsQ0FIMkM7QUFJM0MsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQUoyQztLQUEvQztDQVBKOzs7O0FBaUJPLE1BQU0sVUFBTixDQUFpQjs7Ozs7OztBQU9wQixrQkFBMEI7WUFBZCxnRUFBVSxrQkFBSTs7QUFDdEIsY0FBTSxtQkFBTixFQURzQjtBQUV0QixhQUFLLE9BQUwsR0FBZSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLE9BQWxCLENBQWYsQ0FGc0I7QUFHdEIsYUFBSyxPQUFMLENBQWEsT0FBYixHQUF1QixRQUFRLE9BQVIsSUFBbUIsR0FBbkIsQ0FIRDtLQUExQjs7Ozs7O0FBUG9CLFNBa0JwQixDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0I7Ozs7QUFDcEIsa0JBQU0sTUFBTSxDQUFDLEtBQUQsR0FBUSxJQUFSLEVBQWEsQ0FBYixHQUFnQixJQUFoQixFQUFxQixDQUEzQjtBQUNOLGtCQUFNLFlBQVkscUJBQWMsR0FBZCxFQUFtQixFQUFDLFlBQVksQ0FBQyxXQUFELENBQVosRUFBcEIsQ0FBWjtBQUNOLGtCQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxrQkFBSyxNQUFMLEdBQWMsQ0FBZDs7QUFFQSxrQkFBTSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ25DLDBCQUFVLEVBQVYsQ0FB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QUFuQyxFQS9CWTtLQUFoQjs7Ozs7O0FBeElvQixRQThLcEIsR0FBYTs7OztBQUNULGtCQUFNLDBCQUFOOztBQUVBLG1CQUFLLFNBQUwsQ0FBZSxLQUFmO0FBQ0EsbUJBQU8sT0FBSyxTQUFMO2FBSkU7S0FBYjtDQTlLRztRQUFNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBFaW9DbGllbnQgZnJvbSAnZW5naW5lLmlvLWNsaWVudCc7XG5jb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zygnd3MtdGVsZWdyYXBoOmNsaWVudCcpO1xuXG4vKipcbiAqIFJlcHJlc2VudCBpbmNvbWluZyBSUEMtcmVzcG9uc2VcbiAqL1xuY2xhc3MgV3NUZ0NsaWVudFJlc3BvbnNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gc29ja2V0IC0gY2xpZW50IHNvY2tldFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBycGMtbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHJlcXVlc3RJZFxuICAgICAqIEBwYXJhbSB7Kn0gcmVzdWx0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc29ja2V0LCBtZXRob2QsIHJlcXVlc3RJZCwgcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbn1cbi8qKlxuICogV3NUZ0NsaWVudCBmb3IgVGVsZWdyYXBoLXNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgV3NUZ0NsaWVudCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGNvbm5lY3Rpb24gdG8gV1Mtc2VydmVyIGFuZCBpbnN0YW50aWF0ZSBjbGllbnQgd2l0aCBpdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBvcHRpb25zIGZvciByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnRpbWVvdXQ9MTAwXSAtIG1zXG4gICAgICogQHJldHVybnMge1dzVGdDbGllbnR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGRlYnVnKCd0cnkgY3JlYXRlIGNsaWVudCcpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgMTAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvcnRcblxuICAgICAqL1xuICAgIGFzeW5jIHN0YXJ0KGhvc3QsIHBvcnQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYHdzOi8vJHtob3N0fToke3BvcnR9YDtcbiAgICAgICAgY29uc3QgZWlvQ2xpZW50ID0gbmV3IEVpb0NsaWVudCh1cmwsIHt0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddfSk7XG4gICAgICAgIHRoaXMuZWlvQ2xpZW50ID0gZWlvQ2xpZW50O1xuICAgICAgICB0aGlzLmNhbGxJZCA9IDA7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZWlvQ2xpZW50Lm9uKCdvcGVuJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKGBDb25uZWN0aW9uIHN1Y2Nlc3NmdWxseSBvcGVuZWQgd2l0aCB1cmwgJHt1cmx9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYW5cXCd0IG9wZW4gY29ubmVjdGlvbiBkdWUgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBlaW9DbGllbnQub24oJ21lc3NhZ2UnLCA6OnRoaXMub25NZXNzYWdlKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIG5ldyBpZCBmb3IgbWFyayBjYWxsXG4gICAgICogSWYgaWQgdG9vIGJpZywgIHJlc2V0cyBpdCB0byAxIGFnYWluXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZW5lcmF0ZUlkKCkge1xuICAgICAgICBpZiAodGhpcy5jYWxsSWQgPiAxMDAwMDAwKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxJZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3SWQgPSArK3RoaXMuY2FsbElkO1xuICAgICAgICBkZWJ1ZyhgR2VuZXJhdGVkIGlkOiAke25ld0lkfWApO1xuICAgICAgICByZXR1cm4gbmV3SWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBSUEMgYW5kIHdhaXQgcmVzdWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIG1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHsuLi57fX0gW2FyZ3NdICBhcmd1bWVudHMgZm9yIHJlbW90ZSBwcm9jZWR1cmVcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGNhbGxXaXRoUmVzdWx0KG1ldGhvZCwgLi4uYXJncykge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdXc1RnQ2xpZW50IGNhbGxXaXRoUmVzdWx0JywgbWV0aG9kOiBtZXRob2QsIGFyZ3M6IGFyZ3N9KTtcbiAgICAgICAgY29uc3QgcmVxdWVzdElkID0gdGhpcy5nZW5lcmF0ZUlkKCk7XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuZWlvQ2xpZW50LnNlbmQocmVxdWVzdCwge30sICgpPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYWxsIHNlbnQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBsaXN0ZW5lcjsgLy8gcmVmIHRvIGxpc3RlbmVyIGZvciBwb3NzaWJsZSByZW1vdmVMaXN0ZW5lclxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lb3V0RXhjZXB0aW9uID0gc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbFdpdGhSZXN1bHQgcmVzcG9uc2UgdGltZW91dCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IEVycm9yKCdXc1RnQ2xpZW50UmVzcG9uc2UgdGltZW91dCcpKTtcbiAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucy50aW1lb3V0KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1dzVGdDbGllbnRSZXNwb25zZX0gcmVzcG9uc2VcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsaXN0ZW5lciA9IChyZXNwb25zZSk9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlcXVlc3RJZCA9PT0gcmVxdWVzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdXc1RnQ2xpZW50UmVzcG9uc2UgcmVjZWl2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRFeGNlcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZS5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZWlvQ2xpZW50Lm9uKCdycGNSZXNwb25zZScsIGxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5laW9DbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3JwY1Jlc3BvbnNlJywgbGlzdGVuZXIpO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIFJQQyB3aXRob3V0IGdldHRpbmcgcmVzdWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIG1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHsuLi57fX0gW2FyZ3NdICBhcmd1bWVudHMgZm9yIHJlbW90ZSBwcm9jZWR1cmVcbiAgICAgKi9cbiAgICBhc3luYyBjYWxsKG1ldGhvZCwgLi4uYXJncykge1xuICAgICAgICBkZWJ1Zyh7ZXZlbnQ6ICdXc1RnQ2xpZW50IGNhbGwnLCBtZXRob2Q6IG1ldGhvZCwgYXJnczogYXJnc30pO1xuICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgdGhpcy5laW9DbGllbnQuc2VuZChyZXF1ZXN0LCB7fSwgKCk9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhbGwgc2VudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25PcGVuKCl7fVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHJlc3BvbnNlIFwibWVzc2FnZVwiXG4gICAgICogQHBhcmFtIHtzdHJpbmd8Kn0gZGF0YSAtIGRhdGEgaW4ganNvbiBmb3JtYXRcbiAgICAgKiBAZmlyZXMgRWlvQ2xpZW50I3JwY1Jlc3BvbnNlXG4gICAgICovXG4gICAgb25NZXNzYWdlKGRhdGEpIHtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAncmVjZWl2ZSBtZXNzYWdlJywgZGF0YTogZGF0YX0pO1xuICAgICAgICBsZXQgZXJyb3JPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgcmVxdWVzdElkLCByZXF1ZXN0TWV0aG9kLCByZXNwb25zZVJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgcmVxdWVzdElkID0gcGFyc2VkRGF0YS5pZDtcbiAgICAgICAgICAgIHJlcXVlc3RNZXRob2QgPSBwYXJzZWREYXRhLm1ldGhvZDtcbiAgICAgICAgICAgIHJlc3BvbnNlUmVzdWx0ID0gcGFyc2VkRGF0YS5yZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RJZCB8fCAhcmVzcG9uc2VSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JPY2N1cnJlZCkge1xuICAgICAgICAgICAgZGVidWcoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiAnV3JvbmcgcmVzcG9uc2UgcmVjZWl2ZWQuIFdzVGdDbGllbnRSZXNwb25zZSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGFuZCByZXN1bHQgZmllbGRzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gbmV3IFdzVGdDbGllbnRSZXNwb25zZSh0aGlzLmVpb0NsaWVudCwgcmVxdWVzdE1ldGhvZCwgcmVxdWVzdElkLCByZXNwb25zZVJlc3VsdCk7XG4gICAgICAgIGRlYnVnKCdlbWl0IHJwY1Jlc3BvbnNlIGV2ZW50Jyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSUEMgcmVzcG9uc2UgZXZlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBldmVudCBFaW9DbGllbnQjcnBjUmVzcG9uc2VcbiAgICAgICAgICogQHR5cGUge1dzVGdDbGllbnRSZXNwb25zZX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZWlvQ2xpZW50LmVtaXQoJ3JwY1Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlIGNvbm5lY3Rpb24gd2l0aCBzZXJ2ZXJcbiAgICAgKiBAbm90ZTogYXN5bmMgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIFdzVGdTZXJ2ZXIuY2xvc2VcbiAgICAgKi9cbiAgICBhc3luYyBzdG9wKCkge1xuICAgICAgICBkZWJ1ZygnUGVyZm9ybSBjbG9zZSBjb25uZWN0aW9uJyk7XG5cbiAgICAgICAgdGhpcy5laW9DbGllbnQuY2xvc2UoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWlvQ2xpZW50O1xuICAgIH1cbn1cblxuIl19