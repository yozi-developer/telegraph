'use strict';
/*
 global describe: true, before: true, it: true, after: true
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.runClientTests = runClientTests;

var _client = require('../../../lib/client');

var _server = require('../../../lib/server');

var _tests = require('./tests');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || 3000;

function runClientTests() {
    describe('No-Cache', function () {
        before(function () {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this.server = yield _server.Server.create('localhost', port);
                _this.client = yield _client.Client.create('localhost', port);
            })();
        });

        (0, _tests.runTests)();

        after(function () {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function* () {
                yield _this2.client.close();
                yield _this2.server.close();
            })();
        });
    });
    /*
      describe('Memory-Cache', function () {
     before(function () {
     const self = this;
      });
      runClientTests();
     });
      */
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTmhCOztBQUNBOztBQUNBOzs7O0FBQ0EsTUFBTSxPQUFPLFFBQVEsR0FBUixDQUFZLElBQVosSUFBb0IsSUFBcEI7O0FBR04sU0FBUyxjQUFULEdBQTBCO0FBQzdCLGFBQVMsVUFBVCxFQUFxQixZQUFZO0FBQzdCLGVBQU8sWUFBWTs7O0FBQ2YsbUJBQ0ksZ0NBQUMsYUFBVztBQUNSLHNCQUFLLE1BQUwsR0FBYyxNQUFPLGVBQU8sTUFBUCxDQUFjLFdBQWQsRUFBMkIsSUFBM0IsQ0FBUCxDQUROO0FBRVIsc0JBQUssTUFBTCxHQUFjLE1BQU8sZUFBTyxNQUFQLENBQWMsV0FBZCxFQUEyQixJQUEzQixDQUFQLENBRk47YUFBWCxDQUFELEVBREosQ0FEZTtTQUFaLENBQVAsQ0FENkI7O0FBVzdCLCtCQVg2Qjs7QUFhN0IsY0FBTSxZQUFZOzs7QUFDZCxtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isc0JBQU0sT0FBSyxNQUFMLENBQVksS0FBWixFQUFOLENBRFE7QUFFUixzQkFBTSxPQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQU4sQ0FGUTthQUFYLENBQUQsRUFESixDQURjO1NBQVosQ0FBTixDQWI2QjtLQUFaLENBQXJCOzs7Ozs7Ozs7QUFENkIsQ0FBMUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBkZXNjcmliZTogdHJ1ZSwgYmVmb3JlOiB0cnVlLCBpdDogdHJ1ZSwgYWZ0ZXI6IHRydWVcbiAqL1xuaW1wb3J0IHtDbGllbnR9IGZyb20gJy4uLy4uLy4uL2xpYi9jbGllbnQnO1xuaW1wb3J0IHtTZXJ2ZXJ9IGZyb20gJy4uLy4uLy4uL2xpYi9zZXJ2ZXInO1xuaW1wb3J0IHtydW5UZXN0c30gIGZyb20gJy4vdGVzdHMnO1xuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuXG5leHBvcnQgZnVuY3Rpb24gcnVuQ2xpZW50VGVzdHMoKSB7XG4gICAgZGVzY3JpYmUoJ05vLUNhY2hlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyID0gYXdhaXQgIFNlcnZlci5jcmVhdGUoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudCA9IGF3YWl0ICBDbGllbnQuY3JlYXRlKCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJ1blRlc3RzKCk7XG5cbiAgICAgICAgYWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLypcblxuICAgICBkZXNjcmliZSgnTWVtb3J5LUNhY2hlJywgZnVuY3Rpb24gKCkge1xuICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICB9KTtcblxuICAgICBydW5DbGllbnRUZXN0cygpO1xuICAgICB9KTtcblxuICAgICAqL1xufVxuXG4iXX0=