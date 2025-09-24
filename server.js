const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let viewers = new Map(); // key: viewerId, value: ws connection

wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);

    // Broadcast offers/answers/candidates
    if(data.type === 'offer' || data.type === 'answer' || data.type === 'candidate') {
      if(viewers.has(data.id)) {
        viewers.get(data.id).send(message);
      }
    }

    // Register a viewer/admin
    if(data.type === 'register') {
      viewers.set(data.id, ws);
      console.log(`Registered: ${data.id}`);
    }

    // Save stream request
    if(data.type === 'saveStream') {
      const { name, timestamp, streamData } = data;
      const filename = `streams/${timestamp.replace(/[/,: ]/g,'-')}_${name}.webm`;
      const buffer = Buffer.from(streamData, 'base64');

      fs.writeFile(filename, buffer, err => {
        if(err) console.error("Error saving stream:", err);
        else console.log(`Stream saved: ${filename}`);
      });
    }
  });

  ws.on('close', () => {
    // Remove disconnected viewer
    for(const [id, conn] of viewers.entries()) {
      if(conn === ws) viewers.delete(id);
    }
  });
});

if(!fs.existsSync('streams')) fs.mkdirSync('streams');

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
