'use strict';
/*
 global before: true, describe: true, it: true
 */

require('source-map-support/register');

var _client = require('./client');

var _server = require('./server');

describe('WsTgClient', function () {
    before(function () {
        const self = this;
    });

    (0, _client.runClientTests)();
});

describe('WsTgServer', function () {
    before(function () {
        const self = this;
    });

    (0, _server.runServerTests)();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ydW5uZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBUyxZQUFULEVBQXVCLFlBQVk7QUFDL0IsV0FBTyxZQUFZO0FBQ2YsY0FBTSxPQUFPLElBQVAsQ0FEUztLQUFaLENBQVAsQ0FEK0I7O0FBSy9CLGtDQUwrQjtDQUFaLENBQXZCOztBQVFBLFNBQVMsWUFBVCxFQUF1QixZQUFZO0FBQy9CLFdBQU8sWUFBWTtBQUNmLGNBQU0sT0FBTyxJQUFQLENBRFM7S0FBWixDQUFQLENBRCtCOztBQUsvQixrQ0FMK0I7Q0FBWixDQUF2QiIsImZpbGUiOiJydW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBiZWZvcmU6IHRydWUsIGRlc2NyaWJlOiB0cnVlLCBpdDogdHJ1ZVxuICovXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQge3J1bkNsaWVudFRlc3RzfSBmcm9tICAnLi9jbGllbnQnO1xuaW1wb3J0IHtydW5TZXJ2ZXJUZXN0c30gZnJvbSAgJy4vc2VydmVyJztcblxuZGVzY3JpYmUoJ1dzVGdDbGllbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgfSk7XG5cbiAgICBydW5DbGllbnRUZXN0cygpO1xufSk7XG5cbmRlc2NyaWJlKCdXc1RnU2VydmVyJywgZnVuY3Rpb24gKCkge1xuICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIH0pO1xuXG4gICAgcnVuU2VydmVyVGVzdHMoKTtcbn0pO1xuXG5cbiJdfQ==