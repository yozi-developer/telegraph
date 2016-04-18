'use strict';
/*
 global before: true, describe: true, it: true
 */
import 'source-map-support/register';
import {runClientTests} from  './client';
import {runServerTests} from  './server';

describe('WsTgClient', function () {
    before(function () {
        const self = this;
    });

    runClientTests();
});

describe('WsTgServer', function () {
    before(function () {
        const self = this;
    });

    runServerTests();
});


