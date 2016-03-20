ng-ws
============

**AngularJS HTML5 WebSocket** wrapper module for HTML5 WebSocket with aditional features!

# Index

  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
    - [Auto Reconnection](#reconnect)
    - [Lazy Open](#lazyOpen)
    - [Enqueue Unsent Messages](#enqueue)
  - [API](#api)
	- [Methods](#methods)
	 - [init](#init)
	 - [open](#open)
	 - [send](#send)
	 - [close](#close)
	 - [getState](#getState)
	 - [updateConfig](#updateConfig)
	 - [on](#on)
	 - [un](#un)
	- [Memders](#members)
	 - [queue](#queue)
	- [Events](#events)
	 - [open](#open)
	 - [message](#message)
	 - [close](#close)
	 - [error](#error)
  - [License](#license)

# Introduction


**ng-ws** is a library that provides a provider to handle **HTML5 WebSocket** with aditional features

# Requirements

The only requirement needed is [AngularJS](https://angularjs.org/) that you can install it via [Bower](http://bower.io/).

# Installation

Use [npm](https://www.npmjs.com/) to install this module:

```bash
$ npm install ng-ws
```

Use [Bower](http://bower.io/) to install this module:

```bash
$ bower install ng-ws
```

# Usage

After the [Installation](#installation), require it in your Angular application.

Firstly, in your `index.html`:

```html
<html>
    <head>
        <script src="bower_components/ng-ws/ng-ws.js"></script>
    </head>
</html>
```

or

```html
<html>
    <head>
        <script src="node_modules/ng-ws/ng-ws.js"></script>
    </head>
</html>
```

Then, in your Angular application definition (assumed `app.js`):

```javascript
    'use strict';

    angular.module('MyApp', ['ng-ws']);
```

Usage,

# Tutorial

```javascript
'use strict';

angular.module('MyApp', ['ng-ws'])
    .run(function ($ws) {
        var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		}); // instance of ws, only the url is mandatory, others will be with default values

        ws.on('open', function () {
            console.log('Connection open...');

            ws.send('message to server'); // send a message to the websocket server

            var data = {
                id: 1,
                text: 'message to server'
                details:[{
                    id: 11,
                    message: 'message to server 2'
                }, {
				    id: 12,
                    message: 'message to server 3'
				}]
            };

            ws.send(JSON.stringify(data);
			//or
			ws.send(JSON.stringify({ event: 'updateData', data: data }));
        });

        ws.on('message', function (message) { // when receiving message from server
            console.log('message from server with data:');
            console.log(message.data);
			//or if json format
			//console.log(JSON.parse(message.data));
        });

        ws.on('close', function (e) { // when connection closed
            console.log('connection closed...');
        });
    });
```

# Features

ng-ws has some aditional features

## reconnect

You don't have to reconnect manually if connection down for any reason, except closing by you for sure, for exmaple network down, server down, ..
Interval we keep trying to reconnect for you based on the configured reconnectInterval, till the connection opened

By default, reconnect is enabled, and default interval is 2000 milliseconds

```javascript
var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		}); // instance of ws, only the url is mandatory, others will be with default values
```

## lazyOpen

You can only initialize the connection and open the connection later, or switching between close and open.
By default, lazyOpen is disabled

```javascript
var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: true,
            protocols: null,
            enqueue: false
		}); // instance of ws, only the url is mandatory, others will be with default values
		
	//ws.open();
	//ws.close();
```

## enqueue

Incase connection not openned, the sent message to server will be queued [MEMORY] till the connection is open, messages will be flushed to server autimaticlly
By default, enqueue is disabled

```javascript
var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: true
		}); // instance of ws, only the url is mandatory, others will be with default values
```


# API

## methods:

### init

initialize websocket instance with custom configuration, only the 'url' is mandatory, other fields are optionals:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
});
```

**Usage**

```javascript
$ws.init({
	url: 'ws://someUrl',
	reconnect: true,
	reconnectInterval: 2000,
	lazyOpen: false,
	protocols: null,
	enqueue: false
});
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
| config    | Object   | ws configuration |

**Returns**

| **Type** | **Details** |
| -------- | ----------- |
| ws | the websocket wrapper |

### open

open websocket instance connection if the connection closed or if you used 'lazyOpen' in 'init' method:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	ws.open();
});
```

**Usage**

```javascript
ws.open();
```

### send

send data to websocket server:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	ws.send('some data');
});
```

**Usage**

```javascript
ws.send('some data');
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
|   data    | String or ArrayBuffer or Blob   | data to be sent to server |

### close

close websocket connection:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	ws.close();
});
```

**Usage**

```javascript
ws.close(code, reason);
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
|   code    | unsigned short   | An optional numeric value indicating the status code explaining why the connection is being closed, [status codes](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes) |
|   reason    | string   | An optional human-readable string explaining why the connection is closing |

### getState

get websocket state:

| **value** | **Details** |
| --------- | ----------- |
|    -1     | NOT_INITIALIZED |
|     0     | CONNECTING      |
|     1     | OPEN            |
|     2     | CLOSING         |
|     3     | CLOSED          |


```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	var state = ws.getState();
});
```

**Usage**

```javascript
var state = ws.getState();
```

**Returns**

| **Type** | **Details** |
| -------- | ----------- |
| int | websocket connection state |


### updateConfig

update configuration, this will close the connection and initialize it with new config:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	ws.updateConfig({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 500,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
});
```

**Usage**

```javascript
ws.updateConfig({
	url: 'ws://someUrl',
	reconnect: true,
	reconnectInterval: 500,
	lazyOpen: false,
	protocols: null,
	enqueue: false
});
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
| config    | Object   | ws configuration |

### on

Attach a handler to  an event:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	ws.on('open', function(){
		console.log('Connection open ...');
	});
});
```

**Usage**

```javascript
ws.on('eventName', function(e) { ; });
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
| eventName | String   | event name  |
| handler   | Function | event handler  function |

### un

Unattach handler from event

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
		});
		
	var onOpen = function(e) {
	};
	
	ws.on('open', onOpen);
	
	ws.un('open', onOpen);
});
```

**Usage**

```javascript
ws.un('eventName', function(){ ; });
```

**Arguments**

| **Param** | **Type** | **Details** |
| --------- | -------- | ----------- |
| eventName | String   | event name  |
| handler   | Function | event handler  function |

## Memders

### queue

the unset data to the server, in case enqueue config value enabled and the connection not open:

```javascript
angular.config(function ($ws) {
    var ws = $ws.init({
			url: 'ws://someUrl',
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: true
		});
	
	console.log(ws.queue.length);
});
```

**Usage**

```javascript
ws.queue;
```

**Description**

| **Type** | **Details** |
| -------- | ----------- |
| Array | un sent messages to server |


			
## events:

HTML5 WebSocket [events] (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

### open

An event listener to be called when the WebSocket connection's readyState changes to OPEN; this indicates that the connection is ready to send and receive data. The event is a simple one with the name "open".

### message

An event listener to be called when a message is received from the server. The listener receives a MessageEvent named "message".

### close

An event listener to be called when the WebSocket connection's readyState changes to CLOSED. The listener receives a CloseEvent named "close".

### error

An event listener to be called when an error occurs. This is a simple event named "error".

# License

Check out LICENSE file (MIT)
