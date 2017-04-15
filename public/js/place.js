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
    let inputBox = document.querySelector("#inputBox");
    let overlayShade = document.querySelector("#overlayShade");
    let colorPicker = document.querySelector("#colorPicker");
    let mousePosSpan = document.querySelector("#mousePos");
    let mousePixelPosSpan = document.querySelector("#mousePixelPos");
    let socket = io('http://localhost:1337');
    let canvas = document.querySelector("canvas");
    let pixSize = 50;
    let board = [];
    let context = canvas.getContext('2d');
    let mousePos = {x: 0, y: 0};
    let mousePixelPos = {x: 0, y:0};
    let colorPanel = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange', 'gray', 'black', 'white'];

    class Color{
        constructor(r,g,b,a){
            this.r=r;
            this.g=g;
            this.b=b;
            this.a=a;
        }
        toString(){
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
        }
    }

    let selectedColor = false;
    overlayShade.width = window.innerWidth;
    overlayShade.height = window.innerHeight;

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

    let getMousePixelPos = function (evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left)/pixSize),
            y: Math.floor((evt.clientY - rect.top)/pixSize)
        }
    };

    let writeMousePosition = function () {
        mousePixelPosSpan.innerHTML="("+mousePixelPos.x+","+mousePixelPos.y+")";
        mousePosSpan.innerHTML="("+mousePos.x+" ,"+mousePos.y+" )";
    };

    let paintPixels = function () {
        board.forEach((rec) => {
            context.fillStyle = rec.pixelColor.toString();
            context.fillRect(rec.pixelX * pixSize, rec.pixelY * pixSize, pixSize, pixSize);

            if(mousePixelPos.x === rec.pixelX && mousePixelPos.y === rec.pixelY){
                context.fillStyle=new Color(selectedColor.r,selectedColor.g,selectedColor.b,0.50);
                context.fillRect(rec.pixelX * pixSize, rec.pixelY * pixSize, pixSize, pixSize);
                context.beginPath();
                context.lineWidth="1px";
                context.strokeStyle = "black";
                context.rect((rec.pixelX * pixSize)+1, (rec.pixelY * pixSize)+1, pixSize-2, pixSize-2);
                context.stroke();
            }
        });
    };

    let refreshCanvas = function () {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const width = canvas.width;
        const height = canvas.height;

        context.fillStyle="gray";
        context.fillRect(0, 0, width, height);


        paintPixels();

        // window.requestAnimationFrame(refreshCanvas);
    };

    /**
     * Event Listeners
     */
    submitName.addEventListener("click", () => {
        name = input.value;
        input.setAttribute("disabled", "disabled");
        overlayShade.style.visibility = "hidden";
        inputBox.style.visibility = "hidden";
        submitName.setAttribute("disabled", "disabled");
    });

    canvas.addEventListener('mousemove', function (evt) {
        mousePos = getMousePos(evt);
        mousePixelPos = getMousePixelPos(evt);
        writeMousePosition();
        refreshCanvas();


    }, false);

    canvas.addEventListener('click', (event) => {
        console.log("click");
        if (selectedColor !== false) {
            socket.emit("pixel", {
                pixelColor: selectedColor,
                author: name,
                pixelX: mousePixelPos.x,
                pixelY: mousePixelPos.y
            });
            // console.log(event.which);

        }
    }, false);

    /**
     * Socket listeners
     */

    socket.on("connected", (data) => {
        data.board.forEach((x)=>x.pixelColor = new Color(x.pixelColor.r,x.pixelColor.g,x.pixelColor.b,x.pixelColor.a));
        board = data.board;
        inputBox.style.visibility = "visible";
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
        let pixel = {
            pixelX: data.pixel.pixelX,
            pixelY: data.pixel.pixelY,
            author: data.pixel.author,
            time: data.pixel.time,
            pixelColor: new Color(data.pixel.pixelColor.r,data.pixel.pixelColor.g,data.pixel.pixelColor.b,data.pixel.pixelColor.a)
        };
        board.push(pixel);
        refreshCanvas();
    });


    /**
     * Init Colors
     */

    let colorToRGBA= function (color) {
        let cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);

        let resColor = ctx.getImageData(0, 0, 1, 1).data;
        return new Color(resColor[0],resColor[1],resColor[2],resColor[3]);
    };

    for(let i =0;i<colorPanel.length;i++){
        colorPanel[i]= colorToRGBA(colorPanel[i]);
    }

    colorPanel.forEach((color) => {
        let newColorDiv = document.createElement("div");
        newColorDiv.classList.add("color");
        newColorDiv.style.backgroundColor = color.toString();
        newColorDiv.addEventListener("click", (event) => {

            if (selectedColor !== false) {
                let selectedColorDiv = colorPicker.querySelector(".selected");
                selectedColorDiv.classList.remove("selected");
            }
            event.target.classList.add("selected");
            selectedColor = color;
        });
        colorPicker.appendChild(newColorDiv);
    });


    /**
     * Start
     */
    refreshCanvas();
})();