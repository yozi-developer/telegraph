'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
 */


import {runTests}  from './tests';

export function runServerTests() {
    describe('No-Cache', function () {
        runTests();
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



