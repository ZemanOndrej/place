/**
 * Created by zeman on 11-Apr-17.
 */
(function () {
    "use strict";
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    let name = false;
    let selectedColor = false;
    let content = document.querySelector('#content');
    let input = document.querySelector('#input');
    let status = document.querySelector('#status');
    let submitName = document.querySelector('#submitName');
    let overlay = document.querySelector("#overlay");
    let socket = io('http://localhost:1337');
    let canvas = document.querySelector("canvas");
    let pixSize =50;
    let board = [];
    let context = canvas.getContext('2d');
    let mousePos = {x:0,y:0};



    let getMousePos = function (canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    let writeMessage = function (message) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '30px Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 500, 20);
    };


    submitName.addEventListener("click",()=>{
        name = input.value;
        input.setAttribute("disabled","disabled");
        overlay.style.visibility="hidden";
        submitName.setAttribute("disabled","disabled");
        socket.emit("start",{UserName:name});
    });

    canvas.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(canvas, evt);
    }, false);

    socket.on("connected", (data)=> {
        console.log("connected" );
        console.log(data);

        board = data.board;
        refreshCanvas();

        overlay.style.visibility="visible";
        input.removeAttribute("disabled");
        submitName.removeAttribute("disabled");
        status.innerHTML='Choose name:';
    });

    socket.on("error",  (error)=> {
        console.log("error");
        console.log(error);
    });

    socket.on("pixel",(data)=> {
        console.log(data + "pixel");
        board.push({ x:data.pixelX, y:data.pixelColor, author: data.author, time: data.time, pixelColor:data.pixelColor});
    });


    // canvas.addEventListener('click', ()=> {
    //
    // }, false);


    function refreshCanvas() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const width = canvas.width;
        const height = canvas.height;
        context.clearRect(0, 0, width, height);
        writeMessage('Mouse position: ' + mousePos.x + ',' + mousePos.y);

        board.forEach((rec)=>{
            context.fillStyle=rec.pixelColor;
            context.fillRect(rec.pixelX* pixSize,rec.pixelY*pixSize,pixSize,pixSize);
        });
        window.requestAnimationFrame(refreshCanvas);
    }

    refreshCanvas();


})();