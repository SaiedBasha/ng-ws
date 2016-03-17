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
  - [License](#license)

# Introduction


**ng-ws** is a library that provides a provider to handle **HTML5 WebSocket** with aditional features

# Requirements

The only requirement needed is [AngularJS](https://angularjs.org/) that you can install it via [Bower](http://bower.io/).

# Installation

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
			url: 'ws://' + host + ':' + port + '?token=' + token,
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
			url: 'ws://' + host + ':' + port + '?token=' + token,
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
			url: 'ws://' + host + ':' + port + '?token=' + token,
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
			url: 'ws://' + host + ':' + port + '?token=' + token,
			reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: true
		}); // instance of ws, only the url is mandatory, others will be with default values
```


# API

ng-ws methods:

 - init
 - open
 - send
 - close
 - getState
 - updateConfig
 - queue
 - on
 - un
			
ng-ws events:

 - open
 - message
 - close
 - error
 

# License

Check out LICENSE file (MIT)
