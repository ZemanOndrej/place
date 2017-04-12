/**
 * Created by zeman on 11-Apr-17.
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
http.listen(port, "127.0.0.1",()=>console.log("app is listening on port:"+port));




/**
 Routes
 */


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/place.html'));

});

/**
 * Global variables
 */
let board = [];

const colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange', 'gray', 'black', 'white'];


/**
 * HTTP server
 */

/**
 * WebSocket server
 */



io.on('connection', function (socket) {
    console.log((new Date()) + ' Connection from origin ' + socket.request.connection.remoteAddress + '.');




    // let connection = request.accept(null, request.origin);
    // const index = clients.push(connection) - 1;


    let userName = false;
    let pixelColor = false;
    let pixelX = false;
    let pixelY=false;

    console.log((new Date()) + ' Connection accepted.');
    socket.emit("connected");


    socket.on("start",(message)=>{
        console.log(message.UserName);

    });


    socket.on('message',  (message)=> {
        console.log((new Date()) + ' Received pixel from ' + userName + ': ' + message.utf8Data);

        board.filter((x) => x.pixelX !== pixelX && x.pixelY !== pixelY);


        let obj = {
            time: (new Date()).getTime(),
            pixelX: pixelX,
            pixelY:pixelY,
            author: userName,
            pixelColor: pixelColor
        };

        board.push(obj);

        let json = JSON.stringify({type: 'message', data: obj});
        for (let i = 0; i < clients.length; i++) {
            clients[i].sendUTF(json);
        }


    });

    socket.on('disconnect', function (connection) {
        if (userName !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            clients.splice(index, 1);
        }
    });

});
