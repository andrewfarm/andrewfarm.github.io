const BOID_VICINITY = 200;

const SEPARATION_SCALE = 1;
const SEPARATION_DISTANCE = 25;
const SEPARATION_DISTANCE_SQUARED = SEPARATION_DISTANCE * SEPARATION_DISTANCE;
const ALIGNMENT_SCALE = 0.1;
const COHESION_SCALE = 0.1;
const BOUNDING_SCALE = 1;

const MAX_SPEED = 5;
const MAX_SPEED_SQUARED = MAX_SPEED * MAX_SPEED;

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
        var world = new World(window.innerWidth, window.innerHeight, 100);
        render(world, c);
        
        //run simulation
        window.setInterval(function() {
                render(world, c);
                step(world);
        }, 50);
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
        //calculate new velocities of boids
        for (var i = 0; i < world.boids.length; i++) {
                var boid = world.boids[i];
                var nearby = filterNearby(world.boids, boid, BOID_VICINITY);
                //apply the boids rules
                var acc = separate(nearby, boid)
                        .plus(align(nearby, boid))
                        .plus(cohere(nearby, boid))
                        .plus(bound(world, boid));
                boid.vel = boid.vel.plus(acc);
                //limit speed
                clampSpeed(boid);
        }
        
        //move boids
        for (var i = 0; i < world.boids.length; i++) {
                var boid = world.boids[i];
                boid.pos = boid.pos.plus(boid.vel);
        }
}

//Finds all the boids in a list that are within a certain radius from a boid.
function filterNearby(boids, b, radius) {
        var nearby = [];
        for (var i = 0; i < boids.length; i++) {
                if (boids[i] !== b) {
                        var distSq = boids[i].pos.minus(b.pos).lengthSquared();
                        if (distSq < radius * radius) {
                                nearby.push(boids[i]);
                        }
                }
        }
        return nearby;
}

//Boids rule 1: separation - keep distance from nearby boids
//Returns an acceleration Vector
function separate(nearby, b) {
        var acc = new Vector();
        for (var i = 0; i < nearby.length; i++) {
                var between = b.pos.minus(nearby[i].pos);
                if (between.lengthSquared() < SEPARATION_DISTANCE_SQUARED) {
                        b.vel = b.vel.plus(between.normalized().scaled(SEPARATION_SCALE));
                }
        }
        return acc;
}

//Boids rule 2: alignment - steer towards average velocity of flockmates
//Returns an acceleration Vector
function align(nearby, b) {
        var acc = new Vector();
        for (var i = 0; i < nearby.length; i++) {
                acc = acc.plus(nearby[i].vel);
        }
        acc = acc.normalized().scaled(ALIGNMENT_SCALE);
        return acc;
}

//Boids rule 3: cohesion - tend toward local center of flockmates
//Returns an acceleration Vector
function cohere(nearby, b) {
        var center = new Vector();
        for (var i = 0; i < nearby.length; i++) {
                center = center.plus(nearby[i].pos);
        }
        center = center.scaled(1 / nearby.length);
        var acc = center.minus(b.pos).normalized().scaled(COHESION_SCALE);
        return acc;
}

//If boids are off an edge, guide them back
//Returns an acceleration vector
function bound(world, boid) {
        var acc = new Vector();
        if (boid.pos.x < 0) {
                acc.x += BOUNDING_SCALE;
        } else if (boid.pos.x > world.width) {
                acc.x -= BOUNDING_SCALE;
        }
        if (boid.pos.y < 0) {
                acc.y += BOUNDING_SCALE;
        } else if (boid.pos.y > world.height) {
                acc.y -= BOUNDING_SCALE;
        }
        return acc;
}

//Clamps boid's speed
function clampSpeed(boid) {
        if (boid.vel.lengthSquared() > MAX_SPEED_SQUARED) {
                boid.vel = boid.vel.normalized().scaled(MAX_SPEED);
        }
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
                var size = 5;
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
