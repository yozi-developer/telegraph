'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true, 
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.runTests = runTests;

var _client = require('../../../lib/client');

var _server = require('../../../lib/server');

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || 3000;

function runTests() {

    describe('Initialization', function () {
        it('Client onOpen called', function () {
            return (0, _asyncToGenerator3.default)(function* () {
                const server = new _server.WsTgServer();
                yield server.start('localhost', port);
                let onOpenCalled = false;
                const ExtendedClient = class ExtendedClient extends _client.WsTgClient {
                    onOpen() {
                        super.onOpen();
                        onOpenCalled = true;
                    }
                };
                const client = new ExtendedClient();

                yield client.start('localhost', port);
                yield client.stop();
                yield server.stop();

                (0, _should2.default)(onOpenCalled).be.true();
            })();
        });
    });
    describe('RPC', function () {
        beforeEach(function () {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this.server = new _server.WsTgServer();
                yield _this.server.start('localhost', port);
                _this.client = new _client.WsTgClient();
                yield _this.client.start('localhost', port);
            })();
        });
        afterEach(function () {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                yield _this2.client.stop();
                yield _this2.server.stop();
            })();
        });
        it('Can call RPC', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                server.onHello = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* (request) {
                        request.response('world');
                    });

                    function onHello(_x) {
                        return ref.apply(this, arguments);
                    }

                    return onHello;
                })();
                const result = yield client.callWithResult('hello');
                (0, _should2.default)(result).equal('world');
            })();
        });

        it('Throw error on timeout', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                let errOccurred = false;
                server.onSleep = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* (request) {
                        setTimeout(function () {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    });

                    function onSleep(_x2) {
                        return ref.apply(this, arguments);
                    }

                    return onSleep;
                })();
                try {
                    yield client.callWithResult('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                (0, _should2.default)(errOccurred).equal(true, 'No exception  was thrown');
            })();
        });

        it('Can increase timeout limit', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                let errOccurred = false;

                server.onSleep = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* (request) {
                        setTimeout(function () {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    });

                    function onSleep(_x3) {
                        return ref.apply(this, arguments);
                    }

                    return onSleep;
                })();
                client.options.timeout = 150;

                try {
                    yield client.callWithResult('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                (0, _should2.default)(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
            })();
        });

        it('Can call RPC without result', function () {
            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                const requestResult = yield new Promise(function (resolve) {
                    const timeoutTimer = setTimeout(function () {
                        resolve(new Error('Timeout'));
                    }, 200); // wait up to 200 until the server receives the message

                    server.onSilence = (() => {
                        var ref = (0, _asyncToGenerator3.default)(function* () {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        });

                        function silence() {
                            return ref.apply(this, arguments);
                        }

                        return silence;
                    })();

                    client.call('silence');
                });

                (0, _should2.default)(requestResult).equal(true, 'WsTgServer does not receive request');
            })();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTGhCOztBQUNBOztBQUNBOzs7Ozs7QUFDQSxNQUFNLE9BQU8sUUFBUSxHQUFSLENBQVksSUFBWixJQUFvQixJQUFwQjs7QUFFTixTQUFTLFFBQVQsR0FBb0I7O0FBRXZCLGFBQVMsZ0JBQVQsRUFBMkIsWUFBWTtBQUNuQyxXQUFHLHNCQUFILEVBQTJCLFlBQVk7QUFDbkMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLFNBQVMsd0JBQVQsQ0FERTtBQUVSLHNCQUFNLE9BQU8sS0FBUCxDQUFhLFdBQWIsRUFBMEIsSUFBMUIsQ0FBTixDQUZRO0FBR1Isb0JBQUksZUFBZSxLQUFmLENBSEk7QUFJUixzQkFBTSxpQkFBaUIsTUFBTSxjQUFOLDRCQUF1QztBQUMxRCw2QkFBUTtBQUNKLDhCQUFNLE1BQU4sR0FESTtBQUVKLHVDQUFlLElBQWYsQ0FGSTtxQkFBUjtpQkFEbUIsQ0FKZjtBQVVSLHNCQUFNLFNBQVMsSUFBSSxjQUFKLEVBQVQsQ0FWRTs7QUFZUixzQkFBTyxPQUFPLEtBQVAsQ0FBYSxXQUFiLEVBQTBCLElBQTFCLENBQVAsQ0FaUTtBQWFSLHNCQUFPLE9BQU8sSUFBUCxFQUFQLENBYlE7QUFjUixzQkFBTyxPQUFPLElBQVAsRUFBUCxDQWRROztBQWdCUixzQ0FBTyxZQUFQLEVBQXFCLEVBQXJCLENBQXdCLElBQXhCLEdBaEJRO2FBQVgsQ0FBRCxFQURKLENBRG1DO1NBQVosQ0FBM0IsQ0FEbUM7S0FBWixDQUEzQixDQUZ1QjtBQTBCdkIsYUFBUyxLQUFULEVBQWdCLFlBQVk7QUFDeEIsbUJBQVcsWUFBWTs7O0FBQ25CLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBSyxNQUFMLEdBQWMsd0JBQWQsQ0FEUTtBQUVSLHNCQUFNLE1BQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsV0FBbEIsRUFBK0IsSUFBL0IsQ0FB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STFDLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBTSxnQkFBZ0IsTUFBTSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBWTtBQUNoRCwwQkFBTSxlQUFlLFdBQVcsWUFBSztBQUNqQyxnQ0FBUSxJQUFJLEtBQUosQ0FBVSxTQUFWLENBQVIsRUFEaUM7cUJBQUwsRUFFN0IsR0FGa0IsQ0FBZjs7QUFEMEMsMEJBS2hELENBQU8sU0FBUDtrRUFBbUIsYUFBeUI7QUFDeEMseUNBQWEsWUFBYixFQUR3QztBQUV4QyxvQ0FBUSxJQUFSLEVBRndDO3lCQUF6Qjs7aUNBQWU7Ozs7O3dCQUFsQyxDQUxnRDs7QUFVaEQsMkJBQU8sSUFBUCxDQUFZLFNBQVosRUFWZ0Q7aUJBQVosQ0FBbEIsQ0FEZDs7QUFjUixzQ0FBTyxhQUFQLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDLHFDQUFsQyxFQWRRO2FBQVgsQ0FBRCxFQURKLENBSjBDO1NBQVosQ0FBbEMsQ0EzRndCO0tBQVosQ0FBaEIsQ0ExQnVCO0NBQXBCIiwiZmlsZSI6InRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypcbiBnbG9iYWwgYWZ0ZXI6IHRydWUsIGFmdGVyRWFjaDogdHJ1ZSwgYmVmb3JlOiB0cnVlLCAgYmVmb3JlRWFjaCwgaXQ6IHRydWUsIGRlc2NyaWJlOiB0cnVlLCBwcm9jZXNzOiB0cnVlLCBcbiAqL1xuXG5pbXBvcnQge1dzVGdDbGllbnR9IGZyb20gJy4uLy4uLy4uL2xpYi9jbGllbnQnO1xuaW1wb3J0IHtXc1RnU2VydmVyfSBmcm9tICcuLi8uLi8uLi9saWIvc2VydmVyJztcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkJztcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5UZXN0cygpIHtcblxuICAgIGRlc2NyaWJlKCdJbml0aWFsaXphdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ0NsaWVudCBvbk9wZW4gY2FsbGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBXc1RnU2VydmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlcnZlci5zdGFydCgnbG9jYWxob3N0JywgcG9ydCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbk9wZW5DYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRXh0ZW5kZWRDbGllbnQgPSBjbGFzcyBFeHRlbmRlZENsaWVudCBleHRlbmRzIFdzVGdDbGllbnR7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk9wZW4oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5vbk9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9wZW5DYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgRXh0ZW5kZWRDbGllbnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgY2xpZW50LnN0YXJ0KCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgIGNsaWVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICBzZXJ2ZXIuc3RvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChvbk9wZW5DYWxsZWQpLmJlLnRydWUoKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZlciA9IG5ldyBXc1RnU2VydmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0YXJ0KCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQgPSBuZXcgV3NUZ0NsaWVudCgpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgdGhpcy5jbGllbnQuc3RhcnQoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jbGllbnQuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdDYW4gY2FsbCBSUEMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vbkhlbGxvID0gYXN5bmMgZnVuY3Rpb24gb25IZWxsbyhyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCd3b3JsZCcpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuY2FsbFdpdGhSZXN1bHQoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChyZXN1bHQpLmVxdWFsKCd3b3JsZCcpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdUaHJvdyBlcnJvciBvbiB0aW1lb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAdHlwZSBXc1RnQ2xpZW50XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuY2xpZW50O1xuICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gdGhpcy5zZXJ2ZXI7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uU2xlZXAgPSBhc3luYyBmdW5jdGlvbiBvblNsZWVwKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxXaXRoUmVzdWx0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKHRydWUsICdObyBleGNlcHRpb24gIHdhcyB0aHJvd24nKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGluY3JlYXNlIHRpbWVvdXQgbGltaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vblNsZWVwID0gYXN5bmMgZnVuY3Rpb24gb25TbGVlcChyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2UoJ0kgYW0gc2xlZXAgZm9yIDEwMCBtcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm9wdGlvbnMudGltZW91dCA9IDE1MDtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxXaXRoUmVzdWx0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKGZhbHNlLCAnRXhjZXB0aW9uICB3YXMgdGhyb3duIGV2ZW4gd2l0aCBpbmNyZWFzZWQgdGltZW91dCBsaW1pdCcpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdDYW4gY2FsbCBSUEMgd2l0aG91dCByZXN1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdFJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgRXJyb3IoJ1RpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApOy8vIHdhaXQgdXAgdG8gMjAwIHVudGlsIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgdGhlIG1lc3NhZ2VcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uU2lsZW5jZSA9IGFzeW5jIGZ1bmN0aW9uIHNpbGVuY2UoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5jYWxsKCdzaWxlbmNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChyZXF1ZXN0UmVzdWx0KS5lcXVhbCh0cnVlLCAnV3NUZ1NlcnZlciBkb2VzIG5vdCByZWNlaXZlIHJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==