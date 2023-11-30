const gameContainer = document.querySelector(".sketch-container");
const resetButton = document.querySelector(".reset");
const gridValue = document.getElementById("grid-size");
const penColor = document.getElementById("color");
const penButton = document.querySelector(".pen");
const eraseButton = document.querySelector(".eraser");
const colorButton = document.querySelector(".random-color");
const darknerButton = document.querySelector(".darkner");
const brightnerButton = document.querySelector(".brightner");
const backColor = document.getElementById("background-color");
const getColorButton = document.querySelector(".get-color");
const fillButton = document.querySelector(".fill");

let isBorder = true;
let isPen = false;
let isPenActive = false;
let isEraser = false;
let isColor = false;
let isDarkner = false;
let isBrightner = false;
let isFill = false;
let isGetColor = false;

function getRandomColor() {
    min = Math.ceil(0);
    max = Math.floor(256);
    return parseInt(Math.floor(Math.random() * (max - min) + min));
};

function initGrid() {
    let draw = gridValue.addEventListener("mouseup", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = false;
        isGetColor = false;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const gridSize = parseInt(gridValue.value);
        gameContainer.innerHTML = "";
        for (i=0; i<(gridSize*gridSize); i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            if (isBorder) {cell.classList.add("border")};
            gameContainer.appendChild(cell);
        };
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.style.width = `${100/gridSize}%`;
            cell.style.height = `${100/gridSize}%`;
        });
    });
    return draw;
};

function toggleGrid() {
    const toggle = document.querySelector(".grid-lines").addEventListener("click", function() {
        const items = Array.from(document.getElementsByClassName("cell"));
        if (isBorder) {
            items.forEach(item => {
                item.classList.remove("border");
                isBorder = false;
            });
        } else {
            items.forEach(item => {
                item.classList.add("border");
                isBorder = true;
            });
        };
        });
    return toggle;
};

function resetGrid() {
    const reset = resetButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isBorder = true;
        isPen = true;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        penColor.value = "black";
        backColor.value = "#f3f3f3";
        gridValue.value = 16;
        gameContainer.innerHTML = "";
        for (i=0; i<(16*16); i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("border");
            gameContainer.appendChild(cell);
        };
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.style.width = `${100/16}%`;
            cell.style.height = `${100/16}%`;
        });
    });
};

function start() {
    gridValue.value = 16;
    gameContainer.innerHTML = "";
    for (i=0; i<(16*16); i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add("border");
        gameContainer.appendChild(cell);
    };
    const cells = Array.from(document.querySelectorAll(".cell"));
    cells.forEach(cell => {
        cell.style.width = `${100/16}%`;
        cell.style.height = `${100/16}%`;
    });
};

function pen() {
    const pen = penButton.addEventListener("click", function() {
        penButton.classList.add("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = true;
        isFill = false;
        isGetColor = false;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
            if (isPen && isPenActive) {
                cell.style.backgroundColor = penColor.value;
            };
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isPen && isPenActive) {
                cell.style.backgroundColor = penColor.value;
            };
        });
      });
    });
};

function eraser() {
    const eraser = eraseButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.add("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = false;
        isGetColor = false;
        isEraser = true;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
            if (isEraser && isPenActive) {
                cell.style.backgroundColor = backColor.value;
            };
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isEraser && isPenActive) {
                cell.style.backgroundColor = backColor.value;
            };
        });
      });
    });
};

function color() {
    const color = colorButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.add("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = false;
        isGetColor = false;
        isEraser = false;
        isColor = true;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
            if (isColor && isPenActive) {
                let r = getRandomColor();
                let g = getRandomColor();
                let b = getRandomColor();
                cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            };
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isColor && isPenActive) {
                let r = getRandomColor();
                let g = getRandomColor();
                let b = getRandomColor();
                cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            };
        });
      });
    });
};

function darkner() {
    const darkner = darknerButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.add("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = false;
        isGetColor = false;
        isEraser = false;
        isColor = false;
        isDarkner = true;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
            if (isDarkner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${r-10}, ${g-10}, ${b-10})`;
            };
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isDarkner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${r-10}, ${g-10}, ${b-10})`;
            };
        });
        });
    });
};
       
function brightner() {
    const brightner = brightnerButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.add("clicked");
        isPen = false;
        isFill = false;
        isGetColor = false;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = true;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
            if (isBrightner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${r+10}, ${g+10}, ${b+10})`;
            };
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isBrightner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${r+10}, ${g+10}, ${b+10})`;
            };
        });
      });
    });
};

function backgroundChange() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.backgroundColor = backColor.value;
    });
};

function getColor() {
    const get = getColorButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.remove("clicked");
        getColorButton.classList.add("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = false;
        isGetColor = true;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.addEventListener("click", function() {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                penColor.value = colorStringToHex(cellColor);
            });
        });
    });
};

function rgbToHex(num) {
    let hex = num.toString(16);
    return hex;
};

function fill() {
    const fill = fillButton.addEventListener("click", function() {
        penButton.classList.remove("clicked");
        eraseButton.classList.remove("clicked");
        fillButton.classList.add("clicked");
        getColorButton.classList.remove("clicked");
        colorButton.classList.remove("clicked");
        darknerButton.classList.remove("clicked");
        brightnerButton.classList.remove("clicked");
        isPen = false;
        isFill = true;
        isGetColor = false;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.addEventListener("click", function() {
                let neighbors = Array.from(findNeighbors(cells, cell));
                let mainCellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                let oldColor = colorStringToHex(mainCellColor);
                let num = parseInt(gridValue.value);
                for (i=0; i<num; i++) {
                    neighbors.forEach(cell => {
                        let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                        cellColor = colorStringToHex(cellColor);
                        if (cellColor === oldColor) {
                            cell.style.backgroundColor = penColor.value;
                            let secondNeighbors = Array.from(findNeighbors(cells, cell));
                            secondNeighbors.forEach(element => {
                                let elementColor = window.getComputedStyle(element).getPropertyValue("background-color");
                                elementColor = colorStringToHex(elementColor);
                                if (elementColor === oldColor && !neighbors.includes(element)) {
                                    neighbors.push(element);
                                };  
                            });
                        };
                    });
                }
            });
        });
        
    });
};

function colorStringToHex(cellColor) {
    cellColor = cellColor.slice(4,-1);
    cellColor = cellColor.split(", ");
    let r = parseInt(cellColor[0]);
    let g = parseInt(cellColor[1]);
    let b = parseInt(cellColor[2]);
    let cellHex = `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`
    return cellHex;
};

function findNeighbors(cells, cell) {
    const width = parseInt(gridValue.value);
    let i = cells.indexOf(cell);
    let topRow = cells.slice(i-width-1, i-width+2);
    let bottomRow = cells.slice(i+width-1, i+width+2);
    let middleRow = cells.slice(i-1,i+2);
    let neigh = topRow.concat(bottomRow, middleRow);
    return neigh
};


start();
initGrid();
toggleGrid();
resetGrid()
pen();
eraser();
color();
darkner();
brightner();
getColor();
fill();

