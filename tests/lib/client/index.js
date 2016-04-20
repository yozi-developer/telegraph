'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runClientTests = runClientTests;

var _tests = require('./tests');

function runClientTests() {
  describe('No-Cache', function () {
    (0, _tests.runTests)();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O1FBU2dCOztBQUhoQjs7QUFHTyxTQUFTLGNBQVQsR0FBMEI7QUFDN0IsV0FBUyxVQUFULEVBQXFCLFlBQVk7QUFDN0IsMkJBRDZCO0dBQVosQ0FBckI7Ozs7Ozs7OztBQUQ2QixDQUExQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8qXG4gZ2xvYmFsIGFmdGVyOiB0cnVlLCBhZnRlckVhY2g6IHRydWUsIGJlZm9yZTogdHJ1ZSwgIGJlZm9yZUVhY2gsIGl0OiB0cnVlLCBkZXNjcmliZTogdHJ1ZSwgcHJvY2VzczogdHJ1ZVxuICovXG5cblxuaW1wb3J0IHtydW5UZXN0c30gIGZyb20gJy4vdGVzdHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBydW5DbGllbnRUZXN0cygpIHtcbiAgICBkZXNjcmliZSgnTm8tQ2FjaGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJ1blRlc3RzKCk7XG4gICAgfSk7XG4gICAgLypcblxuICAgICBkZXNjcmliZSgnTWVtb3J5LUNhY2hlJywgZnVuY3Rpb24gKCkge1xuICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICB9KTtcblxuICAgICBydW5DbGllbnRUZXN0cygpO1xuICAgICB9KTtcblxuICAgICAqL1xufVxuXG4iXX0=