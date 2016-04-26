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
//# sourceMappingURL=index.js.map