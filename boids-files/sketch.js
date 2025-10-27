// Array to store all boid objects (the flock)
const flock = []
// Dropdown for bird presets
let presetSelect;
// Sliders to adjust variables
let alignSlider, cohesionSlider, seperationSlider, resetButton, canvas;

function setup(){
    // Create div container to hold the canvas
    let container = createDiv();
    container.addClass("boids-container");
    // Attach to wrapper div in HTML
    container.parent(document.querySelector(".wrapper"));
    // Create dropdown menu for bird type presets
    presetSelect = createSelect();
    // Default option
    presetSelect.option('Select Bird Species');
    presetSelect.option('Starlings');
    presetSelect.option('Eagles');
    presetSelect.option('Swifts');
    presetSelect.option('Geese');
    presetSelect.option('Crows');
    // Call applyPreset() when selection changes
    presetSelect.changed(applyPreset);
    // Create canvas that fits most of the screen
    canvas = createCanvas(windowWidth - 60, windowHeight - 200);
    // Attach canvas to container div
    canvas.parent(container);
    /*  Create sliders to control flock behavior; 
        one for alignment, cohesion, and seperation */
    alignSlider = createSlider(0,5,1,0.1);
    cohesionSlider = createSlider(0,5,1,0.1);
    seperationSlider = createSlider(0,5,1.5,0.1);
    // Button to reset flock behavior values back to default
    resetButton = createButton("Reset Flock Behaviour");
    resetButton.mousePressed(resetFlockValues);
    // Create container for UI controls
    let controls = createDiv();
    controls.addClass("controls");
    controls.parent(document.querySelector(".wrapper"));
    // Add sliders and buttons to control section
    alignSlider.parent(controls);
    cohesionSlider.parent(controls);
    seperationSlider.parent(controls);
    resetButton.parent(controls);
    presetSelect.parent(controls);
    // Create 200 boids and add them to the flock
    for (let i = 0; i < 200; i++){
        flock.push(new Boid())
    }
}
// Reset sliders back to default flock values
function resetFlockValues() {
    alignSlider.value(1.0);
    cohesionSlider.value(1.0);
    seperationSlider.value(1.5);
}
// Change flock behavior based on selected preset
function applyPreset() {
    // Get selected preset
    let choice = presetSelect.value();
    if (choice === 'Starlings') {
        alignSlider.value(1.2);
        cohesionSlider.value(1.0);
        seperationSlider.value(1.8);
    }
    if (choice === 'Eagles') {
        alignSlider.value(1.8);
        cohesionSlider.value(0.6);
        seperationSlider.value(1.0);
    }
    if (choice === 'Swifts') {
        alignSlider.value(2.2);
        cohesionSlider.value(0.4);
        seperationSlider.value(1.6);
    }
    if (choice === 'Geese') {
        alignSlider.value(2.5);
        cohesionSlider.value(2.0);
        seperationSlider.value(1.2);
    }
    if (choice === 'Crows') {
        alignSlider.value(1.4);
        cohesionSlider.value(1.6);
        seperationSlider.value(1.0);
    }
}

function draw(){
    // Draw sunset gradient background
    noStroke();
    for (let y = 0; y < height; y++) {
        let r = map(y, 0, height, 120, 255);
        let g = map(y, 0, height, 30, 120);
        let b = map(y, 0, height, 80, 60);
        fill(r, g, b);
        // Draw one horizontal line
        rect(0, y, width, 1);
    }
    // Apply flock behavior logic
    for(let boid of flock){
        // Steering rules (align, cohesion, separation)
        boid.flock(flock);
    }
    // Update and display each boid
    for(let boid of flock){
        // Wrap around screen edges
        boid.edges();
        // Apply velocity and acceleration
        boid.update();
        // Draw boid
        boid.show();
    }
}
// Resize canvas when window dimensions change
function windowResized() {
    resizeCanvas(windowWidth - 60, windowHeight - 200);
}