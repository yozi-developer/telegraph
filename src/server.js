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
     * @param {string} host
     * @param {number} port
     * @param {Object} options see WsTgServer Options at https://github.com/socketio/engine.io#methods-1
     */
    static async create(host, port, options = {}) {
        debug('try create server');
        options.transports = options.transports || ['websocket'];
        const httpServer = http.createServer(function (req, res) {
            res.writeHead(501);
            res.end('Not Implemented');
        });

        const eioServer = new EioServer.Server(options);

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


        return new this(httpServer, eioServer);
    }

    constructor(httpServer, eioServer) {
        eioServer.attach(httpServer);

        this.eioServer = eioServer;
        this.httpServer = httpServer;

        this.eioServer.on('connection', (socket)=> {
            socket.on('message', this.onMessage.bind(this, socket));
        });
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
    async close() {
        debug('Perform server stop');
        this.eioServer.close();
        await new Promise((resolve, reject)=> {
            this.httpServer.close(()=> {
                debug('WsTgServer stopped, all connections closed');
                resolve();
            });
        });
    }
}
