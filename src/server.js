import http from 'http';
// import WebSocket from 'ws';
import express from 'express';
import { Server } from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on('connection', (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit('welcome');
    });
    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => socket.to(room).emit('bye'));
    });
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', msg);
        done();
    });
});

// ws만 만들고 싶으면 http는 없어도 된다(선택사항)
// http서버 위에 Websocket서버를 만듬 -> 두 서버 모두 port3000에서 작동되도록

/*
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on('connection', (socket) => {
    sockets.push(socket);
    socket['nickname'] = 'Anonymous';
    console.log('Connected to Browser ✅');
    socket.on('close', () => console.log('Disconnected from the Browser ❌'));
    socket.on('message', (msg) => {
        const messageString = msg.toString('utf8');
        const message = JSON.parse(messageString);
        switch (message.type) {
            case 'new_message':
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
                break;
            case 'nickname':
                socket['nickname'] = message.payload;
                break;
            default: {
            }
        }
    });
});
*/

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
