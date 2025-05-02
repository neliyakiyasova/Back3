const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7070 });


let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Новое подключение');

    ws.on('message', (message) => {
        const text = message.toString();
        console.log('Получено сообщение:', text);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Клиент отключился');
    });
});

console.log("WebSocket сервер запущен на порту 7070");
