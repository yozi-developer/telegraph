'use strict';

import 'source-map-support/register';
import Debug from 'debug';
import EioClient from 'engine.io-client';
const debug = new Debug('ws-telegraph:client');


/**
 * WsTgClient for Telegraph-server
 */
export class WsTgClient {
    /**
     * Create connection to WS-server and instantiate client with it
     * @param {Object} [options] - options for request
     * @param {number} [options.timeout=100] - ms
     * @returns {WsTgClient}
     */
    constructor(options = {}) {
        debug('try create client');
        this.options = Object.assign({}, options);
        this.options.timeout = options.timeout || 100;
    }

    /**
     * @param {string} host
     * @param {number} port

     */
    async start(host, port) {
        const url = `ws://${host}:${port}`;
        const eioClient = new EioClient(url, {transports: ['websocket']});
        this.eioClient = eioClient;
        this.callId = 0;

        await new Promise((resolve, reject) => {
            eioClient.on('open', () => {
                debug(`Connection successfully opened with url ${url}`);
                this.onOpen();
                return resolve();
            });
            eioClient.on('error', (err) => {
                debug('Can\'t open connection due error');
                this.onError();
                return reject(err);
            });

        });

        eioClient.on('message', ::this.onMessage);
    }


    /**
     * Generate new id for mark call
     * If id too big,  resets it to 1 again
     * @returns {number}
     */
    generateId() {
        if (this.callId === Number.MAX_SAFE_INTEGER) {
            this.callId = 0;
        }
        const newId = ++this.callId;
        debug(`Generated id: ${newId}`);
        return newId;
    }

    /**
     * Perform RPC and wait result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     * @return {*}
     */
    async callAndWait(method, ...args) {
        debug({event: 'WsTgClient callWithResult', method: method, args: args});
        const requestId = this.generateId();

        const request = JSON.stringify({
            id: requestId,
            call: method,
            args: args
        });
        await new Promise((resolve)=> {
            this.eioClient.send(request, {}, ()=> {
                debug('Call sent');
                return resolve();
            });
        });

        let listener; // ref to listener for possible removeListener
        const result = await new Promise((resolve)=> {
            const timeoutException = setTimeout(()=> {
                debug('CallWithResult response timeout');
                resolve(new Error('WsTgClientResponse timeout'));
            }, this.options.timeout);

            /**
             * @param {number} responseId
             * @param {*} responseResult
             * @returns {*}
             */
            listener = (responseId, responseResult)=> {
                if (responseId === requestId) {
                    debug('Response received');
                    clearTimeout(timeoutException);
                    return resolve(responseResult);
                }
            };

            this.eioClient.on('rpcResponse', listener);
        });

        this.eioClient.removeListener('rpcResponse', listener);
        if (result instanceof Error) {
            throw result;
        } else {
            return result;
        }
    }

    /**
     * Perform RPC without getting result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     */
    async call(method, ...args) {
        debug({event: 'WsTgClient call', method: method, args: args});
        const requestId = this.generateId();

        const request = JSON.stringify({
            id: requestId,
            call: method,
            args: args
        });
        await new Promise((resolve)=> {
            this.eioClient.send(request, {}, ()=> {
                debug('Call sent');
                return resolve();
            });
        });
    }

    /**
     * Called when opening a connection. There may be some kind of a server preparing.
     */
    onOpen() {
        debug('Called onOpen');
    }

    onError() {
        debug('Called onError');
    }

    /**
     * Handle response "message"
     * @param {string|*} data - data in json format
     * @fires EioClient#rpcResponse
     */
    onMessage(data) {
        debug({event: 'receive message', data: data});
        let errorOccurred = false;
        let requestId, responseResult;
        try {
            const parsedData = JSON.parse(data);
            requestId = parsedData.id;
            responseResult = parsedData.result;
            if (!requestId || !responseResult) {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong response received. Response must be in json format and have id and result fields',
                data: data
            });
            return;
        }

        debug('emit rpcResponse event');
        /**
         * RPC response event.
         *
         * @event EioClient#rpcResponse
         */
        this.eioClient.emit('rpcResponse', requestId, responseResult);
    }

    /**
     * Close connection with server
     * @note: async for consistency with the WsTgServer.close
     */
    async stop() {
        debug('Perform close connection');

        this.eioClient.close();
        delete this.eioClient;
    }
}

