/**
 * Created by zeman on 11-Apr-17.
 */


/**
 * Server Init
 */
"use strict";
process.title = 'node-place';

const port = 1337;
let express = require('express');
let path = require('path');

let app = express();
app.use(express.static(path.join(__dirname, 'public')));

let http = require('http').Server(app);
let io = require('socket.io')(http);
http.listen(port, "127.0.0.1", () => console.log("app is listening on port:" + port));


/**
 Routes
 */


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/place.html'));

});

/**
 * Global variables
 */
const colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange', 'gray', 'black', 'white'];

let board = [];

const boardWidth = 20;
const boardHeight = 20;

for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
        board.push({
            time: (new Date()).getTime(),
            pixelX: x,
            pixelY: y,
            author: "default",
            pixelColor: "white"
        });
    }
}


/**
 * WebSocket Listener
 */
io.on('connection', function (socket) {
    console.log((new Date()) + ' Connection from origin ' + socket.request.connection.remoteAddress + '.');
    console.log((new Date()) + ' Connection accepted.');
    socket.emit("connected", {board: board});

    socket.on('pixel', (pixel) => {
        console.log((new Date()) + ' Received pixel from ' + pixel.author + ': ' + pixel);

        board = board.filter((item) => !((item.pixelX === pixel.pixelX) && (item.pixelY === pixel.pixelY)));
        let obj = {
            time: (new Date()).getTime(),
            pixelX: pixel.pixelX,
            pixelY: pixel.pixelY,
            author: pixel.author,
            pixelColor: pixel.pixelColor
        };
        board.push(obj);
        console.log(board.length);
        socket.emit("pixel", {pixel: obj});
    });

    socket.on('disconnect', function (connection) {
    });
});
