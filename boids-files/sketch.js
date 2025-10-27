const flock = []

let alignSlider, cohesionSlider, seperationSlider, resetButton, canvas;

function setup(){
    let container = createDiv();
    container.addClass("boids-container");
    container.parent(document.querySelector(".wrapper"));

    canvas = createCanvas(640,360);
    canvas.parent(container);

    alignSlider = createSlider(0,5,1,0.1);
    cohesionSlider = createSlider(0,5,1,0.1);
    seperationSlider = createSlider(0,5,1.5,0.1);
    resetButton = createButton("Reset Flock Behaviour");
    resetButton.mousePressed(resetFlockValues);

    alignSlider.parent(container);
    cohesionSlider.parent(container);
    seperationSlider.parent(container);
    resetButton.parent(container);

    for (let i = 0; i < 200; i++){
        flock.push(new Boid())
    }
}

function resetFlockValues() {
    alignSlider.value(1.0);
    cohesionSlider.value(1.0);
    seperationSlider.value(1.5);
}


function draw(){
    background(51);
    for(let boid of flock){
        boid.flock(flock);
    }
    for(let boid of flock){
        boid.edges();
        boid.update();
        boid.show();
    }
}

