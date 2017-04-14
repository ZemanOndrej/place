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

let board = [
    {
        time: (new Date()).getTime(),
        pixelX: 0,
        pixelY: 0,
        author: "test",
        pixelColor: colors[1]
    },
    {
        time: (new Date()).getTime(),
        pixelX: 1,
        pixelY: 1,
        author: "test2",
        pixelColor: colors[0]
    },

    {
        time: (new Date()).getTime(),
        pixelX: 4,
        pixelY: 5,
        author: "test2",
        pixelColor: colors[2]
    }

];


/**
 * WebSocket Listener
 */
io.on('connection', function (socket) {
    console.log((new Date()) + ' Connection from origin ' + socket.request.connection.remoteAddress + '.');
    console.log((new Date()) + ' Connection accepted.');
    socket.emit("connected", {board: board});

    socket.on('pixel', (pixel) => {
        console.log((new Date()) + ' Received pixel from ' + pixel.author + ': ' + pixel);
        // board = board.filter((x) => (x.pixelX !== pixel.pixelX) && (x.pixelY !== pixel.pixelY));
        for(let i = 0;i<board.length;i++){
            if(board[i].pixelY===pixel.pixelY && board[i].pixelX === pixel.pixelX){
                board.remove(i);
                break;
            }
        }
        console.log(board.length);
        let obj = {
            time: (new Date()).getTime(),
            pixelX: pixel.pixelX,
            pixelY: pixel.pixelY,
            author: pixel.author,
            pixelColor: pixel.pixelColor
        };
        board.push(obj);
        socket.emit("pixel", {pixel: obj});
    });

    socket.on('disconnect', function (connection) {
    });
});
