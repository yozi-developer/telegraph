'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
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
    describe('WsTgServer', function () {
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
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7UUFVZ0I7O0FBTmhCOztBQUNBOztBQUNBOzs7Ozs7QUFDQSxNQUFNLE9BQU8sUUFBUSxHQUFSLENBQVksSUFBWixJQUFvQixJQUFwQjs7QUFHTixTQUFTLFFBQVQsR0FBb0I7QUFDdkIsYUFBUyxZQUFULEVBQXVCLFlBQVk7QUFDL0IsbUJBQVcsWUFBWTs7O0FBRW5CLG1CQUNJLGdDQUFDLGFBQVc7QUFDUixzQkFBSyxNQUFMLEdBQWMsd0JBQWQsQ0FEUTtBQUVSLHNCQUFNLE1BQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsV0FBbEIsRUFBK0IsSUFBL0IsQ0FBTixDQUZRO0FBR1Isc0JBQUssTUFBTCxHQUFjLHdCQUFkLENBSFE7QUFJUixzQkFBTyxNQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFdBQWxCLEVBQStCLElBQS9CLENBQVAsQ0FKUTthQUFYLENBQUQsRUFESixDQUZtQjtTQUFaLENBQVgsQ0FEK0I7O0FBYS9CLGtCQUFVLFlBQVk7OztBQUVsQixtQkFDSSxnQ0FBQyxhQUFXO0FBQ1Isc0JBQU0sT0FBSyxNQUFMLENBQVksSUFBWixFQUFOLENBRFE7QUFFUixzQkFBTSxPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQU4sQ0FGUTthQUFYLENBQUQsRUFESixDQUZrQjtTQUFaLENBQVYsQ0FiK0I7S0FBWixDQUF2QixDQUR1QjtDQUFwQiIsImZpbGUiOiJ0ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8qXG4gZ2xvYmFsIGFmdGVyOiB0cnVlLCBhZnRlckVhY2g6IHRydWUsIGJlZm9yZTogdHJ1ZSwgIGJlZm9yZUVhY2gsIGl0OiB0cnVlLCBkZXNjcmliZTogdHJ1ZSwgcHJvY2VzczogdHJ1ZVxuICovXG5pbXBvcnQge1dzVGdDbGllbnR9IGZyb20gJy4uLy4uLy4uL2xpYi9jbGllbnQnO1xuaW1wb3J0IHtXc1RnU2VydmVyfSBmcm9tICcuLi8uLi8uLi9saWIvc2VydmVyJztcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkJztcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDA7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blRlc3RzKCkge1xuICAgIGRlc2NyaWJlKCdXc1RnU2VydmVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyID0gbmV3IFdzVGdTZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2ZXIuc3RhcnQoJ2xvY2FsaG9zdCcsIHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBXc1RnQ2xpZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICB0aGlzLmNsaWVudC5zdGFydCgnbG9jYWxob3N0JywgcG9ydCk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2ZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59XG4iXX0=