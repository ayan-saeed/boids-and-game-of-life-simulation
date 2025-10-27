// Improves performance by disabling p5's friendly warnings (helps with large flocks)
p5.disableFriendlyErrors = true;

class Boid{
    constructor(){
        // Random starting position within canvas
        this.position = createVector(random(width), random(height));
        // Random starting direction
        this.velocity = p5.Vector.random2D();
        // Random initial speed
        this.velocity.setMag(random(2, 4));
        // Start with no movement influence
        this.acceleration = createVector();
        // Limit steering force
        this.maxForce = 0.05;
        // Top flight speed
        this.maxSpeed = 3;
    }
    // Wrap-around screen edges
    edges(){
        if (this.position.x > width){
            this.position.x = 0;
        } else if (this.position.x < 0){
            this.position.x = width;
        }else if (this.position.y > height){
            this.position.y = 0;
        } else if (this.position.y < 0){
            this.position.y = height;
        }
    }

    calculateForce(boids, radius, callback) {
        // Calculated steering force
        let steering = createVector();
        // Number of nearby boids
        let total = 0;
        for(let other of boids){
            // Only check neighbors inside perception radius
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                // Add to steering direction
                steering.add(callback(other, dist(this.position.x, this.position.y, other.position.x, other.position.y)));
                total++;
            }
        }
        if (total > 0){
            // Average direction
            steering.div(total);
            // Match flock speed
            steering.setMag(this.maxSpeed);
            // Smooth steering
            steering.sub(this.velocity);
            // Control turning strength
            steering.limit(this.maxForce);
        }
        return steering;
    }

    // Alignment — fly in the same direction as nearby boids
    align(boids){
        return this.calculateForce(boids, 60, (other) =>
            // follow velocity direction
            other.velocity.copy());
    }
    // Separation — avoid crowding other boids
    seperation(boids){
        return this.calculateForce(boids, 30, (other, d) => {
            let diff = p5.Vector.sub(this.position, other.position);
            // stronger push when closer
            diff.div(d * d);
            return diff;
        });
    }
    // Cohesion — move toward the average position of the flock
    cohesion(boids){
        return this.calculateForce(boids, 100, (other) =>
            // move to flock center
            p5.Vector.sub(other.position, this.position));
    }
    // Combine forces from alignment, cohesion, and separation
    flock(boids){
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);
        // Small wind randomness to mimic nature
        let wind = p5.Vector.random2D().mult(0.05);
        // Apply slider values
        seperation.mult(seperationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());
        // Add all forces to acceleration
        this.acceleration.add(seperation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(wind);
    }
    // Update movement based on velocity and acceleration
    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        // Reset acceleration each frame
        this.acceleration.set(0,0);
    }
    // Draw the bird as a simple triangle silhouette
    show(){
        // Rotate to flight direction
        let angle = this.velocity.heading();
        // Save drawing state
        push();
        // Move to boid position
        translate(this.position.x, this.position.y);
        // Rotate towards direction
        rotate(angle);
        // Black silhouette
        fill(0);
        noStroke();
        // Triangle bird shape
        beginShape();
        vertex(10, 0);
        bezierVertex(-5, -4, -8, -2, -10, 0);
        bezierVertex(-8, 2, -5, 4, 10, 0);
        endShape(CLOSE);        
        pop();
    }
}