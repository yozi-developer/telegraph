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
        before(function () {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this.server = new _server.WsTgServer();
                yield _this.server.start('localhost', port);
                _this.client = new _client.WsTgClient();
                yield _this.client.start('localhost', port);
            })();
        });
        after(function () {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                yield _this2.client.stop();
                yield _this2.server.stop();
            })();
        });
        it('Can call RPC', function () {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this3.server.onHello = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        return 'world';
                    });

                    function onHello() {
                        return ref.apply(this, arguments);
                    }

                    return onHello;
                })();
                const result = yield _this3.client.callAndWait('hello');
                delete _this3.server.onHello;
                (0, _should2.default)(result).equal('world');
            })();
        });

        it('Can call RPC with void result', function () {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this4.server.onVoid = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {});

                    function onVoid() {
                        return ref.apply(this, arguments);
                    }

                    return onVoid;
                })();
                const result = yield _this4.client.callAndWait('void');
                delete _this4.server.onVoid;
                (0, _should2.default)(result).be.undefined();
            })();
        });

        it('Throw error on timeout', function () {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                let errOccurred = false;
                _this5.server.onSleep = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        return yield new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    });

                    function onSleep() {
                        return ref.apply(this, arguments);
                    }

                    return onSleep;
                })();
                try {
                    yield _this5.client.callAndWait('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                delete _this5.server.onSleep;
                (0, _should2.default)(errOccurred).equal(true, 'No exception  was thrown');
            })();
        });

        it('Can increase timeout limit', function () {
            var _this6 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                let errOccurred = false;

                _this6.server.onSleep = (() => {
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        return yield new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    });

                    function onSleep() {
                        return ref.apply(this, arguments);
                    }

                    return onSleep;
                })();
                _this6.client.options.timeout = 150;

                try {
                    yield _this6.client.callAndWait('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                delete _this6.server.onSleep;
                (0, _should2.default)(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
            })();
        });

        it('Can call RPC without result', function () {
            var _this7 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                const requestResult = yield new Promise(function (resolve) {
                    const timeoutTimer = setTimeout(function () {
                        resolve(new Error('Timeout'));
                    }, 200); // wait up to 200 until the server receives the message

                    _this7.server.onSilence = (() => {
                        var ref = (0, _asyncToGenerator3.default)(function* () {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        });

                        function silence() {
                            return ref.apply(this, arguments);
                        }

                        return silence;
                    })();

                    _this7.client.call('silence');
                });

                delete _this7.server.onSilence;
                (0, _should2.default)(requestResult).equal(true, 'WsTgServer does not receive request');
            })();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTGhCOztBQUNBOztBQUNBOzs7Ozs7QUFDQSxNQUFNLE9BQU8sUUFBUSxHQUFSLENBQVksSUFBWixJQUFvQixJQUFwQjs7QUFFTixTQUFTLFFBQVQsR0FBb0I7O0FBRXZCLGFBQVMsZ0JBQVQsRUFBMkIsWUFBWTtBQUNuQyxXQUFHLHNCQUFILEVBQTJCLFlBQVk7QUFDbkMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLFNBQVMsd0JBQVQsQ0FERTtBQUVSLHNCQUFNLE9BQU8sS0FBUCxDQUFhLFdBQWIsRUFBMEIsSUFBMUIsQ0FBTixDQUZRO0FBR1Isb0JBQUksZUFBZSxLQUFmLENBSEk7QUFJUixzQkFBTSxpQkFBaUIsTUFBTSxjQUFOLDRCQUF1QztBQUMxRCw2QkFBUTtBQUNKLDhCQUFNLE1BQU4sR0FESTtBQUVKLHVDQUFlLElBQWYsQ0FGSTtxQkFBUjtpQkFEbUIsQ0FKZjtBQVVSLHNCQUFNLFNBQVMsSUFBSSxjQUFKLEVBQVQsQ0FWRTs7QUFZUixzQkFBTyxPQUFPLEtBQVAsQ0FBYSxXQUFiLEVBQTBCLElBQTFCLENBQVAsQ0FaUTtBQWFSLHNCQUFPLE9BQU8sSUFBUCxFQUFQLENBYlE7QUFjUixzQkFBTyxPQUFPLElBQVAsRUFBUCxDQWRROztBQWdCUixzQ0FBTyxZQUFQLEVBQXFCLEVBQXJCLENBQXdCLElBQXhCLEdBaEJRO2FBQVgsQ0FBRCxFQURKLENBRG1DO1NBQVosQ0FBM0IsQ0FEbUM7S0FBWixDQUEzQixDQUZ1QjtBQTBCdkIsYUFBUyxLQUFULEVBQWdCLFlBQVk7QUFDeEIsZUFBTyxZQUFZOzs7QUFDZixtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isc0JBQUssTUFBTCxHQUFjLHdCQUFkLENBRFE7QUFFUixzQkFBTSxNQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFdBQWxCLEVBQStCLElBQS9CLENBQU4s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LDBCQUFNLE9BQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsT0FBeEIsQ0FBTixDQURBO2lCQUFKLENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDVixrQ0FBYyxJQUFkLENBRFU7aUJBQVo7QUFHRix1QkFBTyxPQUFLLE1BQUwsQ0FBWSxPQUFaLENBakJDO0FBa0JSLHNDQUFPLFdBQVAsRUFBb0IsS0FBcEIsQ0FBMEIsS0FBMUIsRUFBaUMseURBQWpDLEVBbEJRO2FBQVgsQ0FBRCxFQURKLENBRHlDO1NBQVosQ0FBakMsQ0FwRXdCOztBQTZGeEIsV0FBRyw2QkFBSCxFQUFrQyxZQUFZOzs7QUFDMUMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLGdCQUFnQixNQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFZO0FBQ2hELDBCQUFNLGVBQWUsV0FBVyxZQUFLO0FBQ2pDLGdDQUFRLElBQUksS0FBSixDQUFVLFNBQVYsQ0FBUixFQURpQztxQkFBTCxFQUU3QixHQUZrQixDQUFmOztBQUQwQywwQkFLaEQsQ0FBSyxNQUFMLENBQVksU0FBWjtrRUFBd0IsYUFBeUI7QUFDN0MseUNBQWEsWUFBYixFQUQ2QztBQUU3QyxvQ0FBUSxJQUFSLEVBRjZDO3lCQUF6Qjs7aUNBQWU7Ozs7O3dCQUF2QyxDQUxnRDs7QUFVaEQsMkJBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsU0FBakIsRUFWZ0Q7aUJBQVosQ0FBbEIsQ0FEZDs7QUFjUix1QkFBTyxPQUFLLE1BQUwsQ0FBWSxTQUFaLENBZEM7QUFlUixzQ0FBTyxhQUFQLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDLHFDQUFsQyxFQWZRO2FBQVgsQ0FBRCxFQURKLENBRDBDO1NBQVosQ0FBbEMsQ0E3RndCO0tBQVosQ0FBaEIsQ0ExQnVCO0NBQXBCIiwiZmlsZSI6InRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypcbiBnbG9iYWwgYWZ0ZXI6IHRydWUsIGFmdGVyRWFjaDogdHJ1ZSwgYmVmb3JlOiB0cnVlLCAgYmVmb3JlRWFjaCwgaXQ6IHRydWUsIGRlc2NyaWJlOiB0cnVlLCBwcm9jZXNzOiB0cnVlLCBcbiAqL1xuXG5pbXBvcnQge1dzVGdDbGllbnR9IGZyb20gJy4uLy4uLy4uL2xpYi9jbGllbnQnO1xuaW1wb3J0IHtXc1RnU2VydmVyfSBmcm9tICcuLi8uLi8uLi9saWIvc2VydmVyJztcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkJztcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5UZXN0cygpIHtcblxuICAgIGRlc2NyaWJlKCdJbml0aWFsaXphdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ0NsaWVudCBvbk9wZW4gY2FsbGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBXc1RnU2VydmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlcnZlci5zdGFydCgnbG9jYWxob3N0JywgcG9ydCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbk9wZW5DYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRXh0ZW5kZWRDbGllbnQgPSBjbGFzcyBFeHRlbmRlZENsaWVudCBleHRlbmRzIFdzVGdDbGllbnR7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk9wZW4oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5vbk9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9wZW5DYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgRXh0ZW5kZWRDbGllbnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgY2xpZW50LnN0YXJ0KCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgIGNsaWVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICBzZXJ2ZXIuc3RvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChvbk9wZW5DYWxsZWQpLmJlLnRydWUoKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyID0gbmV3IFdzVGdTZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2ZXIuc3RhcnQoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBXc1RnQ2xpZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICB0aGlzLmNsaWVudC5zdGFydCgnbG9jYWxob3N0JywgcG9ydCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgYWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2ZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLm9uSGVsbG8gPSBhc3luYyBmdW5jdGlvbiBvbkhlbGxvKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd3b3JsZCc7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY2xpZW50LmNhbGxBbmRXYWl0KCdoZWxsbycpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZXJ2ZXIub25IZWxsbztcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlc3VsdCkuZXF1YWwoJ3dvcmxkJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ0NhbiBjYWxsIFJQQyB3aXRoIHZvaWQgcmVzdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLm9uVm9pZCA9IGFzeW5jIGZ1bmN0aW9uIG9uVm9pZCgpIHtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jbGllbnQuY2FsbEFuZFdhaXQoJ3ZvaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VydmVyLm9uVm9pZDtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlc3VsdCkuYmUudW5kZWZpbmVkKCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBpdCgnVGhyb3cgZXJyb3Igb24gdGltZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIub25TbGVlcCA9IGFzeW5jIGZ1bmN0aW9uIG9uU2xlZXAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jbGllbnQuY2FsbEFuZFdhaXQoJ3NsZWVwJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlcnZlci5vblNsZWVwO1xuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKHRydWUsICdObyBleGNlcHRpb24gIHdhcyB0aHJvd24nKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGluY3JlYXNlIHRpbWVvdXQgbGltaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVyck9jY3VycmVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIub25TbGVlcCA9IGFzeW5jIGZ1bmN0aW9uIG9uU2xlZXAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudC5vcHRpb25zLnRpbWVvdXQgPSAxNTA7XG5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LmNhbGxBbmRXYWl0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZXJ2ZXIub25TbGVlcDtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKGVyck9jY3VycmVkKS5lcXVhbChmYWxzZSwgJ0V4Y2VwdGlvbiAgd2FzIHRocm93biBldmVuIHdpdGggaW5jcmVhc2VkIHRpbWVvdXQgbGltaXQnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDIHdpdGhvdXQgcmVzdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RSZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IEVycm9yKCdUaW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTsvLyB3YWl0IHVwIHRvIDIwMCB1bnRpbCB0aGUgc2VydmVyIHJlY2VpdmVzIHRoZSBtZXNzYWdlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLm9uU2lsZW5jZSA9IGFzeW5jIGZ1bmN0aW9uIHNpbGVuY2UoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50LmNhbGwoJ3NpbGVuY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VydmVyLm9uU2lsZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlcXVlc3RSZXN1bHQpLmVxdWFsKHRydWUsICdXc1RnU2VydmVyIGRvZXMgbm90IHJlY2VpdmUgcmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIl19