'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
 */
import {WsTgClient} from '../../../lib/client';
import {WsTgServer} from '../../../lib/server';
import {runTests}  from './tests';
const port = process.env.PORT || 3000;


export function runClientTests() {
    describe('No-Cache', function () {
        beforeEach(function () {
            return (
                (async() => {
                    this.server = await  WsTgServer.create('localhost', port);
                    this.client = await  WsTgClient.create('localhost', port);
                })()
            );

        });

        runTests();

        afterEach(function () {
            return (
                (async() => {
                    await this.client.close();
                    await this.server.close();
                })()
            );
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

