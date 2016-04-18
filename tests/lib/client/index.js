'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
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
        beforeEach(function () {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function* () {
                _this.server = yield _server.WsTgServer.create('localhost', port);
                _this.client = yield _client.WsTgClient.create('localhost', port);
            })();
        });

        (0, _tests.runTests)();

        afterEach(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTmhCOztBQUNBOztBQUNBOzs7O0FBQ0EsTUFBTSxPQUFPLFFBQVEsR0FBUixDQUFZLElBQVosSUFBb0IsSUFBcEI7O0FBR04sU0FBUyxjQUFULEdBQTBCO0FBQzdCLGFBQVMsVUFBVCxFQUFxQixZQUFZO0FBQzdCLG1CQUFXLFlBQVk7OztBQUNuQixtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isc0JBQUssTUFBTCxHQUFjLE1BQU8sbUJBQVcsTUFBWCxDQUFrQixXQUFsQixFQUErQixJQUEvQixDQUFQLENBRE47QUFFUixzQkFBSyxNQUFMLEdBQWMsTUFBTyxtQkFBVyxNQUFYLENBQWtCLFdBQWxCLEVBQStCLElBQS9CLENBQVAsQ0FGTjthQUFYLENBQUQsRUFESixDQURtQjtTQUFaLENBQVgsQ0FENkI7O0FBVzdCLCtCQVg2Qjs7QUFhN0Isa0JBQVUsWUFBWTs7O0FBQ2xCLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBTSxPQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQU4sQ0FEUTtBQUVSLHNCQUFNLE9BQUssTUFBTCxDQUFZLEtBQVosRUFBTixDQUZRO2FBQVgsQ0FBRCxFQURKLENBRGtCO1NBQVosQ0FBVixDQWI2QjtLQUFaLENBQXJCOzs7Ozs7Ozs7QUFENkIsQ0FBMUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBhZnRlcjogdHJ1ZSwgYWZ0ZXJFYWNoOiB0cnVlLCBiZWZvcmU6IHRydWUsICBiZWZvcmVFYWNoLCBpdDogdHJ1ZSwgZGVzY3JpYmU6IHRydWUsIHByb2Nlc3M6IHRydWVcbiAqL1xuaW1wb3J0IHtXc1RnQ2xpZW50fSBmcm9tICcuLi8uLi8uLi9saWIvY2xpZW50JztcbmltcG9ydCB7V3NUZ1NlcnZlcn0gZnJvbSAnLi4vLi4vLi4vbGliL3NlcnZlcic7XG5pbXBvcnQge3J1blRlc3RzfSAgZnJvbSAnLi90ZXN0cyc7XG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBydW5DbGllbnRUZXN0cygpIHtcbiAgICBkZXNjcmliZSgnTm8tQ2FjaGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyID0gYXdhaXQgIFdzVGdTZXJ2ZXIuY3JlYXRlKCdsb2NhbGhvc3QnLCBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQgPSBhd2FpdCAgV3NUZ0NsaWVudC5jcmVhdGUoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVuVGVzdHMoKTtcblxuICAgICAgICBhZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLypcblxuICAgICBkZXNjcmliZSgnTWVtb3J5LUNhY2hlJywgZnVuY3Rpb24gKCkge1xuICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICB9KTtcblxuICAgICBydW5DbGllbnRUZXN0cygpO1xuICAgICB9KTtcblxuICAgICAqL1xufVxuXG4iXX0=