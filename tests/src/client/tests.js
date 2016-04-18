'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true, 

 */

import should from 'should';

export function runTests() {
    describe('RPC', function () {
        it('Can call RPC', function () {
            /**
             * @type WsTgClient
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    server.onHello = async function onHello(request) {
                        request.response('world');
                    };
                    const result = await client.callWithResult('hello');
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
            const lazyListener = (request)=> {
                setTimeout(()=> {
                    request.response('I am sleep for 100 ms');
                }, 100);
            };
            return (
                (async() => {
                    let errOccurred = false;
                    server.onSleep = async function onSleep(request) {
                        setTimeout(()=> {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    };
                    try {
                        await client.callWithResult('sleep');
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

                    server.onSleep = async function onSleep(request) {
                        setTimeout(()=> {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    };
                    client.options.timeout = 150;

                    try {
                        await client.callWithResult('sleep');
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
