const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 700;
const c = canvas.getContext("2d");

let player;
let isPressed = {
    d: false,
    a: false,
    space: false
};
let lastPressed;
let gravity = 1;

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener("keydown", function(e) {
    let key = e.key;
    switch (key) {
        case "d":
            isPressed.d = true;
            lastPressed = "d";
            break;
        case "a":
            isPressed.a = true;
            lastPressed = "a";
            break;
        case " ":
            isPressed.space = true;
            lastPressed = "space";
            break;
        default:
            break;
    };
});

window.addEventListener("keyup", function(e) {
    let key = e.key;
    switch (key) {
        case "d":
            isPressed.d = false;
            break;
        case "a":
            isPressed.a = false;
            break;
        case " ":
            isPressed.space = false;
            break;
        default:
            break;
    };
});

class Rect {
    constructor(x,y,height,width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.velocity = 0;
    };

    draw() {
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.rect(this.x, this.y, 50, 100);
        c.fillStyle = "black";
        c.fill();
        c.closePath();
    };

    update() { 
        if (isPressed.d && this.x < (canvas.width - this.width)) this.x += 5
        else if (isPressed.a && this.x > 0) this.x -= 5;

        

        this.draw();
    };
};

function init() {
    player = new Rect(canvas.width/2,(canvas.height-100),100,50);
};

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    player.update();
};

init();
animate();