'use strict';
/*
 global before: true, describe: true, it: true, context: true
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
             * @type Client
             */
            const client = this.client;
            const server = this.server;
            const helloListener = request => {
                request.response('world');
            };

            return (0, _asyncToGenerator3.default)(function* () {
                server.on('hello', helloListener);
                const result = yield client.callWithResult('hello');
                server.removeListener('hello', helloListener);
                (0, _should2.default)(result).equal('world');
            })();
        });

        it('Throw error on timeout', function () {
            /**
             * @type Client
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
                server.on('sleep', lazyListener);
                try {
                    yield client.callWithResult('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                server.removeListener('sleep', lazyListener);
                (0, _should2.default)(errOccurred).equal(true, 'No exception  was thrown');
            })();
        });

        it('Can increase timeout limit', function () {
            /**
             * @type Client
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
                server.on('sleep', lazyListener);
                try {
                    yield client.callWithResult('sleep', { timeout: 150 });
                } catch (err) {
                    errOccurred = true;
                }
                server.removeListener('sleep', lazyListener);
                (0, _should2.default)(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
            })();
        });

        it('Can call RPC without result', function () {

            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                yield client.call('silence');

                let silenceListener;
                const requestResult = yield new Promise(function (resolve) {
                    const timeoutTimer = setTimeout(function () {
                        resolve(new Error('Timeout'));
                    }, 200); // wait up to 200 until the server receives the message

                    silenceListener = function () {
                        clearTimeout(timeoutTimer);
                        resolve(true);
                    };
                    server.on('silence', silenceListener);
                });

                server.removeListener('silence', silenceListener);
                (0, _should2.default)(requestResult).equal(true, 'Server does not receive request');
            })();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFPZ0I7O0FBRmhCOzs7Ozs7QUFFTyxTQUFTLFFBQVQsR0FBb0I7QUFDdkIsYUFBUyxLQUFULEVBQWdCLFlBQVk7QUFDeEIsV0FBRyxjQUFILEVBQW1CLFlBQVk7Ozs7QUFJM0Isa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FKWTtBQUszQixrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUxZO0FBTTNCLGtCQUFNLGdCQUFnQixXQUFZO0FBQzlCLHdCQUFRLFFBQVIsQ0FBaUIsT0FBakIsRUFEOEI7YUFBWixDQU5LOztBQVUzQixtQkFDSSxnQ0FBQyxhQUFXO0FBQ1IsdUJBQU8sRUFBUCxDQUFVLE9BQVYsRUFBbUIsYUFBbkIsRUFEUTtBQUVSLHNCQUFNLFNBQVMsTUFBTSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsQ0FBTixDQUZQO0FBR1IsdUJBQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixhQUEvQixFQUhRO0FBSVIsc0NBQU8sTUFBUCxFQUFlLEtBQWYsQ0FBcUIsT0FBckIsRUFKUTthQUFYLENBQUQsRUFESixDQVYyQjtTQUFaLENBQW5CLENBRHdCOztBQXFCeEIsV0FBRyx3QkFBSCxFQUE2QixZQUFZOzs7O0FBSXJDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBSnNCO0FBS3JDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBTHNCO0FBTXJDLGtCQUFNLGVBQWUsV0FBWTtBQUM3QiwyQkFBVyxNQUFLO0FBQ1osNEJBQVEsUUFBUixDQUFpQix1QkFBakIsRUFEWTtpQkFBTCxFQUVSLEdBRkgsRUFENkI7YUFBWixDQU5nQjtBQVdyQyxtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isb0JBQUksY0FBYyxLQUFkLENBREk7QUFFUix1QkFBTyxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFuQixFQUZRO0FBR1Isb0JBQUk7QUFDQSwwQkFBTSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsQ0FBTixDQURBO2lCQUFKLENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDVixrQ0FBYyxJQUFkLENBRFU7aUJBQVo7QUFHRix1QkFBTyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBUlE7QUFTUixzQ0FBTyxXQUFQLEVBQW9CLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDLDBCQUFoQyxFQVRRO2FBQVgsQ0FBRCxFQURKLENBWHFDO1NBQVosQ0FBN0IsQ0FyQndCOztBQStDeEIsV0FBRyw0QkFBSCxFQUFpQyxZQUFZOzs7O0FBSXpDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBSjBCO0FBS3pDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBTDBCO0FBTXpDLGtCQUFNLGVBQWUsV0FBWTtBQUM3QiwyQkFBVyxNQUFLO0FBQ1osNEJBQVEsUUFBUixDQUFpQix1QkFBakIsRUFEWTtpQkFBTCxFQUVSLEdBRkgsRUFENkI7YUFBWixDQU5vQjtBQVd6QyxtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isb0JBQUksY0FBYyxLQUFkLENBREk7QUFFUix1QkFBTyxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFuQixFQUZRO0FBR1Isb0JBQUk7QUFDQSwwQkFBTSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsRUFBQyxTQUFTLEdBQVQsRUFBaEMsQ0FBTixDQURBO2lCQUFKLENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDVixrQ0FBYyxJQUFkLENBRFU7aUJBQVo7QUFHRix1QkFBTyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBUlE7QUFTUixzQ0FBTyxXQUFQLEVBQW9CLEtBQXBCLENBQTBCLEtBQTFCLEVBQWlDLHlEQUFqQyxFQVRRO2FBQVgsQ0FBRCxFQURKLENBWHlDO1NBQVosQ0FBakMsQ0EvQ3dCOztBQXlFeEIsV0FBRyw2QkFBSCxFQUFrQyxZQUFZOztBQUUxQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUYyQjtBQUcxQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUgyQjs7QUFLMUMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLE9BQU8sSUFBUCxDQUFZLFNBQVosQ0FBTixDQURROztBQUdSLG9CQUFJLGVBQUosQ0FIUTtBQUlSLHNCQUFNLGdCQUFnQixNQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFXO0FBQy9DLDBCQUFNLGVBQWUsV0FBVyxZQUFJO0FBQ2hDLGdDQUFRLElBQUksS0FBSixDQUFVLFNBQVYsQ0FBUixFQURnQztxQkFBSixFQUU3QixHQUZrQixDQUFmOztBQUR5QyxtQ0FLL0MsR0FBa0IsWUFBTTtBQUNwQixxQ0FBYSxZQUFiLEVBRG9CO0FBRXBCLGdDQUFRLElBQVIsRUFGb0I7cUJBQU4sQ0FMNkI7QUFTL0MsMkJBQU8sRUFBUCxDQUFVLFNBQVYsRUFBcUIsZUFBckIsRUFUK0M7aUJBQVgsQ0FBbEIsQ0FKZDs7QUFpQlIsdUJBQU8sY0FBUCxDQUFzQixTQUF0QixFQUFpQyxlQUFqQyxFQWpCUTtBQWtCUixzQ0FBTyxhQUFQLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDLGlDQUFsQyxFQWxCUTthQUFYLENBQUQsRUFESixDQUwwQztTQUFaLENBQWxDLENBekV3QjtLQUFaLENBQWhCLENBRHVCO0NBQXBCIiwiZmlsZSI6InRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypcbiBnbG9iYWwgYmVmb3JlOiB0cnVlLCBkZXNjcmliZTogdHJ1ZSwgaXQ6IHRydWUsIGNvbnRleHQ6IHRydWVcbiAqL1xuXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5UZXN0cygpIHtcbiAgICBkZXNjcmliZSgnUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAdHlwZSBDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcbiAgICAgICAgICAgIGNvbnN0IGhlbGxvTGlzdGVuZXIgPSAocmVxdWVzdCk9PiB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZSgnd29ybGQnKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIub24oJ2hlbGxvJywgaGVsbG9MaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5jYWxsV2l0aFJlc3VsdCgnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLnJlbW92ZUxpc3RlbmVyKCdoZWxsbycsIGhlbGxvTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBzaG91bGQocmVzdWx0KS5lcXVhbCgnd29ybGQnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnVGhyb3cgZXJyb3Igb24gdGltZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHR5cGUgQ2xpZW50XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuY2xpZW50O1xuICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gdGhpcy5zZXJ2ZXI7XG4gICAgICAgICAgICBjb25zdCBsYXp5TGlzdGVuZXIgPSAocmVxdWVzdCk9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZSgnSSBhbSBzbGVlcCBmb3IgMTAwIG1zJyk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVyck9jY3VycmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vbignc2xlZXAnLCBsYXp5TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGxXaXRoUmVzdWx0KCdzbGVlcCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3NsZWVwJywgbGF6eUxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKGVyck9jY3VycmVkKS5lcXVhbCh0cnVlLCAnTm8gZXhjZXB0aW9uICB3YXMgdGhyb3duJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ0NhbiBpbmNyZWFzZSB0aW1lb3V0IGxpbWl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAdHlwZSBDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcbiAgICAgICAgICAgIGNvbnN0IGxhenlMaXN0ZW5lciA9IChyZXF1ZXN0KT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCdJIGFtIHNsZWVwIGZvciAxMDAgbXMnKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyT2NjdXJyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uKCdzbGVlcCcsIGxhenlMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY2FsbFdpdGhSZXN1bHQoJ3NsZWVwJywge3RpbWVvdXQ6IDE1MH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3NsZWVwJywgbGF6eUxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKGVyck9jY3VycmVkKS5lcXVhbChmYWxzZSwgJ0V4Y2VwdGlvbiAgd2FzIHRocm93biBldmVuIHdpdGggaW5jcmVhc2VkIHRpbWVvdXQgbGltaXQnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDIHdpdGhvdXQgcmVzdWx0JywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChhc3luYygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNhbGwoJ3NpbGVuY2UnKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2lsZW5jZUxpc3RlbmVyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0UmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgRXJyb3IoJ1RpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApOy8vIHdhaXQgdXAgdG8gMjAwIHVudGlsIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgdGhlIG1lc3NhZ2VcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2lsZW5jZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9uKCdzaWxlbmNlJywgc2lsZW5jZUxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3NpbGVuY2UnLCBzaWxlbmNlTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBzaG91bGQocmVxdWVzdFJlc3VsdCkuZXF1YWwodHJ1ZSwgJ1NlcnZlciBkb2VzIG5vdCByZWNlaXZlIHJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==