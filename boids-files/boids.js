class Boid{
    constructor(){
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
    }

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

    align(boids){
        let radius = 60;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(dist(this.position.x, this.position.y, other.position.x, other.position.y));
                steering.add(diff);
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

    seperation(boids){
        let radius = 30;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
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

    cohesion(boids){
        let radius = 100;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            if(other != this && dist(this.position.x, this.position.y, other.position.x, other.position.y) < radius){
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0){
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids){
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);

        seperation.mult(seperationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());

        this.acceleration.add(seperation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.set(0,0);
    }

    show(){
        let angle = this.velocity.heading();
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        strokeWeight(1);
        stroke(255);
        fill(200);
        beginShape();
        vertex(5, 0);
        bezierVertex(-2, -2, -3, -1, -3, 0);
        bezierVertex(-3, 1, -2, 2, 5, 0);
        endShape(CLOSE);
        pop();
    }
}