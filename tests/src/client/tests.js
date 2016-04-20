'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true, 
 */

import {WsTgClient} from '../../../lib/client';
import {WsTgServer} from '../../../lib/server';
import should from 'should';
const port = process.env.PORT || 3000;

export function runTests() {

    describe('Initialization', function () {
        it('Client onOpen called', function () {
            return (
                (async() => {
                    const server = new WsTgServer();
                    await server.start('localhost', port);
                    let onOpenCalled = false;
                    const ExtendedClient = class ExtendedClient extends WsTgClient{
                        onOpen(){
                            super.onOpen();
                            onOpenCalled = true;
                        }
                    };
                    const client = new ExtendedClient();

                    await  client.start('localhost', port);
                    await  client.stop();
                    await  server.stop();

                    should(onOpenCalled).be.true();
                })()
            );
        });
    });
    describe('RPC', function () {
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
        it('Can call RPC', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    server.onHello = async function onHello() {
                        return 'world';
                    };
                    const result = await client.callAndWait('hello');
                    should(result).equal('world');
                })()
            );
        });

        it('Throw error on timeout', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    let errOccurred = false;
                    server.onSleep = async function onSleep() {
                        return await new Promise((resolve)=>{
                            setTimeout(()=> {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    };
                    try {
                        await client.callAndWait('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    should(errOccurred).equal(true, 'No exception  was thrown');
                })()
            );
        });

        it('Can increase timeout limit', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    let errOccurred = false;

                    server.onSleep = async function onSleep() {
                        return await new Promise((resolve)=>{
                            setTimeout(()=> {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    };
                    client.options.timeout = 150;

                    try {
                        await client.callAndWait('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    should(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
                })()
            );
        });

        it('Can call RPC without result', function () {
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    const requestResult = await new Promise((resolve)=> {
                        const timeoutTimer = setTimeout(()=> {
                            resolve(new Error('Timeout'));
                        }, 200);// wait up to 200 until the server receives the message

                        server.onSilence = async function silence() {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        };

                        client.call('silence');
                    });

                    should(requestResult).equal(true, 'WsTgServer does not receive request');
                })()
            );
        });
    });
}
