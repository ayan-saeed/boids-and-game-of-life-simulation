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
    // Alignment — fly in the same direction as nearby boids
    align(boids){
        // Perception radius
        let radius = 60;
        // Calculated steering force
        let steering = createVector();
        // Number of nearby boids
        let total = 0;
        for(let other of boids){
            // Only check neighbors inside perception radius
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                // Direction difference
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(dist(this.position.x, this.position.y, other.position.x, other.position.y));
                // Add to steering direction
                steering.add(diff);
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
    // Separation — avoid crowding other boids
    seperation(boids){
        // Shorter distance to avoid collisions
        let radius = 30;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                // Move away from neighbors
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0){
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    // Cohesion — move toward the average position of the flock
    cohesion(boids){
        let radius = 100;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                // Sum neighbor positions
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0){
            // Average neighbor position
            steering.div(total);
            // Head toward center
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
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