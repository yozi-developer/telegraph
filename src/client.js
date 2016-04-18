'use strict';

import 'source-map-support/register';
import Debug from 'debug';
import EioClient from 'engine.io-client';
const debug = new Debug('ws-telegraph:client');

/**
 * Represent incoming RPC-response
 */
class TgResponse {
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
 * Client for Telegraph-server
 */
export class Client  {
    /**
     * Create connection to WS-server and instantiate client with it
     * @param {string} host
     * @param {number} port
     * @returns {Client}
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

    constructor(eioClient) {
        this.eioClient = eioClient;
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
     * @param {{timeout: number}} [options]
     * @param {{}} [args]  arguments for remote procedure
     * @return {*}
     */
    async callWithResult(method, options = {}, args) {
        debug({event: 'Client callWithResult', method: method, options: options, args: args});
        options.timeout = options.timeout || 50; // 50 ms
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
                resolve(new Error('TgResponse timeout'));
            }, options.timeout);

            /**
             * @param {TgResponse} response
             * @returns {*}
             */
            listener = (response)=> {
                if (response.requestId === requestId) {
                    debug('TgResponse received');
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
     * @param {{}} [args]  arguments for remote procedure
     */
    async call(method, args){
        debug({event: 'Client call', method: method, args: args});
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
                event: 'Wrong response received. TgResponse must be in json format and have id and result fields',
                data: data
            });
            return;
        }

        const eventName = 'rpc_response';

        const response = new TgResponse(socket, requestMethod, requestId, responseResult);
        debug('emit rpc_response event');
        this.eioClient.emit(eventName, response);
    }

    /**
     * Close connection with server
     * @note: async for consistency with the server.close
     */
    async close() {
        debug('Perform close connection');

        this.eioClient.close();
    }
}

