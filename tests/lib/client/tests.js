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

            return (0, _asyncToGenerator3.default)(function* () {
                server.onHello = function onHello(request) {
                    request.response('world');
                };
                const result = yield client.callWithResult('hello');
                delete server.onHello;
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
                server.onSleep = function onSleep(request) {
                    setTimeout(function () {
                        request.response('I am sleep for 100 ms');
                    }, 100);
                };
                try {
                    yield client.callWithResult('sleep');
                } catch (err) {
                    errOccurred = true;
                }
                delete server.onSleep;
                (0, _should2.default)(errOccurred).equal(true, 'No exception  was thrown');
            })();
        });

        it('Can increase timeout limit', function () {
            /**
             * @type Client
             */
            const client = this.client;
            const server = this.server;

            return (0, _asyncToGenerator3.default)(function* () {
                let errOccurred = false;
                server.onSleep = function onSleep(request) {
                    setTimeout(function () {
                        request.response('I am sleep for 100 ms');
                    }, 100);
                };
                try {
                    yield client.callWithResult('sleep', { timeout: 150 });
                } catch (err) {
                    errOccurred = true;
                }
                delete server.onSleep;
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

                    server.onSilence = function silence() {
                        clearTimeout(timeoutTimer);
                        resolve(true);
                    };

                    client.call('silence');
                });

                delete server.onSilence;
                (0, _should2.default)(requestResult).equal(true, 'Server does not receive request');
            })();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFPZ0I7O0FBRmhCOzs7Ozs7QUFFTyxTQUFTLFFBQVQsR0FBb0I7QUFDdkIsYUFBUyxLQUFULEVBQWdCLFlBQVk7QUFDeEIsV0FBRyxjQUFILEVBQW1CLFlBQVk7Ozs7QUFJM0Isa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FKWTtBQUszQixrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUxZOztBQU8zQixtQkFDSSxnQ0FBQyxhQUFXO0FBQ1IsdUJBQU8sT0FBUCxHQUFpQixTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEI7QUFDdkMsNEJBQVEsUUFBUixDQUFpQixPQUFqQixFQUR1QztpQkFBMUIsQ0FEVDtBQUlSLHNCQUFNLFNBQVMsTUFBTSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsQ0FBTixDQUpQO0FBS1IsdUJBQU8sT0FBTyxPQUFQLENBTEM7QUFNUixzQ0FBTyxNQUFQLEVBQWUsS0FBZixDQUFxQixPQUFyQixFQU5RO2FBQVgsQ0FBRCxFQURKLENBUDJCO1NBQVosQ0FBbkIsQ0FEd0I7O0FBb0J4QixXQUFHLHdCQUFILEVBQTZCLFlBQVk7Ozs7QUFJckMsa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FKc0I7QUFLckMsa0JBQU0sU0FBUyxLQUFLLE1BQUwsQ0FMc0I7QUFNckMsa0JBQU0sZUFBZSxXQUFZO0FBQzdCLDJCQUFXLE1BQUs7QUFDWiw0QkFBUSxRQUFSLENBQWlCLHVCQUFqQixFQURZO2lCQUFMLEVBRVIsR0FGSCxFQUQ2QjthQUFaLENBTmdCO0FBV3JDLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixvQkFBSSxjQUFjLEtBQWQsQ0FESTtBQUVSLHVCQUFPLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWlCLE9BQWpCLEVBQTBCO0FBQ3ZDLCtCQUFXLFlBQUs7QUFDWixnQ0FBUSxRQUFSLENBQWlCLHVCQUFqQixFQURZO3FCQUFMLEVBRVIsR0FGSCxFQUR1QztpQkFBMUIsQ0FGVDtBQU9SLG9CQUFJO0FBQ0EsMEJBQU0sT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQU4sQ0FEQTtpQkFBSixDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1Ysa0NBQWMsSUFBZCxDQURVO2lCQUFaO0FBR0YsdUJBQU8sT0FBTyxPQUFQLENBWkM7QUFhUixzQ0FBTyxXQUFQLEVBQW9CLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDLDBCQUFoQyxFQWJRO2FBQVgsQ0FBRCxFQURKLENBWHFDO1NBQVosQ0FBN0IsQ0FwQndCOztBQWtEeEIsV0FBRyw0QkFBSCxFQUFpQyxZQUFZOzs7O0FBSXpDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBSjBCO0FBS3pDLGtCQUFNLFNBQVMsS0FBSyxNQUFMLENBTDBCOztBQU96QyxtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isb0JBQUksY0FBYyxLQUFkLENBREk7QUFFUix1QkFBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN2QywrQkFBVyxZQUFLO0FBQ1osZ0NBQVEsUUFBUixDQUFpQix1QkFBakIsRUFEWTtxQkFBTCxFQUVSLEdBRkgsRUFEdUM7aUJBQTFCLENBRlQ7QUFPUixvQkFBSTtBQUNBLDBCQUFNLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixFQUFDLFNBQVMsR0FBVCxFQUFoQyxDQUFOLENBREE7aUJBQUosQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNWLGtDQUFjLElBQWQsQ0FEVTtpQkFBWjtBQUdGLHVCQUFPLE9BQU8sT0FBUCxDQVpDO0FBYVIsc0NBQU8sV0FBUCxFQUFvQixLQUFwQixDQUEwQixLQUExQixFQUFpQyx5REFBakMsRUFiUTthQUFYLENBQUQsRUFESixDQVB5QztTQUFaLENBQWpDLENBbER3Qjs7QUE0RXhCLFdBQUcsNkJBQUgsRUFBa0MsWUFBWTtBQUMxQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUQyQjtBQUUxQyxrQkFBTSxTQUFTLEtBQUssTUFBTCxDQUYyQjs7QUFJMUMsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFNLGdCQUFnQixNQUFNLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFZO0FBQ2hELDBCQUFNLGVBQWUsV0FBVyxZQUFLO0FBQ2pDLGdDQUFRLElBQUksS0FBSixDQUFVLFNBQVYsQ0FBUixFQURpQztxQkFBTCxFQUU3QixHQUZrQixDQUFmOztBQUQwQywwQkFLaEQsQ0FBTyxTQUFQLEdBQW1CLFNBQVMsT0FBVCxHQUFtQjtBQUNsQyxxQ0FBYSxZQUFiLEVBRGtDO0FBRWxDLGdDQUFRLElBQVIsRUFGa0M7cUJBQW5CLENBTDZCOztBQVVoRCwyQkFBTyxJQUFQLENBQVksU0FBWixFQVZnRDtpQkFBWixDQUFsQixDQURkOztBQWNSLHVCQUFPLE9BQU8sU0FBUCxDQWRDO0FBZVIsc0NBQU8sYUFBUCxFQUFzQixLQUF0QixDQUE0QixJQUE1QixFQUFrQyxpQ0FBbEMsRUFmUTthQUFYLENBQUQsRUFESixDQUowQztTQUFaLENBQWxDLENBNUV3QjtLQUFaLENBQWhCLENBRHVCO0NBQXBCIiwiZmlsZSI6InRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypcbiBnbG9iYWwgYmVmb3JlOiB0cnVlLCBkZXNjcmliZTogdHJ1ZSwgaXQ6IHRydWUsIGNvbnRleHQ6IHRydWVcbiAqL1xuXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5UZXN0cygpIHtcbiAgICBkZXNjcmliZSgnUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnQ2FuIGNhbGwgUlBDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAdHlwZSBDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vbkhlbGxvID0gZnVuY3Rpb24gb25IZWxsbyhyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCd3b3JsZCcpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuY2FsbFdpdGhSZXN1bHQoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZXJ2ZXIub25IZWxsbztcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKHJlc3VsdCkuZXF1YWwoJ3dvcmxkJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ1Rocm93IGVycm9yIG9uIHRpbWVvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEB0eXBlIENsaWVudFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudDtcbiAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyO1xuICAgICAgICAgICAgY29uc3QgbGF6eUxpc3RlbmVyID0gKHJlcXVlc3QpPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2UoJ0kgYW0gc2xlZXAgZm9yIDEwMCBtcycpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIub25TbGVlcCA9IGZ1bmN0aW9uIG9uU2xlZXAocmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCdJIGFtIHNsZWVwIGZvciAxMDAgbXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY2FsbFdpdGhSZXN1bHQoJ3NsZWVwJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyT2NjdXJyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZXJ2ZXIub25TbGVlcDtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkKGVyck9jY3VycmVkKS5lcXVhbCh0cnVlLCAnTm8gZXhjZXB0aW9uICB3YXMgdGhyb3duJyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ0NhbiBpbmNyZWFzZSB0aW1lb3V0IGxpbWl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAdHlwZSBDbGllbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJPY2N1cnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIub25TbGVlcCA9IGZ1bmN0aW9uIG9uU2xlZXAocmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlKCdJIGFtIHNsZWVwIGZvciAxMDAgbXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY2FsbFdpdGhSZXN1bHQoJ3NsZWVwJywge3RpbWVvdXQ6IDE1MH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9jY3VycmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VydmVyLm9uU2xlZXA7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChlcnJPY2N1cnJlZCkuZXF1YWwoZmFsc2UsICdFeGNlcHRpb24gIHdhcyB0aHJvd24gZXZlbiB3aXRoIGluY3JlYXNlZCB0aW1lb3V0IGxpbWl0Jyk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ0NhbiBjYWxsIFJQQyB3aXRob3V0IHJlc3VsdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuY2xpZW50O1xuICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gdGhpcy5zZXJ2ZXI7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0UmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBFcnJvcignVGltZW91dCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7Ly8gd2FpdCB1cCB0byAyMDAgdW50aWwgdGhlIHNlcnZlciByZWNlaXZlcyB0aGUgbWVzc2FnZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIub25TaWxlbmNlID0gZnVuY3Rpb24gc2lsZW5jZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmNhbGwoJ3NpbGVuY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlcnZlci5vblNpbGVuY2U7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZChyZXF1ZXN0UmVzdWx0KS5lcXVhbCh0cnVlLCAnU2VydmVyIGRvZXMgbm90IHJlY2VpdmUgcmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIl19