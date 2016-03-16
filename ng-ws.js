'use strict';

(function () {


    function EventTarget() {
        this._handlers = {};
    }

    EventTarget.prototype = {
        constructor: EventTarget,

        on: function (event, handler) {
            if (typeof event !== 'string') {
                throw new Error('invalid event name');
            }
            if (typeof handler !== 'function') {
                throw new Error('handler not a function');
            }

            if (this._handlers[event] === undefined) {
                this._handlers[event] = [];
            }

            this._handlers[event].push(handler);
        },

        emit: function (event, args) {
            if (typeof event !== 'string') {
                throw new Error('invalid event name');
            }

            if (this._handlers[event] === undefined) {
                this._handlers[event] = [];
            }

            if (this._handlers[event] instanceof Array) {
                var handlers = this._handlers[event];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    if (typeof handlers[i] === 'function') {
                        handlers[i].call(this, args);
                    }
                }
            }
        },

        un: function (event, handler) {
            if (typeof event !== 'string') {
                throw new Error('invalid event name');
            }

            if (this._handlers[event] instanceof Array) {
                var _handlers = this._handlers[event];
                var len = _handlers.length;
                for (var i = 0; i < len; i++) {
                    if (_handlers[i] === handler) {
                        _handlers.splice(i, 1);
                        //break;
                    }
                }
            }
        },

        deleteAll: function () {
            for (var key in this._handlers) {
                // skip loop if the property is from prototype
                if (!this._handlers.hasOwnProperty(key)) {
                    continue;
                }

                delete this._handlers[key];
            }
        }
    };

    function ws() {
        var _defaultConfig = {
            url: null,
            reconnect: true,
            reconnectInterval: 2000,
            lazyOpen: false,
            protocols: null,
            enqueue: false
        };

        var _config = {};
        var _connection = null;
        var _READY_STATE = {
            NOT_INITIALIZED: -1, //	The connection not initialized.
            CONNECTING: 0, //The connection is not yet open.
            OPEN: 1, //The connection is open and ready to communicate.
            CLOSING: 2, //The connection is in the process of closing.
            CLOSED: 3  //The connection is closed or couldn't be opened.
        };

        var _reconnectInterval = null;
        var _queue = [];
        var _closedByUser = false;
        var _eventTarget = new EventTarget();
        var _notInitError = function () {
            throw new Error('not initialized config');
        };

        var init = function (config) {
            // delete all events
            _eventTarget.deleteAll();

            if (config === undefined || config == null ||
                config.url === undefined || config.url === null || config.url.length == 0) {
                throw new Error('url must be specified at the config');
            }

            _config = angular.extend({}, _defaultConfig, config);

            if (_defaultConfig.lazyOpen) {
                // delay openning connection
            } else {
                open(_config);
            }

            return ws;
        };

        var open = function () {
            if (getState() === _READY_STATE.OPEN || getState() === _READY_STATE.CONNECTING) {
                return;
            }

            _connection = new WebSocket(_config.url, _config.protocols);
            // When the connection is open
            _connection.onopen = function () {
                _closedByUser = false;
                // Clear interval
                if (_reconnectInterval) {
                    clearInterval(_reconnectInterval);
                    _reconnectInterval = null;
                }

                // Send queue messages to server
                if (_config.enqueue && _queue.length > 0) {
                    while (_queue.length > 0) {
                        if (getState() == _READY_STATE.OPEN) {
                            send(_queue.shift());
                        } else {
                            break;
                        }
                    }
                }

                emit('open');
            };

            // Log errors
            _connection.onerror = function (e) {
                emit('error', e);
            };

            // Log messages from the server
            _connection.onmessage = function (e) {
                emit('message', e);
            };

            // Log messages from the server
            _connection.onclose = function (e) {
                if (_config.reconnect && _closedByUser === false && (!_reconnectInterval)) {
                    _reconnectInterval = setInterval(function () {
                        open(_config);
                    }, _config.reconnectInterval);
                }

                if (!_reconnectInterval) {
                    emit('close', e);
                }
            };
        };

        var getState = function () {
            if (_connection === null || _connection === undefined) {
                return _READY_STATE.NOT_INITIALIZED;
            } else {
                return _connection.readyState;
            }
        };

        var send = function (data) {
            var state = getState();
            if (state == _READY_STATE.OPEN) {
                _connection.send(data);
            } else if (state == _READY_STATE.NOT_INITIALIZED) {
                _notInitError();
            } else {                
                if (_config.enqueue) {
                    queue.push(message);
                } else {
                    throw new Error('connection not open');
                }
            }
        };
        
        var close = function (shortCode, reason) {
            //check arguments
            if (getState() != _READY_STATE.CLOSED) {
                _closedByUser = true;
                if (arguments.length === 0) {
                    _connection.close();
                } else {
                    _connection.close(shortCode, reason);
                }
            }

            if (_reconnectInterval) {
                clearInterval(_reconnectInterval);
                _reconnectInterval = null;
            }
        };

        var updateConfig = function (config) {
            // close connection
            close();

            // init connection with new config
            init(config);
        };

        var on = function (event, handler) {
            _eventTarget.on(event, handler);
        };

        var un = function (event, handler) {
            _eventTarget.un(event, handler);
        };

        var emit = function (event, args) {
            _eventTarget.emit(event, args);
        };

        var ws = {
            init: init,
            open: function () {                
                close();
                _closedByUser = false;
                open();
            },
            send: send,
            close: close,
            getState: getState,
            updateConfig: updateConfig,
            queue: _queue,
            on: on,
            un: un
        };

        this.$get = function () {
            return ws;
        };
    };

    angular
        .module('ng-ws', [])
        .provider('$ws', ws);
})();