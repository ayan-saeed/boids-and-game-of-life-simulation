// References to buttons - selects HTML elements
const wrapper = document.querySelector(".wrapper");
const randomButton = document.querySelector(".random");
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const drawbutton = document.querySelector(".draw");
// Flags to control game logic
let paused = false;
let isDrawing = false;

// Creates a 2d array with 'cols' columns and 'rows' rows
function make2Darray(cols, rows){
    let arr = new Array(cols);
    for(let i = 0; i < arr.length; i++){
        arr[i] = new Array(rows);
    }
    return arr;
}

let canvas;
let grid; 
let cols;
let rows;
let resolution = 10;

function setup(){
    // Creates a div to hold the canvas and adds to the wrapper
    let container = createDiv();
    container.addClass("game-container");
    container.parent(wrapper);
    // Calculate the canvas size based on window size
    const canvasWidth = windowWidth - 60;
    const headerHeight = document.querySelector(".header").offsetHeight;
    const canvasHeight = windowHeight - headerHeight - 60;
    // Create canvas and insert it to the page
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    // Initialise the grid
    resetGrid();
}

function draw(){
    // Clears screen to black
    background(0);
    // Draws each live cell as white squares
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            let x = i*resolution;
            let y = j*resolution;
            if(grid[i][j] == 1){
                fill(255);
                stroke(0);
                rect(x, y, resolution, resolution);
            }
        }
    }
    // Only runs the simulation if not paused
    if(!paused){
        // Creates a new grid for the next gen
        let next = make2Darray(cols,rows);
        /*  Apply game of life rules and update grid. 
            Works by couting number of live neighbour cells (1s) around each cell
            and deciding whether the cell lives, dies or stays alive for the next gen */
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                let state = grid[i][j];
                let neighbours = countNeighbours(grid, i, j);
                if (state == 0 && neighbours == 3){
                    next[i][j] = 1;
                } else if (state == 1 && (neighbours < 2 || neighbours > 3)){
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        grid = next;
    }
    // While in draw mode, convert mouse position to grid coords
    if(isDrawing){
        if(mouseIsPressed){
            let cellX = floor(mouseX / resolution);
            let cellY = floor(mouseY / resolution);
            // If mouse is pressed within the grid, turn that cell on
            if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
                grid[cellX][cellY] = 1;
            }
        }
    }
}

function countNeighbours(grid, x, y){
    //  Checks all surrounding 8 neighbour cells using wrap-arounf edges

    let sum = 0;
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

// Random start grid
function resetGrid(){
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = make2Darray(cols,rows);
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = floor(random(2))
        }
    }
}


// Button controls - 

// Resets the grid and starts simulation
randomButton.addEventListener("click", () =>{
    isDrawing = false;
    paused = false;
    resetGrid();
});

// Pausing the current frame/grid of simulation
pause.addEventListener("click", () =>{
    paused = true;
});

// Resumes the grid
play.addEventListener("click", () =>{
    if(paused){
        paused = !paused;
    }
    isDrawing = false;
});

// Resets all the cells to black and pauses simulation
drawbutton.addEventListener("click", () => {
    isDrawing = true;
    paused = true;
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = make2Darray(cols,rows);
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = 0;
        }
    }
});