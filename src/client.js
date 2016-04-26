'use strict';

import {Client} from 'json-rpc2';
import Debug from 'debug';
const debug = new Debug('ws-telegraph:client');


/**
 * WsTgClient for Telegraph-server
 */
export class WsTgClient {
    constructor() {
        debug('try create client');
    }

    /**
     * @param {string} host
     * @param {number} port

     */
    async start(host, port) {
        debug('Client call start');
        this.apiClient = Client.$create(port, host);
        debug({apiClient: this.apiClient});
        this.apiConn = await new Promise((resolve, reject)=> {
            
            this.apiClient.connectWebsocket((err, conn)=> {
                debug({err: err, conn: conn});
                if (err) {
                    return reject(err);
                }
                if(!conn){
                    return reject(new Error('Client connection don\'t opened'));
                }
                return resolve(conn);
            });
        });
        this.apiConn.conn.on('error', ()=>{
            
        });
    }

    async stop() {
        debug('Client call stop');
        this.apiConn.conn.close();
    }

    /**
     * Perform RPC and wait result
     * @param {string} method - method name
     * @param {...{}} [args]  arguments for remote procedure
     * @return {*}
     */
    async call(method, ...args) {
        debug({event: 'WsTgClient call', method: method, args: args});
        return await new Promise((resolve, reject)=> {
            this.apiConn.call(method, args, (err, result)=> {
                if (err) {
                    if(!(err instanceof Error)){
                        err = new Error(err);
                    }
                    return reject(err);
                }
                return resolve(result);
            });
        });

    }
}

