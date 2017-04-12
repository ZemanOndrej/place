/**
 * Created by zeman on 11-Apr-17.
 */
(function () {
    "use strict";
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    let name = false;
    let content = document.querySelector('#content');
    let input = document.querySelector('#input');
    let status = document.querySelector('#status');
    let submitName = document.querySelector('#submitName');





    let socket = io('http://localhost:1337');

    submitName.addEventListener("click",()=>{

        name = input.value;
        console.log(name);
        input.setAttribute("disabled","disabled");
        submitName.setAttribute("disabled","disabled");
        socket.emit("start",{UserName:name});
    });

    socket.on("connected",function () {
        input.removeAttribute("disabled");
        submitName.removeAttribute("disabled");
        status.innerHTML='Choose name:';
    });



    socket.on("error", function (error) {
        console.log("error");
        console.log(error);
    });

    socket.on("message",function (message) {
        let json ;
        // try {
        //     json = JSON.parse(message.data);
        // } catch (e) {
        //     console.log('This doesn\'t look like a valid JSON: ', message.data);
        //     return;
        // }
        //
        //
        // if (json.type === 'init') {
        //     status.text(name + ': ');
        //     input.removeAttr('disabled').focus();
        //
        // } else if (json.type === 'message') {
        //
        //     input.removeAttr('disabled');
        //     board.push({ x:json.data.pixelX,y:json.data.pixelColor,author: json.data.author, time: json.data.time,pixelColor:json.data.pixelColor});
        //
        //
        //
        // } else {
        //     console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        // }
    });






    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    let pixSize =50;
    let board = [];


    refreshCanvas();

    function refreshCanvas() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const width = canvas.width;
        const height = canvas.height;

        context.fillStyle="#000000";
        context.fillRect(0, 0, width, height);
        context.fillStyle="#ffffff";
        board.forEach((rec)=>{
            context.fillRect(rec.pixelX* pixSize,rec.pixelY*pixSize,pixSize,pixSize);
        });


        window.requestAnimationFrame(refreshCanvas);

    }


})();