'use strict';

import 'source-map-support/register';
import Debug from 'debug';
import EioClient from 'engine.io-client';
const debug = new Debug('ws-telegraph:client');

/**
 * Represent incoming RPC-response
 */
class WsTgClientResponse {
    /**
     * @param socket - client socket
     * @param {string} method - rpc-method name
     * @param {string|number} requestId
     * @param {*} result
     */
    constructor(socket, method, requestId, result) {
        this.socket = socket;
        this.method = method;
        this.requestId = requestId;
        this.result = result;
    }
}
/**
 * WsTgClient for Telegraph-server
 */
export class WsTgClient {
    /**
     * Create connection to WS-server and instantiate client with it
     * @param {string} host
     * @param {number} port
     * @returns {WsTgClient}
     */
    static async create(host, port) {
        debug('try create client');
        const url = `ws://${host}:${port}`;
        const eioClient = new EioClient(url, {transports: ['websocket']});

        await new Promise((resolve, reject) => {
            eioClient.on('open', () => {
                debug(`Connection successfully opened with url ${url}`);
                return resolve();
            });
            eioClient.on('error', (err) => {
                debug('Can\'t open connection due error');
                return reject(err);
            });

        });

        return new this(eioClient);
    }
    
    /**
     *
     * @param eioClient
     * @param {Object} [options] - options for request
     * @param {number} [options.timeout=100] - ms
     */
    constructor(eioClient, options = {}) {
        this.eioClient = eioClient;
        this.options = options;
        this.options.timeout = options.timeout || 100;
        this.callId = 0;

        this.eioClient.on('message', this.onMessage.bind(this, eioClient));
    }


    /**
     * Generate new id for mark call
     * If id too big,  resets it to 1 again
     * @returns {number}
     */
    generateId() {
        if (this.callId > 1000000) {
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
    async callWithResult(method, ...args) {
        debug({event: 'WsTgClient callWithResult', method: method, args: args});
        const requestId = this.generateId();

        const request = JSON.stringify({
            id: requestId,
            method: method,
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
             * @param {WsTgClientResponse} response
             * @returns {*}
             */
            listener = (response)=> {
                if (response.requestId === requestId) {
                    debug('WsTgClientResponse received');
                    clearTimeout(timeoutException);
                    return resolve(response.result);
                }
            };

            this.eioClient.on('rpc_response', listener);
        });

        this.eioClient.removeListener('rpc_response', listener);
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
            method: method,
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
     * Handle response "message"
     * @param socket - connection with server
     * @param {string|*} data - data in json format
     */
    onMessage(socket, data) {
        debug({event: 'receive message', data: data});
        let errorOccurred = false;
        let requestId, requestMethod, responseResult;
        try {
            const parsedData = JSON.parse(data);
            requestId = parsedData.id;
            requestMethod = parsedData.method;
            responseResult = parsedData.result;
            if (!requestId || !responseResult) {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong response received. WsTgClientResponse must be in json format and have id and result fields',
                data: data
            });
            return;
        }

        const eventName = 'rpc_response';

        const response = new WsTgClientResponse(socket, requestMethod, requestId, responseResult);
        debug('emit rpc_response event');
        this.eioClient.emit(eventName, response);
    }

    /**
     * Close connection with server
     * @note: async for consistency with the WsTgServer.close
     */
    async close() {
        debug('Perform close connection');

        this.eioClient.close();
    }
}

