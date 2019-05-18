const { connect, disconnect, send, socketedHandler } = require('./adaptors/socket');

const es = {};
es.connect = connect;
es.disconnect = disconnect;

es.on = async (event, handler) => {
    es.subscribe(event);
    socketedHandler((socketId, buffer) => {
        let message = JSON.parse(buffer.toString());
        if (message.hasOwnProperty('type')) {
            if (message.type === 'event') {
                handler.socketId = socketId;
                handler(message.data)
            }
        }
    });
};

es.subscribe = event => {
    send({ type: 'subscribe', data: { esid: event } });
};

es.publish = (event, data) => {
    send({ type: 'publish', data: { esid: event, data }});
};


module.exports = es;