/**
 * Created by zeman on 11-Apr-17.
 */
(function () {
    /**
     * Init page
     */
    "use strict";
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    let name = false;
    let content = document.querySelector('#content');
    let input = document.querySelector('#input');
    let status = document.querySelector('#status');
    let submitName = document.querySelector('#submitName');
    let overlay = document.querySelector("#overlay");
    let overlayShade = document.querySelector("#overlayShade");
    let colorPicker = document.querySelector("#colorPicker");
    let socket = io('http://localhost:1337');
    let canvas = document.querySelector("canvas");
    let pixSize = 50;
    let board = [];
    let context = canvas.getContext('2d');
    let mousePos = {x: 0, y: 0};
    const colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange', 'gray', 'black', 'white'];
    let selectedColor = false;
    overlayShade.width = window.innerWidth;
    overlayShade.height = window.innerHeight;
    colors.forEach((color) => {
        let newColor = document.createElement("div");
        newColor.id = color + "ColorPicker";
        newColor.classList.add(color);
        newColor.classList.add("color");
        newColor.style.backgroundColor = color;
        newColor.addEventListener("click", (event) => {
            let div = colorPicker.querySelector("." + event.target.classList[0]);

            if (selectedColor !== false) {
                let oldColor = colorPicker.querySelector("." + selectedColor);
                oldColor.style.border = "solid 2px black"

            }
            div.style.border = " white 2px solid";
            selectedColor = event.target.classList[0];

        });
        colorPicker.appendChild(newColor);


    });

    /**
     *  Functions
     */

    let getMousePos = function (evt) {
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

    let refreshCanvas = function () {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const width = canvas.width;
        const height = canvas.height;
        context.clearRect(0, 0, width, height);
        writeMessage('Mouse position: ' + mousePos.x + ',' + mousePos.y);

        board.forEach((rec) => {
            context.fillStyle = rec.pixelColor;
            context.fillRect(rec.pixelX * pixSize, rec.pixelY * pixSize, pixSize, pixSize);
        });
        window.requestAnimationFrame(refreshCanvas);
    };


    /**
     * Event Listeners
     */

    submitName.addEventListener("click", () => {
        name = input.value;
        input.setAttribute("disabled", "disabled");
        overlayShade.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
        submitName.setAttribute("disabled", "disabled");
    });

    canvas.addEventListener('mousemove', function (evt) {
        mousePos = getMousePos(evt);
    }, false);

    canvas.addEventListener('click', (event) => {
        if (selectedColor !== false) {
            socket.emit("pixel", {
                pixelColor: selectedColor,
                author: name,
                pixelX: Math.floor(event.clientX / 50),
                pixelY: Math.floor(event.clientY / 50)
            });
            // console.log({pixelColor:selectedColor,author:name,pixelX:event.clientX/50, pixelY:event.clientY/50});
        }
    }, false);

    /**
     * Socket listeners
     */

    socket.on("connected", (data) => {
        console.log("connected");
        board = data.board;
        overlay.style.visibility = "visible";
        overlayShade.style.visibility = "visible";
        input.removeAttribute("disabled");
        submitName.removeAttribute("disabled");
        status.innerHTML = 'Choose name:';
    });

    socket.on("error", (error) => {
        console.log("error");
        console.log(error);
    });

    socket.on("pixel", (data) => {
        // console.log(data);
        let pixel = {
            pixelX: data.pixel.pixelX,
            pixelY: data.pixel.pixelY,
            author: data.pixel.author,
            time: data.pixel.time,
            pixelColor: data.pixel.pixelColor
        };
        console.log(pixel);
        board.push(pixel);

    });


    /**
     * Start
     */

    refreshCanvas();


})();