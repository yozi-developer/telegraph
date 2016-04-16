'use strict';
/*
 global describe: true, before: true, it: true, after: true
 */
import {Client} from '../../../lib/client';
import {Server} from '../../../lib/server';
import {runTests}  from './tests';
const port = process.env.PORT || 3000;

export function runServerTests() {
    describe('No-Cache', function () {
        before(function () {

            return (
                (async() => {
                    this.server = await  Server.create('localhost', port);
                    this.client = await  Client.create('localhost', port);
                })()
            );
        });

        runTests();

        after(function () {

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



