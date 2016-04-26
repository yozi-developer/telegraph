# WS-Telegraph

This is a simple set of scripts that implement RPC over WebSocket. As communication layer
used  <https://www.npmjs.com/package/json-rpc2>

# User Guide

The package provides two classes: WsTgServer and WsTgClient.

```javascript
const WsTgClient = require('ws-telegraph').WsTgClient;
const WsTgServer = require('ws-telegraph').WsTgServer;

class Server extend  WsTgServer {
    constructor(){
        super();
        this.expose('hello', this.onHello.bind(this));
    }
    onHello(userName){
        return new Promise((resolve)=>{
            return resolve(`Hello, ${userName}`);
        });
    }
}

class Client extent WsTgClient {
    callHello(userName){
        return this.call('hello', 'Bob'); // Promise with result "Hello, Bob"
    }
}
```

# Tests

`npm run test`.  The default port of the server is 3000, if not set another by `process.env.PORT`.
