const canvas = document.querySelector("canvas"); // Get the canvas
canvas.height = window.innerHeight; // Set canvas height
canvas.width = window.innerWidth; // Set canvas width
const c = canvas.getContext("2d"); // The drawing tool
let thingsArray = []; // Array containing all procedurely generated objects
let colorsArray = ["green", "red", "blue", "purple", "yellow", "brown", "orange", "cyan", "magenta", "white", "black", "grey", "navy", "light-blue", "pink", "light grey", "light green", "dark green", "light red"];
let gravity = 7;
let friction = 0.99;
let objectsAmount = 500;

const mouse = { // Setting the mouse coordinates in an object
    x: undefined,
    y: undefined
};
window.addEventListener("mousemove", function(event) { // Getting the mouse coordinates and updating the mouse object every time the mouse moves
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener("resize", function() { // Initialize the canvas on resizing
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    init();
});
function randomIntFromRange(min, max) { // Helper function to get a random number
    return Math.floor(Math.random() * (max - min + 1) + min);
};
function randomColor(color) { // Helper function to get a random color
    return color[Math.floor(Math.random() * color.length)];
};

function Thing(x, y, dx, dy, radius, color) { // The main object object
    this.x = x; // Taking the passed arguments and assigning them as object property's
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.draw = function() { // The function to draw the object
        c.beginPath(); // Start drawing
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // Draw a circle
        c.fillStyle = this.color; 
        c.fill();
        c.stroke();
        c.closePath();
    };
    this.update = function() { // Manipulate the object's position
        if (this.y + this.radius + this.dy > canvas.height || this.y - this.radius <= 0) {
            this.dy = -this.dy * friction;
        } else {
            this.dy += gravity;
        };
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        };
        this.x += this.dx;
        this.y += this.dy;
        this.draw(); 
    };
};

function init() {
    thingsArray = [];
    for (let i = 0; i < objectsAmount; i++) {
        let radius = randomIntFromRange(20, 80);
        let x = randomIntFromRange(radius, innerWidth - radius);
        let y = randomIntFromRange(radius, innerHeight - radius);
        let dx = randomIntFromRange(-2,2);
        let dy = randomIntFromRange(-2,2);
        let color = randomColor(colorsArray);
        thingsArray.push(new Thing(x, y, dx, dy, radius, color));
    };
};

function animate() { // Main animation loop
    requestAnimationFrame(animate); // Initiating a self reference loop
    c.clearRect(0,0,innerWidth, innerHeight); // Clear screen between frames
    for (let i = 0; i < thingsArray.length; i++) {
        thingsArray[i].update();
    };
};

init();
animate();

