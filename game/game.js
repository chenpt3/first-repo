const canvas = document.querySelector("canvas"); // Get the canvas
canvas.height = window.innerHeight; // Set canvas height
canvas.width = window.innerWidth; // Set canvas width
const c = canvas.getContext("2d"); // The drawing tool
let thingsArray = []; // Array containing all generated objects
let colorsArray = [
    "#6CA6C1",
    "#8A1C7C",
    "#B0E298",
    "#FF5E5B",
    "#0D5C63",
    "#2BC016",
    "#85C7F2"
];
let gravity = 7;
let friction = 0.99;
let objectsAmount = 300;

let mouse = { // Setting the mouse coordinates in an object
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", (event) => { // Getting the mouse coordinates and updating the mouse object every time the mouse moves
    mouse.x = event.clientX;
    mouse.y = event.clientY
});

window.addEventListener("resize", () => { // Initialize the canvas on resizing
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

function getDistance(x1, y1, x2, y2) { // Get the distance between two objects
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
};

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function Thing(x, y, radius, color) { // The main object object
    this.x = x; // Taking the passed arguments and assigning them as object property's
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: randomIntFromRange(-10,10),
        y: randomIntFromRange(-10,10)
    };
    this.mass = 1;
    this.opacity = 0;

    this.draw = () => { // The function to draw the object
        c.beginPath(); // Start drawing
        c.moveTo(this.x+this.radius, this.y);
        c.save();
        c.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false);
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    };

    this.update = function() {
    if (getDistance(this.x, this.y, mouse.x, mouse.y) < 200 && this.opacity < 0.8) { // Collision with mouse - opacity
        this.opacity += 0.1;
    } else if (this.opacity > 0) {
        this.opacity -= 0.06;
        this.opacity = Math.max(0, this.opacity);
    };
    for (let i = 0; i < thingsArray.length; i++) { // Collision detection with other objects
        if (this === thingsArray[i]) continue; // Make sure not to iterate through itself
        if (getDistance(this.x, this.y, thingsArray[i].x, thingsArray[i].y) - radius * 2 < 0) { 
            resolveCollision(this, thingsArray[i]);
        };
    };
    if (this.x - radius <= 0 || this.x + radius >= innerWidth) {this.velocity.x = -this.velocity.x;}; // Collision with left and right screen sides
    if (this.y - radius <= 0 || this.y + radius >= innerHeight) {this.velocity.y = -this.velocity.y}; // Collision with up and down screen sides
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
    };
};

function init() {
    thingsArray = []; // Reset the array
    for (let e = 0; e < objectsAmount; e++) {
        let radius = 20;
        let x = randomIntFromRange(radius + 10, innerWidth - radius - 10);
        let y = randomIntFromRange(radius + 10, innerHeight - radius - 10);
        let color = randomColor(colorsArray);
        for (let i = 0; i < objectsAmount; i++) {
            if (i !== 0) { // Prevents objects from Spawning on top of each other
                for (let j = 0; j < thingsArray.length; j++) {
                    if (getDistance(x, y, thingsArray[j].x, thingsArray[j].y) - (radius * 2) - 10 <= 0) { 
                        x = randomIntFromRange(radius + 10, innerWidth - radius - 10);
                        y = randomIntFromRange(radius + 10, innerHeight - radius - 10);
                        j = -1;
                    };
                };
            };
        };
        thingsArray.push(new Thing(x, y, radius, color));
    };
};

function animate() { // Main animation loop
    requestAnimationFrame(animate); // Initiating a self reference loop
    c.clearRect(0,0,innerWidth,innerHeight);
    thingsArray.forEach(thing => {
        thing.update();
    });

};

init();
animate();

