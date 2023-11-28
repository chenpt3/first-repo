const gameContainer = document.querySelector(".sketch-container");
const resetButton = document.querySelector(".reset");

function getNum() {
    min = Math.ceil(0);
    max = Math.floor(256);
    return parseInt(Math.floor(Math.random() * (max - min) + min));
};
function drawGame() {
    let num = prompt("Choose a number for a grid! ");
    gameContainer.innerHTML = "";
    if (num>0 && num<=100 ) {
        for (i=0; i<(num*num); i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            gameContainer.appendChild(cell);
        };
        let cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach(cell => {
            cell.style.width = `${100/num}%`;
            cell.style.height = `${100/num}%`;
            let r = getNum();
            let g = getNum();
            let b = getNum();
            cell.addEventListener("mouseover", function() {
                cell.style.backgroundColor = `rgb(${r=r-10}, ${g=g-10}, ${b=b-10})`;
            });
        });
    } else {
    };
    
};

drawGame();
resetButton.addEventListener("click",drawGame);

