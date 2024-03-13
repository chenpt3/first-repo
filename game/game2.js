const canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const c = canvas.getContext("2d");

const gravity = 1;
const friction = 0.9;

circlesArray = [];
RectsArray = [];
const keys = {
    w: 87,
    s: 83,s
    d: 83,
    a: 65,
    up: 38,
    down: 40,
    right: 39,
    left: 37,
    space: 32
};

window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case keys.w:
            console.log("up");
            break;

        case keys.up:
            console.log("up");
            break;
    
        case keys.down:
            console.log("down");
            break;

        case keys.s:
            console.log("down")
    
        case keys.d:
            console.log("right");
            break;

        case keys.right:
            console.log("right");
            break;
    
        case keys.a:
            console.log("left");
            break;

        case keys.left:
            console.log("left");
    
        default:
            break;
    }
});

function Circle(x, y, radius) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.velocity = {
        x: 0,
        y: 0
    };

    this.draw = function draw() {
        c.beginPath();
        c.moveTo(x+radius,y);
        c.arc(x,y,radius,0,Math.PI*2,false);
        c.fillStyle = "red";
        c.fill();
        c.strokeStyle = "black";
        c.stroke();
        c.closePath();
    };
    
    this.update = function update() {
        if (y + radius >= innerHeight) {
            this.velocity.y = -this.velocity.y * friction;
        } else {
            this.velocity.y += 1;
        };

        y += this.velocity.y;
        this.draw();
    };
};

function Rect(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.velocity = {
        x: 1,
        y: 10
    };

    this.draw = function draw() {
        c.beginPath();
        c.moveTo(x,y);
        c.rect(x, y, width, height);
        c.fillStyle = "red";
        c.fill();
        c.strokeStyle = "black";
        c.stroke();
        c.closePath();
    };

    this.update = function update() {
        if (y + height >= innerHeight) {
            this.velocity.y = -this.velocity.y * friction;
        } else {
            this.velocity.y += 1;
        };

        y += this.velocity.y;
        this.draw();
    };
};

let circle;
let rect;

function init() {
    rect = new Rect(canvas.width/2,canvas.height/2,100,100);
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    rect.update();
};

init();
animate();