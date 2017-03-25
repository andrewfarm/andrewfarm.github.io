const FPS = 30;
const INTERVAL = 1 / FPS;

const BOID_VICINITY = 75;

const SEPARATION_SCALE = 50;
const SEPARATION_DISTANCE = 25;
const SEPARATION_DISTANCE_SQUARED = SEPARATION_DISTANCE * SEPARATION_DISTANCE;
const ALIGNMENT_SCALE = 50;
const COHESION_SCALE = 20;
const AVOIDANCE_SCALE = 1000000;
const BOUNDING_SCALE = 100;

const MAX_SPEED = 75;
const MAX_SPEED_SQUARED = MAX_SPEED * MAX_SPEED;

const HEAD_RADIUS_TO_LENGTH_RATIO = 0.15;

const DRAW_BOIDS = true;
const DRAW_CONNECTIONS = false;

var mousePos;

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
        
        canvas.addEventListener('mousemove', function(event) {
                mousePos = new Vector(event.clientX, event.clientY);
        }, false);
        
        //get drawable context
        var c = canvas.getContext("2d");
        
        //make fullscreen
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        if (isRetina()) {
                //retina display compatibility
                canvas.width = window.innerWidth * 2;
                canvas.height = window.innerHeight * 2;
                canvas.getContext("2d").scale(2, 2);
        } else {
                canvas.width = window.innerWidth;
                canvas.width = window.innerHeight;
        }
        
        //create simulation
        var world = new World(window.innerWidth, window.innerHeight, 200);
        render(world, c);
        
        //run simulation
        window.setInterval(function() {
                render(world, c);
                step(world);
        }, INTERVAL);
}

//Renders to the canvas
function render(world, c) {
        //clear screen
        c.clearRect(0, 0, c.canvas.clientWidth, c.canvas.clientHeight);
        
        if (DRAW_CONNECTIONS) {
                //experimental: draw lines between nearby boids
                c.strokeStyle = "#0080ff22";
                c.lineWidth = 0.5;
                for (var i = 0; i < world.boids.length; i++) {
                        var boid = world.boids[i];
                        var nearby = filterNearby(world.boids, boid, BOID_VICINITY);
                        for (var j = 0; j < nearby.length; j++) {
                                c.beginPath();
                                c.moveTo(boid.pos.x, boid.pos.y);
                                c.lineTo(nearby[j].pos.x, nearby[j].pos.y);
                                c.stroke();
                        }
                }
        }
        
        if (DRAW_BOIDS) {
                //draw boids
                for (var i = 0; i < world.boids.length; i++) {
                        var boid = world.boids[i];
                        var r = HEAD_RADIUS_TO_LENGTH_RATIO * boid.size;
                        
                        c.save();
                        c.translate(boid.pos.x, boid.pos.y);
                        c.rotate(Math.atan2(boid.vel.y, boid.vel.x));
                        c.fillStyle = boid.color;
                        
                        //draw head
                        c.beginPath();
                        c.arc(0, 0, r, 0, 2 * Math.PI);
                        c.fill();
                        
                        //draw tail
                        var tailSize = boid.size - r;
                        var dx = -r * r / tailSize;
                        var dy = r * Math.sqrt((tailSize * tailSize) - (r * r)) / tailSize;
                        c.beginPath();
                        c.moveTo(-tailSize, 0);
                        c.lineTo(dx, -dy);
                        c.lineTo(dx, dy);
                        c.closePath();
                        c.fill();
                        
                        //reset transform
                        c.restore();
                }
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
                        .plus(avoid(mousePos, boid))
                        .plus(bound(world, boid));
                boid.vel = boid.vel.plus(acc.scaled(INTERVAL));
                //limit speed
                clampSpeed(boid);
        }
        
        //move boids
        for (var i = 0; i < world.boids.length; i++) {
                var boid = world.boids[i];
                boid.pos = boid.pos.plus(boid.vel.scaled(INTERVAL));
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
                        acc = acc.plus(between.normalized());
                }
        }
        acc = acc.scaled(SEPARATION_SCALE);
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
        if (nearby.length == 0) {
                return new Vector();
        }
        
        var center = new Vector();
        for (var i = 0; i < nearby.length; i++) {
                center = center.plus(nearby[i].pos);
        }
        center = center.scaled(1 / nearby.length);
        var acc = center.minus(b.pos).normalized().scaled(COHESION_SCALE);
        return acc;
}

//Make boids tend away from a point
//Returns an acceleration vector
function avoid(point, boid) {
        if (point) {
                var dist = boid.pos.minus(point);
                return dist.scaled(AVOIDANCE_SCALE / (dist.length() * dist.lengthSquared()));
        }
        return new Vector();
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

function rgbToHex(r, g, b) {
        var rgb = 0x1000000 | b | (g << 8) | (r << 16);
        return '#' + rgb.toString(16).substring(1);
}

function normRgbToHex(r, g, b) {
        var red   = Math.min(Math.max(Math.floor(r * 256), 0), 255);
        var green = Math.min(Math.max(Math.floor(g * 256), 0), 255);
        var blue  = Math.min(Math.max(Math.floor(b * 256), 0), 255);
        return rgbToHex(red, green, blue);
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
                var size = 20;
                var xNorm = Math.random();
                var yNorm = Math.random();
                var color = normRgbToHex(0, (xNorm + yNorm) / Math.sqrt(2), 1);
                var pos = new Vector(xNorm * this.width,
                                     yNorm * this.height);
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
