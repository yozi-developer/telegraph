'use strict';

import 'source-map-support/register';
import Debug from 'debug';
import EioServer from 'engine.io';
import http from 'http';
const debug = new Debug('ws-telegraph:server');

/**
 * Represent incoming RPC-request
 */
class WsTgServerRequest {
    /**
     * @param socket - client socket
     * @param {string} method - rpc-method name
     * @param {string|number} requestId
     * @param {[]} args
     */
    constructor(socket, method, requestId, args) {
        this.socket = socket;
        this.method = method;
        this.requestId = requestId;
        this.args = args;
    }

    /**
     * Send response
     * @param {*} data
     */
    response(data) {
        const payload = {
            id: this.requestId,
            method: this.method,
            result: data
        };
        this.socket.send(JSON.stringify(payload));
    }
}
/**
 * Telegraph-server
 */
export class WsTgServer {
    /**
     * Create ws-server with provided settings

     * @param {Object} options see Server Options at https://github.com/socketio/engine.io#methods-1
     */
    constructor(options = {}) {
        debug('try create server');
        this.options = Object.assign({}, options);
        options.transports = this.options.transports || ['websocket'];
    }

    /**
     * Start server on port
     * @param {string} host
     * @param {number} port
     */
    async start(host, port) {
        const httpServer = http.createServer(function (req, res) {
            res.writeHead(501);
            res.end('Not Implemented');
        });
        const eioServer = new EioServer.Server(this.options);
        await new Promise((resolve, reject)=> {
            httpServer.listen({host, port}, function () {
                debug(`Server started successfully at ${host}:${port}`);
                return resolve();
            });
            httpServer.on('error', (err) => {
                debug('Can\'t start httpServer due error');
                return reject(err);
            });
        });
        eioServer.attach(httpServer);
        eioServer.on('connection', (socket)=> {
            socket.on('message', this.onMessage.bind(this, socket));
        });

        this.httpServer = httpServer;
        this.eioServer = eioServer;
    }

    /**
     * Handle "message" event and call handler if it exist
     * @param socket - connection with client
     * @param {string|*} data - data in json format
     */
    onMessage(socket, data) {
        let errorOccurred = false;
        let messageId, messageMethod, messageArgs;
        try {
            const parsedData = JSON.parse(data);
            messageId = parsedData.id;
            messageMethod = parsedData.method;
            messageArgs = parsedData.args || [];
            if (!messageId || !messageMethod) {
                errorOccurred = true;
            }
        } catch (err) {
            errorOccurred = true;
        }
        if (errorOccurred) {
            debug({
                event: 'Wrong data received. Data must be in json format and have id and method fields',
                data: data
            });
            return;
        }

        const request = new WsTgServerRequest(socket, messageMethod, messageId, messageArgs);
        const handlerName = `on${messageMethod.charAt(0).toUpperCase()}${messageMethod.slice(1)}`;
        const handler = this[handlerName];
        if (typeof handler === 'function') {
            handler(request);
        }
    }

    /**
     * Close all connections and frees port
     */
    async stop() {
        debug('Perform server stop');
        this.eioServer.close();
        delete this.eioServer;
        await new Promise((resolve, reject)=> {
            this.httpServer.close(()=> {
                debug('WsTgServer stopped, all connections closed');
                delete this.httpServer;
                resolve();
            });
        });
    }
}
