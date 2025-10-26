const wrapper = document.querySelector(".wrapper");
const randomButton = document.querySelector(".random");
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const drawbutton = document.querySelector(".draw");
let paused = false;
let isDrawing = false;

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
    let container = createDiv();
    container.addClass("game-container");
    container.parent(wrapper);
    const canvasWidth = windowWidth - 60;
    const headerHeight = document.querySelector(".header").offsetHeight;
    const canvasHeight = windowHeight - headerHeight - 60;
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(container);
    resetGrid();
}

function draw(){
    background(0);
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
    if(!paused && !isDrawing){
        let next = make2Darray(cols,rows);
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
    if(isDrawing){
        if(mouseIsPressed){
            let cellX = floor(mouseX / resolution);
            let cellY = floor(mouseY / resolution);
            if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
                grid[cellX][cellY] = 1;
            }
        }
    }
}

function countNeighbours(grid, x, y){
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

randomButton.addEventListener("click", () =>{
    isDrawing = false;
    paused = false;
    resetGrid();
});

pause.addEventListener("click", () =>{
    paused = true;
});

play.addEventListener("click", () =>{
    if(paused){
        paused = !paused;
    }
    isDrawing = false;
});

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