'use strict';
/*
 global after: true, afterEach: true, before: true,  beforeEach, it: true, describe: true, process: true, 
 */

import {WsTgClient} from '../../../lib/client';
import {WsTgServer} from '../../../lib/server';
import should from 'should';
const port = process.env.PORT || 3000;

export function runTests() {
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
                    this.server.expose('hello', async function onHello() {
                        return 'world';
                    });
                    const result = await this.client.call('hello');
                    should(result).equal('world');
                })()
            );
        });

        it('Can call RPC with positional arguments', function () {
            return (
                (async() => {
                    this.server.expose('hello2', async function onHello2(name) {
                        return `Hello, ${name}`;
                    });
                    const result = await this.client.call('hello2', 'Yozi');

                    should(result).be.equal('Hello, Yozi');
                })()
            );
        });

        it('Throw error for undefined method', function () {
            return (
                (async() => {
                    let errorRaised = false;
                    await this.client.call('undefined')
                        .catch(()=> {
                            errorRaised = true;
                        });
                    should(errorRaised).be.true();
                })()
            );
        });

        it('Throw error for broken method', function () {
            return (
                (async() => {
                    let error = null;
                    this.server.expose('broken', async function onBroken() {
                        throw new Error('I am broken');
                    });
                    await this.client.call('broken')
                        .catch((err)=> {
                           error = err;
                        });
                    should(error).be.instanceof(Error);
                    should(error.message).be.equal('Error: I am broken');
                })()
            );
        });
    });
}
