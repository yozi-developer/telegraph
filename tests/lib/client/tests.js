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
                    var ref = (0, _asyncToGenerator3.default)(function* () {
                        return 'world';
                    });

                    function onHello() {
                        return ref.apply(this, arguments);
                    }

                    return onHello;
                })();
                const result = yield client.callAndWait('hello');
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
                    yield client.callAndWait('sleep');
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
                client.options.timeout = 150;

                try {
                    yield client.callAndWait('sleep');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTGhCOztBQUNBOztBQUNBOzs7Ozs7QUFDQSxNQUFNLE9BQU8sUUFBUSxHQUFSLENBQVksSUFBWixJQUFvQixJQUFwQjs7QUFFTixTQUFTLFFBQVQsR0FBb0I7O0FBRXZCLGFBQVMsZ0JBQVQsRUFBMkIsWUFBWTtBQUNuQyxXQUFHLHNCQUFILEVBQTJCLFlBQVk7QUFDbkMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLFNBQVMsd0JBQVQsQ0FERTtBQUVSLHNCQUFNLE9BQU8sS0FBUCxDQUFhLFdBQWIsRUFBMEIsSUFBMUIsQ0FBTixDQUZRO0FBR1Isb0JBQUksZUFBZSxLQUFmLENBSEk7QUFJUixzQkFBTSxpQkFBaUIsTUFBTSxjQUFOLDRCQUF1QztBQUMxRCw2QkFBUTtBQUNKLDhCQUFNLE1BQU4sR0FESTtBQUVKLHVDQUFlLElBQWYsQ0FGSTtxQkFBUjtpQkFEbUIsQ0FKZjtBQVVSLHNCQUFNLFNBQVMsSUFBSSxjQUFKLEVBQVQsQ0FWRTs7QUFZUixzQkFBTyxPQUFPLEtBQVAsQ0FBYSxXQUFiLEVBQTBCLElBQTFCLENBQVAsQ0FaUTtBQWFSLHNCQUFPLE9BQU8sSUFBUCxFQUFQLENBYlE7QUFjUixzQkFBTyxPQUFPLElBQVAsRUFBUCxDQWRROztBQWdCUixzQ0FBTyxZQUFQLEVBQXFCLEVBQXJCLENBQXdCLElBQXhCLEdBaEJRO2FBQVgsQ0FBRCxFQURKLENBRG1DO1NBQVosQ0FBM0IsQ0FEbUM7S0FBWixDQUEzQixDQUZ1QjtBQTBCdkIsYUFBUyxLQUFULEVBQWdCLFlBQVk7QUFDeEIsbUJBQVcsWUFBWTs7O0FBQ25CLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBSyxNQUFMLEdBQWMsd0JBQWQsQ0FEUTtBQUVSLHNCQUFNLE1BQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsV0FBbEIsRUFBK0IsSUFBL0IsQ0FB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TSxTQUFTLEtBQUssTUFBTCxDQUQyQjtBQUUxQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUYyQjs7QUFJMUMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLGdCQUFnQixNQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFZO0FBQ2hELDBCQUFNLGVBQWUsV0FBVyxZQUFLO0FBQ2pDLGdDQUFRLElBQUksS0FBSixDQUFVLFNBQVYsQ0FBUixFQURpQztxQkFBTCxFQUU3QixHQUZrQixDQUFmOztBQUQwQywwQkFLaEQsQ0FBTyxTQUFQO2tFQUFtQixhQUF5QjtBQUN4Qyx5Q0FBYSxZQUFiLEVBRHdDO0FBRXhDLG9DQUFRLElBQVIsRUFGd0M7eUJBQXpCOztpQ0FBZTs7Ozs7d0JBQWxDLENBTGdEOztBQVVoRCwyQkFBTyxJQUFQLENBQVksU0FBWixFQVZnRDtpQkFBWixDQUFsQixDQURkOztBQWNSLHNDQUFPLGFBQVAsRUFBc0IsS0FBdEIsQ0FBNEIsSUFBNUIsRUFBa0MscUNBQWxDLEVBZFE7YUFBWCxDQUFELEVBREosQ0FKMEM7U0FBWixDQUFsQyxDQS9Gd0I7S0FBWixDQUFoQixDQTFCdUI7Q0FBcEIiLCJmaWxlIjoidGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBhZnRlcjogdHJ1ZSwgYWZ0ZXJFYWNoOiB0cnVlLCBiZWZvcmU6IHRydWUsICBiZWZvcmVFYWNoLCBpdDogdHJ1ZSwgZGVzY3JpYmU6IHRydWUsIHByb2Nlc3M6IHRydWUsIFxuICovXG5cbmltcG9ydCB7V3NUZ0NsaWVudH0gZnJvbSAnLi4vLi4vLi4vbGliL2NsaWVudCc7XG5pbXBvcnQge1dzVGdTZXJ2ZXJ9IGZyb20gJy4uLy4uLy4uL2xpYi9zZXJ2ZXInO1xuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQnO1xuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blRlc3RzKCkge1xuXG4gICAgZGVzY3JpYmUoJ0luaXRpYWxpemF0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnQ2xpZW50IG9uT3BlbiBjYWxsZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3IFdzVGdTZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2VydmVyLnN0YXJ0KCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9uT3BlbkNhbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBFeHRlbmRlZENsaWVudCA9IGNsYXNzIEV4dGVuZGVkQ2xpZW50IGV4dGVuZHMgV3NUZ0NsaWVudHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uT3Blbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLm9uT3BlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT3BlbkNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBFeHRlbmRlZENsaWVudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICBjbGllbnQuc3RhcnQoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgY2xpZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgIHNlcnZlci5zdG9wKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKG9uT3BlbkNhbGxlZCkuYmUudHJ1ZSgpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdSUEMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyID0gbmV3IFdzVGdTZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2ZXIuc3RhcnQoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBXc1RnQ2xpZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICB0aGlzLmNsaWVudC5zdGFydCgnbG9jYWxob3N0JywgcG9ydCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNsaWVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ0NhbiBjYWxsIFJQQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHR5cGUgV3NUZ0NsaWVudFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uSGVsbG8gPSBhc3luYyBmdW5jdGlvbiBvbkhlbGxvKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd3b3JsZCc7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5jYWxsQW5kV2FpdCgnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlc3VsdCkuZXF1YWwoJ3dvcmxkJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ1Rocm93IGVycm9yIG9uIHRpbWVvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIub25TbGVlcCA9IGFzeW5jIGZ1bmN0aW9uIG9uU2xlZXAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxBbmRXYWl0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKHRydWUsICdObyBleGNlcHRpb24gIHdhcyB0aHJvd24nKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGluY3JlYXNlIHRpbWVvdXQgbGltaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vblNsZWVwID0gYXN5bmMgZnVuY3Rpb24gb25TbGVlcCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdJIGFtIHNsZWVwIGZvciAxMDAgbXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudC5vcHRpb25zLnRpbWVvdXQgPSAxNTA7XG5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5jYWxsQW5kV2FpdCgnc2xlZXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJPY2N1cnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKGVyck9jY3VycmVkKS5lcXVhbChmYWxzZSwgJ0V4Y2VwdGlvbiAgd2FzIHRocm93biBldmVuIHdpdGggaW5jcmVhc2VkIHRpbWVvdXQgbGltaXQnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDIHdpdGhvdXQgcmVzdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RSZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IEVycm9yKCdUaW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTsvLyB3YWl0IHVwIHRvIDIwMCB1bnRpbCB0aGUgc2VydmVyIHJlY2VpdmVzIHRoZSBtZXNzYWdlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5vblNpbGVuY2UgPSBhc3luYyBmdW5jdGlvbiBzaWxlbmNlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQuY2FsbCgnc2lsZW5jZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzaG91bGQocmVxdWVzdFJlc3VsdCkuZXF1YWwodHJ1ZSwgJ1dzVGdTZXJ2ZXIgZG9lcyBub3QgcmVjZWl2ZSByZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iXX0=