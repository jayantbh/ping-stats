const assert = require('assert');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8888;

const child = spawn('ping', ['8.8.8.8']);
const wss = new WebSocket.Server({ port: PORT });

child.stdout.setEncoding('utf8');
child.stdout.on('data', (data) => {
  // data = data.trim(); // just to strip the trailing newline after a ping command.
  wss.broadcast({ type: 'ping_response', data });
  console.log(data)
});

// Broadcast to all.
wss.broadcast = function broadcast(payload) {
  assert.ok(payload.data, 'Payload contains a `data` property.');
  assert.ok(payload.type, 'Payload contains a `type` property.');
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
};

wss.on('connection', function connection(ws) {
  console.log('client connected');
});