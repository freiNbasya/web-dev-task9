const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
/*
Instruction:
    Basically just start the application and open http://localhost:4000/ in your browser.
    Open as many tabs as you want to have numerous clients chatting in the same time.
*/
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 4000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

let clientCount = 0;

wss.on('connection', function connection(ws) {
    clientCount++;
    const clientId = `User ${clientCount}`;

    console.log(`${clientId} connected`);

    ws.on('message', function incoming(message) {
        console.log(`${clientId} sent: ${message}`);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`${clientId}: ${message}`);
            }
        });
    });

    ws.on('close', function close() {
        console.log(`${clientId} disconnected`);
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
