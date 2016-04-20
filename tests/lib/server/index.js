'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runServerTests = runServerTests;

var _tests = require('./tests');

function runServerTests() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O1FBUWdCOztBQUZoQjs7QUFFTyxTQUFTLGNBQVQsR0FBMEI7QUFDN0IsV0FBUyxVQUFULEVBQXFCLFlBQVk7QUFDN0IsMkJBRDZCO0dBQVosQ0FBckI7Ozs7Ozs7OztBQUQ2QixDQUExQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8qXG4gZ2xvYmFsIGFmdGVyOiB0cnVlLCBhZnRlckVhY2g6IHRydWUsIGJlZm9yZTogdHJ1ZSwgIGJlZm9yZUVhY2gsIGl0OiB0cnVlLCBkZXNjcmliZTogdHJ1ZSwgcHJvY2VzczogdHJ1ZVxuICovXG5cblxuaW1wb3J0IHtydW5UZXN0c30gIGZyb20gJy4vdGVzdHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuU2VydmVyVGVzdHMoKSB7XG4gICAgZGVzY3JpYmUoJ05vLUNhY2hlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBydW5UZXN0cygpO1xuICAgIH0pO1xuICAgIC8qXG5cbiAgICAgZGVzY3JpYmUoJ01lbW9yeS1DYWNoZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgfSk7XG5cbiAgICAgcnVuQ2xpZW50VGVzdHMoKTtcbiAgICAgfSk7XG5cbiAgICAgKi9cbn1cblxuXG5cbiJdfQ==