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
        before(function () {
            return (
                (async() => {
                    this.server = new WsTgServer();
                    await this.server.start('localhost', port);
                    this.client = new WsTgClient();
                    await  this.client.start('localhost', port);
                })()
            );

        });
        after(function () {
            return (
                (async() => {
                    await this.client.stop();
                    await this.server.stop();
                })()
            );
        });
        it('Can call RPC', function () {
            return (
                (async() => {
                    this.server.onHello = async function onHello() {
                        return 'world';
                    };
                    const result = await this.client.callAndWait('hello');
                    delete this.server.onHello;
                    should(result).equal('world');
                })()
            );
        });

        it('Can call RPC with void result', function () {
            return (
                (async() => {
                    this.server.onVoid = async function onVoid() {
                    };
                    const result = await this.client.callAndWait('void');
                    delete this.server.onVoid;
                    should(result).be.undefined();
                })()
            );
        });


        it('Throw error on timeout', function () {
            return (
                (async() => {
                    let errOccurred = false;
                    this.server.onSleep = async function onSleep() {
                        return await new Promise((resolve)=>{
                            setTimeout(()=> {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    };
                    try {
                        await this.client.callAndWait('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    delete this.server.onSleep;
                    should(errOccurred).equal(true, 'No exception  was thrown');
                })()
            );
        });

        it('Can increase timeout limit', function () {
            return (
                (async() => {
                    let errOccurred = false;

                    this.server.onSleep = async function onSleep() {
                        return await new Promise((resolve)=>{
                            setTimeout(()=> {
                                resolve('I am sleep for 100 ms');
                            }, 100);
                        });
                    };
                    this.client.options.timeout = 150;

                    try {
                        await this.client.callAndWait('sleep');
                    } catch (err) {
                        errOccurred = true;
                    }
                    delete this.server.onSleep;
                    should(errOccurred).equal(false, 'Exception  was thrown even with increased timeout limit');
                })()
            );
        });

        it('Can call RPC without result', function () {
            return (
                (async() => {
                    const requestResult = await new Promise((resolve)=> {
                        const timeoutTimer = setTimeout(()=> {
                            resolve(new Error('Timeout'));
                        }, 200);// wait up to 200 until the server receives the message

                        this.server.onSilence = async function silence() {
                            clearTimeout(timeoutTimer);
                            resolve(true);
                        };

                        this.client.call('silence');
                    });

                    delete this.server.onSilence;
                    should(requestResult).equal(true, 'WsTgServer does not receive request');
                })()
            );
        });
    });
}
