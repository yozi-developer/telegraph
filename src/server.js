'use strict';

import Debug from 'debug';
import {Server} from 'json-rpc2';
const debug = new Debug('ws-telegraph:server');

/**
 * Telegraph-server
 */
export class WsTgServer {
    /**
     * Create ws-server with provided settings
     * @see: Server from https://www.npmjs.com/package/json-rpc2
     */
    constructor() {
        debug('try create server');
        this.apiServer = Server.$create({
            'websocket': true,
            'headers': { // allow custom headers is empty by default
                'Access-Control-Allow-Origin': '*'
            }

        });
    }

    /**
     * Start server on port
     * @param {string} host
     * @param {number} port
     */
    async start(host, port) {
        this.httpServer = this.apiServer.listen(port, host);
    }

    /**
     * Close all connections and frees port
     */
    async stop() {
        debug('Perform server stop');
        await new Promise((resolve, reject)=> {
            this.httpServer.close(()=> {
                debug('WsTgServer stopped, all connections closed');
                delete this.httpServer;
                resolve();
            });
        });
    }

    /**
     * Expose method
     * @param {String} methodName
     * @param {Function} methodCallback
     */
    expose(methodName, methodCallback) {
        this.apiServer.expose(methodName, function (args, conn, callback) {
            methodCallback(args)
                .then((result)=> {
                    callback(null, result);
                })
                .catch((err)=> {
                    if(!(err instanceof Error)){
                        err = new Error(err);
                    }
                    callback(err, null);
                });
        });
    }
}
