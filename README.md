# WS-Telegraph

This is a simple set of scripts that implement RPC over WebSocket. As communication layer
used engine.io library.

# User Guide

The package provides two classes: WsTgServer and WsTgClient.

WsTgServer based on Engine.IO and processes requests. WsTgClient provides a way  
to invoke methods on the server through websocket and obtains the result of the call.

## Old js-style
```javascript
const WsTgClient = require('ws-telegraph').WsTgClient;
const WsTgServer = require('ws-telegraph').WsTgServer;

class Server extend  WsTgServer {
    onHello(userName){
        return new Promise((resolve)=>{
            return resolve(`Hello, ${userName}`);
        });
    }
}

class Client extent WsTgClient {
    callHello(userName){
        return this.callAndWait('hello', 'Bob'); // Promise with result "Hello, Bob"
    }
}
```

## With Babel

```javascript
import {WsTgClient, WsTgServer} from 'ws-telegraph';

class Server extend  WsTgServer {
    async onHello(userName){
        return `Hello, ${userName}`;
    }
}

class Client extent WsTgClient {
    async callHello(userName){
        return await this.callAndWait('hello', 'Bob'); 
    }
}
```

# TODO

* Error handling

# Tests

`npm run test`.  The default port of the server is 3000, if not set another by `process.env.PORT`.
