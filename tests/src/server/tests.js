'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true
 */
import {WsTgClient} from '../../../lib/client';
import {WsTgServer} from '../../../lib/server';
import should from 'should';
const port = process.env.PORT || 3000;


export function runTests() {
    describe('WsTgServer', function () {
        beforeEach(function () {

            return (
                (async() => {
                    this.server = new WsTgServer();
                    await this.server.start('localhost', port);
                    this.client = new WsTgClient();
                    await  this.client.start('localhost', port);
                })()
            );
        });

        afterEach(function () {

            return (
                (async() => {
                    await this.client.stop();
                    await this.server.stop();
                })()
            );
        });

    });
}
