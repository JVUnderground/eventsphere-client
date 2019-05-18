const net = require('net');
const DEFAULT_CB = () => {};

let client = new net.Socket();

let socketId;
const connect = async (port, host) => {
    return new Promise(resolve => {
        client.connect(port, host, async socket => {
            socketId = await handshake();
            resolve(socketId);
        });
    });
};

const disconnect = () => {
    client.destroy();
};

const send = message => {
    let serialData = JSON.stringify(message);
    client.write(serialData);
};

async function handshake() {
    return new Promise(resolve => {
        send({ type: 'handshake' });
        client.on('data', function onHandshake(message) {
            onHandshake = () => {};
            resolve(message.toString());
        });
    });
}

const socketedHandler = async handler => {
    client.on('data', message => {
        handler(socketId, message);
    });
};

module.exports = {
    connect,
    disconnect,
    send,
    socketedHandler
}