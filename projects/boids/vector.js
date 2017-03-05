//Constructor function.
function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
}

//Returns the sum of this vector and another.
Vector.prototype.plus = function(v) {
        return {
                x: this.x + v.x,
                y: this.y + v.y
        };
}

//Returns the difference of this vector and another.
Vector.prototype.minus = function(v) {
        return {
                x: this.x - v.x,
                y: this.y - v.y
        };
}

//Returns a copy of this vector scaled by some amount.
Vector.prototype.scaled = function(s) {
        return {
                x: this.x * s,
                y: this.y * s
        }
}

//Returns the dot product of this vector and another.
Vector.prototype.dot = function(v) {
        return (this.x * v.x) + (this.y * v.y);
}

//Returns the square of the Euclidean length of this vector.
Vector.prototype.lengthSquared = function() {
        return (this.x * this.x) + (this.y * this.y);
}

//Returns the Euclidean length of this vector.
Vector.prototype.length = function() {
        return Math.sqrt(this.lengthSquared());
}

//Returns a normalized (unit) vector in the direction of this vector.
Vector.prototype.normalized = function() {
        return this.scaled(1 / this.length());
}
