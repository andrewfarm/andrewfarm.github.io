// Detects HiDPI (retina) displays
// from https://coderwall.com/p/q2z2uw/detect-hidpi-retina-displays-in-javascript
function isRetina() {
        var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
        (min--moz-device-pixel-ratio: 1.5),\
        (-o-min-device-pixel-ratio: 3/2),\
        (min-resolution: 1.5dppx)";
        if (window.devicePixelRatio > 1)
                return true;
        if (window.matchMedia && window.matchMedia(mediaQuery).matches)
                return true;
        return false;
};

function start() {
        //get canvas element
        var canvas = document.getElementById("canvas");
        
        //get drawable context
        var c = canvas.getContext("2d");
        
        //make fullscreen
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        
        //retina display compatibility
        if (isRetina()) {
                canvas.width = window.innerWidth * 2;
                canvas.height = window.innerHeight * 2;
                c.scale(2, 2);
        } else {
                canvas.width = window.innerWidth;
                canvas.width = window.innerHeight;
        }
        
        //create simulation
        var world = new World(window.innerWidth, window.innerHeight, 10);
        render(world, c);
}

//Renders to the canvas
function render(world, c) {
        //clear screen
        c.clearRect(0, 0, c.canvas.clientWidth, c.canvas.clientHeight);
        
        //draw boids
        for (var i = 0; i < world.boids.length; i++) {
                var boid = world.boids[i];
                c.fillStyle = boid.color;
                c.beginPath();
                c.arc(boid.pos.x, boid.pos.y, boid.size / 2, 0, 2 * Math.PI);
                c.fill();
        }
}

//Performs one step of the simulation
function step(world) {
        //TODO
}

//Constructor function for World class
function World(width, height, numBoids) {
        this.width = width;
        this.height = height;
        
        this.initBoids(numBoids);
}

//Populates the world with boids
World.prototype.initBoids = function(numBoids) {
        this.boids = [];
        for (var i = 0; i < numBoids; i++) {
                var size = 10;
                var color = "#000000";
                var pos = new Vector(Math.random() * this.width,
                                     Math.random() * this.height);
                var newBoid = new Boid(size, color, pos);
                this.boids.push(newBoid);
        }
}

//Constructor function for Boid class
function Boid(size, color, pos) {
        this.size = size;
        this.color = color;
        this.pos = pos;
        this.vel = new Vector();
}
