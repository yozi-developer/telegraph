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

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runTests() {
    describe('RPC', function () {
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
            const lazyListener = request => {
                setTimeout(() => {
                    request.response('I am sleep for 100 ms');
                }, 100);
            };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O1FBUWdCOztBQUZoQjs7Ozs7O0FBRU8sU0FBUyxRQUFULEdBQW9CO0FBQ3ZCLGFBQVMsS0FBVCxFQUFnQixZQUFZO0FBQ3hCLFdBQUcsY0FBSCxFQUFtQixZQUFZOzs7O0FBSTNCLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBSlk7QUFLM0Isa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FMWTs7QUFPM0IsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHVCQUFPLE9BQVA7OERBQWlCLFdBQXVCLE9BQXZCLEVBQWdDO0FBQzdDLGdDQUFRLFFBQVIsQ0FBaUIsT0FBakIsRUFENkM7cUJBQWhDOzs2QkFBZTs7Ozs7b0JBQWhDLENBRFE7QUFJUixzQkFBTSxTQUFTLE1BQU0sT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQU4sQ0FKUDtBQUtSLHNDQUFPLE1BQVAsRUFBZSxLQUFmLENBQXFCLE9BQXJCLEVBTFE7YUFBWCxDQUFELEVBREosQ0FQMkI7U0FBWixDQUFuQixDQUR3Qjs7QUFtQnhCLFdBQUcsd0JBQUgsRUFBNkIsWUFBWTs7OztBQUlyQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUpzQjtBQUtyQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUxzQjtBQU1yQyxrQkFBTSxlQUFlLFdBQVk7QUFDN0IsMkJBQVcsTUFBSztBQUNaLDRCQUFRLFFBQVIsQ0FBaUIsdUJBQWpCLEVBRFk7aUJBQUwsRUFFUixHQUZILEVBRDZCO2FBQVosQ0FOZ0I7QUFXckMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLG9CQUFJLGNBQWMsS0FBZCxDQURJO0FBRVIsdUJBQU8sT0FBUDs4REFBaUIsV0FBdUIsT0FBdkIsRUFBZ0M7QUFDN0MsbUNBQVcsWUFBSztBQUNaLG9DQUFRLFFBQVIsQ0FBaUIsdUJBQWpCLEVBRFk7eUJBQUwsRUFFUixHQUZILEVBRDZDO3FCQUFoQzs7NkJBQWU7Ozs7O29CQUFoQyxDQUZRO0FBT1Isb0JBQUk7QUFDQSwwQkFBTSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsQ0FBTixDQURBO2lCQUFKLENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDVixrQ0FBYyxJQUFkLENBRFU7aUJBQVo7QUFHRixzQ0FBTyxXQUFQLEVBQW9CLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDLDBCQUFoQyxFQVpRO2FBQVgsQ0FBRCxFQURKLENBWHFDO1NBQVosQ0FBN0IsQ0FuQndCOztBQWdEeEIsV0FBRyw0QkFBSCxFQUFpQyxZQUFZOzs7O0FBSXpDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBSjBCO0FBS3pDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBTDBCOztBQU96QyxtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isb0JBQUksY0FBYyxLQUFkLENBREk7O0FBR1IsdUJBQU8sT0FBUDs4REFBaUIsV0FBdUIsT0FBdkIsRUFBZ0M7QUFDN0MsbUNBQVcsWUFBSztBQUNaLG9DQUFRLFFBQVIsQ0FBaUIsdUJBQWpCLEVBRFk7eUJBQUwsRUFFUixHQUZILEVBRDZDO3FCQUFoQzs7NkJBQWU7Ozs7O29CQUFoQyxDQUhRO0FBUVIsdUJBQU8sT0FBUCxDQUFlLE9BQWYsR0FBeUIsR0FBekIsQ0FSUTs7QUFVUixvQkFBSTtBQUNBLDBCQUFNLE9BQU8sY0FBUCxDQUFzQixPQUF0QixDQUFOLENBREE7aUJBQUosQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNWLGtDQUFjLElBQWQsQ0FEVTtpQkFBWjtBQUdGLHNDQUFPLFdBQVAsRUFBb0IsS0FBcEIsQ0FBMEIsS0FBMUIsRUFBaUMseURBQWpDLEVBZlE7YUFBWCxDQUFELEVBREosQ0FQeUM7U0FBWixDQUFqQyxDQWhEd0I7O0FBNEV4QixXQUFHLDZCQUFILEVBQWtDLFlBQVk7QUFDMUMsa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FEMkI7QUFFMUMsa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FGMkI7O0FBSTFDLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBTSxnQkFBZ0IsTUFBTSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBWTtBQUNoRCwwQkFBTSxlQUFlLFdBQVcsWUFBSztBQUNqQyxnQ0FBUSxJQUFJLEtBQUosQ0FBVSxTQUFWLENBQVIsRUFEaUM7cUJBQUwsRUFFN0IsR0FGa0IsQ0FBZjs7QUFEMEMsMEJBS2hELENBQU8sU0FBUDtrRUFBbUIsYUFBeUI7QUFDeEMseUNBQWEsWUFBYixFQUR3QztBQUV4QyxvQ0FBUSxJQUFSLEVBRndDO3lCQUF6Qjs7aUNBQWU7Ozs7O3dCQUFsQyxDQUxnRDs7QUFVaEQsMkJBQU8sSUFBUCxDQUFZLFNBQVosRUFWZ0Q7aUJBQVosQ0FBbEIsQ0FEZDs7QUFjUixzQ0FBTyxhQUFQLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDLHFDQUFsQyxFQWRRO2FBQVgsQ0FBRCxFQURKLENBSjBDO1NBQVosQ0FBbEMsQ0E1RXdCO0tBQVosQ0FBaEIsQ0FEdUI7Q0FBcEIiLCJmaWxlIjoidGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBhZnRlcjogdHJ1ZSwgYWZ0ZXJFYWNoOiB0cnVlLCBiZWZvcmU6IHRydWUsICBiZWZvcmVFYWNoLCBpdDogdHJ1ZSwgZGVzY3JpYmU6IHRydWUsIHByb2Nlc3M6IHRydWUsIFxuXG4gKi9cblxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuVGVzdHMoKSB7XG4gICAgZGVzY3JpYmUoJ1JQQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ0NhbiBjYWxsIFJQQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHR5cGUgV3NUZ0NsaWVudFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uSGVsbG8gPSBhc3luYyBmdW5jdGlvbiBvbkhlbGxvKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2UoJ3dvcmxkJyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5jYWxsV2l0aFJlc3VsdCgnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlc3VsdCkuZXF1YWwoJ3dvcmxkJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ1Rocm93IGVycm9yIG9uIHRpbWVvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcbiAgICAgICAgICAgIGNvbnN0IGxhenlMaXN0ZW5lciA9IChyZXF1ZXN0KT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCdJIGFtIHNsZWVwIGZvciAxMDAgbXMnKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uU2xlZXAgPSBhc3luYyBmdW5jdGlvbiBvblNsZWVwKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxXaXRoUmVzdWx0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKHRydWUsICdObyBleGNlcHRpb24gIHdhcyB0aHJvd24nKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGluY3JlYXNlIHRpbWVvdXQgbGltaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIFdzVGdDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vblNsZWVwID0gYXN5bmMgZnVuY3Rpb24gb25TbGVlcChyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2UoJ0kgYW0gc2xlZXAgZm9yIDEwMCBtcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm9wdGlvbnMudGltZW91dCA9IDE1MDtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxXaXRoUmVzdWx0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG91bGQoZXJyT2NjdXJyZWQpLmVxdWFsKGZhbHNlLCAnRXhjZXB0aW9uICB3YXMgdGhyb3duIGV2ZW4gd2l0aCBpbmNyZWFzZWQgdGltZW91dCBsaW1pdCcpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdDYW4gY2FsbCBSUEMgd2l0aG91dCByZXN1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdFJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgRXJyb3IoJ1RpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApOy8vIHdhaXQgdXAgdG8gMjAwIHVudGlsIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgdGhlIG1lc3NhZ2VcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uU2lsZW5jZSA9IGFzeW5jIGZ1bmN0aW9uIHNpbGVuY2UoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5jYWxsKCdzaWxlbmNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChyZXF1ZXN0UmVzdWx0KS5lcXVhbCh0cnVlLCAnV3NUZ1NlcnZlciBkb2VzIG5vdCByZWNlaXZlIHJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==