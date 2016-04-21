'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WsTgClient = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _engine = require('engine.io-client');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = new _debug2.default('ws-telegraph:client');

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
                    _this.onError();
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
        if (this.callId === Number.MAX_SAFE_INTEGER) {
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
    callAndWait(method) {
        var _this2 = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return (0, _asyncToGenerator3.default)(function* () {
            debug({ event: 'WsTgClient callWithResult', method: method, args: args });
            const requestId = _this2.generateId();

            const request = JSON.stringify({
                id: requestId,
                call: method,
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
                 * @param {number} responseId
                 * @param {*} responseResult
                 * @returns {*}
                 */
                listener = function (responseId, responseResult) {
                    if (responseId === requestId) {
                        debug('Response received');
                        clearTimeout(timeoutException);
                        return resolve(responseResult);
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
                call: method,
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
     * Called when opening a connection. There may be some kind of a server preparing.
     */
    onOpen() {
        debug('Called onOpen');
    }

    onError() {
        debug('Called onError');
    }

    /**
     * Handle response "message"
     * @param {string|*} data - data in json format
     * @fires EioClient#rpcResponse
     */
    onMessage(data) {
        debug({ event: 'receive message', data: data });
        let errorOccurred = false;
        let requestId, responseResult;
        try {
            const parsedData = JSON.parse(data);
            requestId = parsedData.id;
            responseResult = parsedData.result;
            if (typeof requestId === 'undefined') {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong response received. Response must be in json format and have id field',
                data: data
            });
            return;
        }

        debug('emit rpcResponse event');
        /**
         * RPC response event.
         *
         * @event EioClient#rpcResponse
         */
        this.eioClient.emit('rpcResponse', requestId, responseResult);
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
//# sourceMappingURL=data:application/json;base64,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LFVBc0lwQixHQUFTO0FBQ0wsY0FBTSxlQUFOLEVBREs7S0FBVDs7QUFJQSxjQUFVO0FBQ04sY0FBTSxnQkFBTixFQURNO0tBQVY7Ozs7Ozs7QUExSW9CLGFBbUpwQixDQUFVLElBQVYsRUFBZ0I7QUFDWixjQUFNLEVBQUMsT0FBTyxpQkFBUCxFQUEwQixNQUFNLElBQU4sRUFBakMsRUFEWTtBQUVaLFlBQUksZ0JBQWdCLEtBQWhCLENBRlE7QUFHWixZQUFJLFNBQUosRUFBZSxjQUFmLENBSFk7QUFJWixZQUFJO0FBQ0Esa0JBQU0sYUFBYSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWIsQ0FETjtBQUVBLHdCQUFZLFdBQVcsRUFBWCxDQUZaO0FBR0EsNkJBQWlCLFdBQVcsTUFBWCxDQUhqQjtBQUlBLGdCQUFJLE9BQU8sU0FBUCxLQUFxQixXQUFyQixFQUFrQztBQUNsQyxnQ0FBZ0IsSUFBaEIsQ0FEa0M7YUFBdEM7U0FKSixDQU9FLE9BQU8sR0FBUCxFQUFZO0FBQ1YsNEJBQWdCLElBQWhCLENBRFU7U0FBWjtBQUdGLFlBQUksYUFBSixFQUFtQjtBQUNmLGtCQUFNO0FBQ0YsdUJBQU8sNEVBQVA7QUFDQSxzQkFBTSxJQUFOO2FBRkosRUFEZTtBQUtmLG1CQUxlO1NBQW5COztBQVFBLGNBQU0sd0JBQU47Ozs7OztBQXRCWSxZQTRCWixDQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLGFBQXBCLEVBQW1DLFNBQW5DLEVBQThDLGNBQTlDLEVBNUJZO0tBQWhCOzs7Ozs7QUFuSm9CLFFBc0xwQixHQUFhOzs7O0FBQ1Qsa0JBQU0sMEJBQU47O0FBRUEsbUJBQUssU0FBTCxDQUFlLEtBQWY7QUFDQSxtQkFBTyxPQUFLLFNBQUw7YUFKRTtLQUFiO0NBdExHO1FBQU0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IEVpb0NsaWVudCBmcm9tICdlbmdpbmUuaW8tY2xpZW50JztcbmNvbnN0IGRlYnVnID0gbmV3IERlYnVnKCd3cy10ZWxlZ3JhcGg6Y2xpZW50Jyk7XG5cblxuLyoqXG4gKiBXc1RnQ2xpZW50IGZvciBUZWxlZ3JhcGgtc2VydmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBXc1RnQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgY29ubmVjdGlvbiB0byBXUy1zZXJ2ZXIgYW5kIGluc3RhbnRpYXRlIGNsaWVudCB3aXRoIGl0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIG9wdGlvbnMgZm9yIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZW91dD0xMDBdIC0gbXNcbiAgICAgKiBAcmV0dXJucyB7V3NUZ0NsaWVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgZGVidWcoJ3RyeSBjcmVhdGUgY2xpZW50Jyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9wdGlvbnMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAxMDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydFxuXG4gICAgICovXG4gICAgYXN5bmMgc3RhcnQoaG9zdCwgcG9ydCkge1xuICAgICAgICBjb25zdCB1cmwgPSBgd3M6Ly8ke2hvc3R9OiR7cG9ydH1gO1xuICAgICAgICBjb25zdCBlaW9DbGllbnQgPSBuZXcgRWlvQ2xpZW50KHVybCwge3RyYW5zcG9ydHM6IFsnd2Vic29ja2V0J119KTtcbiAgICAgICAgdGhpcy5laW9DbGllbnQgPSBlaW9DbGllbnQ7XG4gICAgICAgIHRoaXMuY2FsbElkID0gMDtcblxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBlaW9DbGllbnQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoYENvbm5lY3Rpb24gc3VjY2Vzc2Z1bGx5IG9wZW5lZCB3aXRoIHVybCAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVpb0NsaWVudC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0NhblxcJ3Qgb3BlbiBjb25uZWN0aW9uIGR1ZSBlcnJvcicpO1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVpb0NsaWVudC5vbignbWVzc2FnZScsIDo6dGhpcy5vbk1lc3NhZ2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgbmV3IGlkIGZvciBtYXJrIGNhbGxcbiAgICAgKiBJZiBpZCB0b28gYmlnLCAgcmVzZXRzIGl0IHRvIDEgYWdhaW5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdlbmVyYXRlSWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNhbGxJZCA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbElkID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdJZCA9ICsrdGhpcy5jYWxsSWQ7XG4gICAgICAgIGRlYnVnKGBHZW5lcmF0ZWQgaWQ6ICR7bmV3SWR9YCk7XG4gICAgICAgIHJldHVybiBuZXdJZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIFJQQyBhbmQgd2FpdCByZXN1bHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIG5hbWVcbiAgICAgKiBAcGFyYW0gey4uLnt9fSBbYXJnc10gIGFyZ3VtZW50cyBmb3IgcmVtb3RlIHByb2NlZHVyZVxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgYXN5bmMgY2FsbEFuZFdhaXQobWV0aG9kLCAuLi5hcmdzKSB7XG4gICAgICAgIGRlYnVnKHtldmVudDogJ1dzVGdDbGllbnQgY2FsbFdpdGhSZXN1bHQnLCBtZXRob2Q6IG1ldGhvZCwgYXJnczogYXJnc30pO1xuICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgIGNhbGw6IG1ldGhvZCxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuZWlvQ2xpZW50LnNlbmQocmVxdWVzdCwge30sICgpPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDYWxsIHNlbnQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBsaXN0ZW5lcjsgLy8gcmVmIHRvIGxpc3RlbmVyIGZvciBwb3NzaWJsZSByZW1vdmVMaXN0ZW5lclxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lb3V0RXhjZXB0aW9uID0gc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbFdpdGhSZXN1bHQgcmVzcG9uc2UgdGltZW91dCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IEVycm9yKCdXc1RnQ2xpZW50UmVzcG9uc2UgdGltZW91dCcpKTtcbiAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucy50aW1lb3V0KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzcG9uc2VJZFxuICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVJlc3VsdFxuICAgICAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxpc3RlbmVyID0gKHJlc3BvbnNlSWQsIHJlc3BvbnNlUmVzdWx0KT0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VJZCA9PT0gcmVxdWVzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdSZXNwb25zZSByZWNlaXZlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEV4Y2VwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3BvbnNlUmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5vbigncnBjUmVzcG9uc2UnLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWlvQ2xpZW50LnJlbW92ZUxpc3RlbmVyKCdycGNSZXNwb25zZScsIGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBSUEMgd2l0aG91dCBnZXR0aW5nIHJlc3VsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7Li4ue319IFthcmdzXSAgYXJndW1lbnRzIGZvciByZW1vdGUgcHJvY2VkdXJlXG4gICAgICovXG4gICAgYXN5bmMgY2FsbChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgZGVidWcoe2V2ZW50OiAnV3NUZ0NsaWVudCBjYWxsJywgbWV0aG9kOiBtZXRob2QsIGFyZ3M6IGFyZ3N9KTtcbiAgICAgICAgY29uc3QgcmVxdWVzdElkID0gdGhpcy5nZW5lcmF0ZUlkKCk7XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICBjYWxsOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmVpb0NsaWVudC5zZW5kKHJlcXVlc3QsIHt9LCAoKT0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ2FsbCBzZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBvcGVuaW5nIGEgY29ubmVjdGlvbi4gVGhlcmUgbWF5IGJlIHNvbWUga2luZCBvZiBhIHNlcnZlciBwcmVwYXJpbmcuXG4gICAgICovXG4gICAgb25PcGVuKCkge1xuICAgICAgICBkZWJ1ZygnQ2FsbGVkIG9uT3BlbicpO1xuICAgIH1cblxuICAgIG9uRXJyb3IoKSB7XG4gICAgICAgIGRlYnVnKCdDYWxsZWQgb25FcnJvcicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSByZXNwb25zZSBcIm1lc3NhZ2VcIlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfCp9IGRhdGEgLSBkYXRhIGluIGpzb24gZm9ybWF0XG4gICAgICogQGZpcmVzIEVpb0NsaWVudCNycGNSZXNwb25zZVxuICAgICAqL1xuICAgIG9uTWVzc2FnZShkYXRhKSB7XG4gICAgICAgIGRlYnVnKHtldmVudDogJ3JlY2VpdmUgbWVzc2FnZScsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgbGV0IGVycm9yT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHJlcXVlc3RJZCwgcmVzcG9uc2VSZXN1bHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIHJlcXVlc3RJZCA9IHBhcnNlZERhdGEuaWQ7XG4gICAgICAgICAgICByZXNwb25zZVJlc3VsdCA9IHBhcnNlZERhdGEucmVzdWx0O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0SWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyb3JPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yT2NjdXJyZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKHtcbiAgICAgICAgICAgICAgICBldmVudDogJ1dyb25nIHJlc3BvbnNlIHJlY2VpdmVkLiBSZXNwb25zZSBtdXN0IGJlIGluIGpzb24gZm9ybWF0IGFuZCBoYXZlIGlkIGZpZWxkJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnKCdlbWl0IHJwY1Jlc3BvbnNlIGV2ZW50Jyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSUEMgcmVzcG9uc2UgZXZlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBldmVudCBFaW9DbGllbnQjcnBjUmVzcG9uc2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZWlvQ2xpZW50LmVtaXQoJ3JwY1Jlc3BvbnNlJywgcmVxdWVzdElkLCByZXNwb25zZVJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgY29ubmVjdGlvbiB3aXRoIHNlcnZlclxuICAgICAqIEBub3RlOiBhc3luYyBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgV3NUZ1NlcnZlci5jbG9zZVxuICAgICAqL1xuICAgIGFzeW5jIHN0b3AoKSB7XG4gICAgICAgIGRlYnVnKCdQZXJmb3JtIGNsb3NlIGNvbm5lY3Rpb24nKTtcblxuICAgICAgICB0aGlzLmVpb0NsaWVudC5jbG9zZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5laW9DbGllbnQ7XG4gICAgfVxufVxuXG4iXX0=