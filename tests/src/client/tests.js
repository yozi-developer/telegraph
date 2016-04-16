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
            const helloListener = (request)=> {
                request.response('world');
            };
            
            return (
                (async() => {
                    server.on('hello', helloListener);
                    const result = await client.callWithResult('hello');
                    server.removeListener('hello', helloListener);
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
                    server.on('sleep', lazyListener);
                    try {
                        await client.callWithResult('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    server.removeListener('sleep', lazyListener);
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
            const lazyListener = (request)=> {
                setTimeout(()=> {
                    request.response('I am sleep for 100 ms');
                }, 100);
            };
            return (
                (async() => {
                    let errOccurred = false;
                    server.on('sleep', lazyListener);
                    try {
                        await client.callWithResult('sleep', {timeout: 150});
                    } catch (err) {
                        errOccurred = true;
                    }
                    server.removeListener('sleep', lazyListener);
                    should(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
                })()
            );
        });

        it('Can call RPC without result', function () {

            const client = this.client;
            const server = this.server;

            return (
                (async() => {
                    await client.call('silence');

                    let silenceListener;
                    const requestResult = await new Promise((resolve)=>{
                        const timeoutTimer = setTimeout(()=>{
                            resolve(new Error('Timeout'));
                        }, 200);// wait up to 200 until the server receives the message

                        silenceListener = () => {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        };
                        server.on('silence', silenceListener);
                     
                    });

                    server.removeListener('silence', silenceListener);
                    should(requestResult).equal(true, 'Server does not receive request');
                })()
            );
        });
    });
}
