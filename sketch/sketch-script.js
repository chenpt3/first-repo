const gameContainer = document.querySelector(".sketch-container");
const resetButton = document.querySelector(".reset");
const gridValue = document.getElementById("grid-size");
const penColor = document.getElementById("color");
const penButton = document.querySelector(".pen");
const eraseButton = document.querySelector(".eraser");
const colorButton = document.querySelector(".random-color");
const darknerButton = document.querySelector(".darkner");
const darknerValue = document.getElementById("darkner");
const brightnerButton = document.querySelector(".brightner");
const brightnerValue = document.getElementById("brightner");

let isBorder = true;
let isPen = true;
let isPenActive = false;
let isEraser = false;
let isColor = false;
let isDarkner = false;
let isBrightner = false;

function darkenNum(i, num) {
    if (i>=0 && i<256) {
        return i-num;
    };
};

function brightenNum(i, num) {
    if (i>=0 && i<256) {
        return i+num;
    };
};

function getRandomColor() {
    min = Math.ceil(0);
    max = Math.floor(256);
    return parseInt(Math.floor(Math.random() * (max - min) + min));
};

function initGrid() {
    let draw = gridValue.addEventListener("mouseup", function() {
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
        isBorder = true;
        isPen = true;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        gridValue.value = 32;
        darknerValue.value = 10;
        brightnerValue.value = 10;
        gameContainer.innerHTML = "";
        for (i=0; i<(32*32); i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("border");
            gameContainer.appendChild(cell);
        };
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.style.width = `${100/32}%`;
            cell.style.height = `${100/32}%`;
        });
    });
    return reset;
};

function start() {
    gridValue.value = 32;
    darknerValue.value = 10;
    brightnerValue.value = 10;
    gameContainer.innerHTML = "";
    for (i=0; i<(32*32); i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add("border");
        gameContainer.appendChild(cell);
    };
    const cells = Array.from(document.querySelectorAll(".cell"));
    cells.forEach(cell => {
        cell.style.width = `${100/32}%`;
        cell.style.height = `${100/32}%`;
    });
};

function pen() {
    const pen = penButton.addEventListener("click", function() {
        isPen = true;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isPen && isPenActive) {
                cell.style.backgroundColor = penColor.value;
            };
        cell.addEventListener("click", function() {
            cell.style.backgroundColor = penColor.value;
        });
        });
      });
    });
};

function eraser() {
    const eraser = eraseButton.addEventListener("click", function() {
        isPen = false;
        isEraser = true;
        isColor = false;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isEraser && isPenActive) {
                cell.style.backgroundColor = "rgb(200, 200, 200)";
            };
        cell.addEventListener("click", function() {
            cell.style.backgroundColor = "rgb(200, 200, 200)";
        });
        });
      });
    });
};

function color() {
    const color = colorButton.addEventListener("click", function() {
        isPen = false;
        isEraser = false;
        isColor = true;
        isDarkner = false;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
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
        cell.addEventListener("click", function() {
            let r = getRandomColor();
            let g = getRandomColor();
            let b = getRandomColor();
            cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        });
        });
      });
    });
};

function darkner() {
    const darkner = darknerButton.addEventListener("click", function() {
        isPen = false;
        isEraser = false;
        isColor = false;
        isDarkner = true;
        isBrightner = false;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isDarkner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                let num = parseInt(darknerValue.value);
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${darkenNum(r, num)}, ${darkenNum(g, num)}, ${darkenNum(b, num)})`;
            };
        cell.addEventListener("click", function() {
            let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                let num = parseInt(darknerValue.value);
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${darkenNum(r, num)}, ${darkenNum(g, num)}, ${darkenNum(b, num)})`;
        });
        });
      });
    });
};

function brightner() {
    const brightner = brightnerButton.addEventListener("click", function() {
        isPen = false;
        isEraser = false;
        isColor = false;
        isDarkner = false;
        isBrightner = true;
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
        cell.addEventListener("mousedown", function(){
            isPenActive = true;
        });
        cell.addEventListener("mouseup", function() {
            isPenActive = false;
        });
        cell.addEventListener("mouseover", function() {
            if (isBrightner && isPenActive) {
                let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                let num = parseInt(brightnerValue.value);
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${brightenNum(r, num)}, ${brightenNum(g, num)}, ${brightenNum(b, num)})`;
            };
        cell.addEventListener("click", function() {
            let cellColor = window.getComputedStyle(cell).getPropertyValue("background-color");
                let num = parseInt(brightnerValue.value);
                cellColor = cellColor.slice(4,-1);
                cellColor = cellColor.split(", ");
                let r = parseInt(cellColor[0]);
                let g = parseInt(cellColor[1]);
                let b = parseInt(cellColor[2]);
                cell.style.backgroundColor = `rgb(${brightenNum(r, num)}, ${brightenNum(g, num)}, ${brightenNum(b, num)})`;
        });
        });
      });
    });
}

start();
initGrid();
toggleGrid();
resetGrid()
pen();
eraser();
color();
darkner();
brightner();




