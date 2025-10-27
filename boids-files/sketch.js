const flock = []

let alignSlider, cohesionSlider, seperationSlider, resetButton, canvas;

function setup(){
    let container = createDiv();
    container.addClass("boids-container");
    container.parent(document.querySelector(".wrapper"));

    canvas = createCanvas(windowWidth - 60, windowHeight - 200);
    canvas.parent(container);

    alignSlider = createSlider(0,5,1,0.1);
    cohesionSlider = createSlider(0,5,1,0.1);
    seperationSlider = createSlider(0,5,1.5,0.1);
    resetButton = createButton("Reset Flock Behaviour");
    resetButton.mousePressed(resetFlockValues);

    let controls = createDiv();
    controls.addClass("controls");
    controls.parent(document.querySelector(".wrapper"));
    alignSlider.parent(controls);
    cohesionSlider.parent(controls);
    seperationSlider.parent(controls);
    resetButton.parent(controls);

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
    noStroke();
    for (let y = 0; y < height; y++) {
        let r = map(y, 0, height, 120, 255);
        let g = map(y, 0, height, 30, 120);
        let b = map(y, 0, height, 80, 60);
        fill(r, g, b);
        rect(0, y, width, 1);
    }
    for(let boid of flock){
        boid.flock(flock);
    }
    for(let boid of flock){
        boid.edges();
        boid.update();
        boid.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth - 60, windowHeight - 200);
}