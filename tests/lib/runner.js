'use strict';
/*
 global before: true, describe: true, it: true
 */

require('source-map-support/register');

var _client = require('./client');

var _server = require('./server');

describe('Client', function () {
    before(function () {
        const self = this;
    });

    (0, _client.runClientTests)();
});

describe('Server', function () {
    before(function () {
        const self = this;
    });

    (0, _server.runServerTests)();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ydW5uZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBUyxRQUFULEVBQW1CLFlBQVk7QUFDM0IsV0FBTyxZQUFZO0FBQ2YsY0FBTSxPQUFPLElBQVAsQ0FEUztLQUFaLENBQVAsQ0FEMkI7O0FBSzNCLGtDQUwyQjtDQUFaLENBQW5COztBQVFBLFNBQVMsUUFBVCxFQUFtQixZQUFZO0FBQzNCLFdBQU8sWUFBWTtBQUNmLGNBQU0sT0FBTyxJQUFQLENBRFM7S0FBWixDQUFQLENBRDJCOztBQUszQixrQ0FMMkI7Q0FBWixDQUFuQiIsImZpbGUiOiJydW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuIGdsb2JhbCBiZWZvcmU6IHRydWUsIGRlc2NyaWJlOiB0cnVlLCBpdDogdHJ1ZVxuICovXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQge3J1bkNsaWVudFRlc3RzfSBmcm9tICAnLi9jbGllbnQnO1xuaW1wb3J0IHtydW5TZXJ2ZXJUZXN0c30gZnJvbSAgJy4vc2VydmVyJztcblxuZGVzY3JpYmUoJ0NsaWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB9KTtcblxuICAgIHJ1bkNsaWVudFRlc3RzKCk7XG59KTtcblxuZGVzY3JpYmUoJ1NlcnZlcicsIGZ1bmN0aW9uICgpIHtcbiAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB9KTtcblxuICAgIHJ1blNlcnZlclRlc3RzKCk7XG59KTtcblxuXG4iXX0=