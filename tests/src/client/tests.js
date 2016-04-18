'use strict';
/*
 global before: true, describe: true, it: true, context: true
 */

import should from 'should';

export function runTests() {
    describe('RPC', function () {
        it('Can call RPC', function () {
            /**
             * @type Client
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    server.onHello = function onHello(request) {
                        request.response('world');
                    };
                    const result = await client.callWithResult('hello');
                    delete server.onHello;
                    should(result).equal('world');
                })()
            );
        });

        it('Throw error on timeout', function () {
            /**
             * @type Client
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
                    server.onSleep = function onSleep(request) {
                        setTimeout(()=> {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    };
                    try {
                        await client.callWithResult('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    delete server.onSleep;
                    should(errOccurred).equal(true, 'No exception  was thrown');
                })()
            );
        });

        it('Can increase timeout limit', function () {
            /**
             * @type Client
             */
            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    let errOccurred = false;
                    server.onSleep = function onSleep(request) {
                        setTimeout(()=> {
                            request.response('I am sleep for 100 ms');
                        }, 100);
                    };
                    try {
                        await client.callWithResult('sleep', {timeout: 150});
                    } catch (err) {
                        errOccurred = true;
                    }
                    delete server.onSleep;
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

                        server.onSilence = function silence() {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        };

                        client.call('silence');
                    });

                    delete server.onSilence;
                    should(requestResult).equal(true, 'Server does not receive request');
                })()
            );
        });
    });
}
