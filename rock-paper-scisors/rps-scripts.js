const startBtn = document.querySelector(".start");
const choiceBtnsNode = document.querySelectorAll(".choice-btn");
const choiceBtns = Array.apply(null, choiceBtnsNode);
const startScreen = document.getElementById("start-screen");
const choiceScreen = document.getElementById("choice-screen");
const gameScreen = document.getElementById("game-screen");
const h2User = document.querySelector(".user-choice");
const h2Computer = document.querySelector(".computer-choice");
const h1Outpute = document.querySelector(".output");
const score = document.querySelector(".score");
const conBtn = document.querySelector(".continue");
const endScreen = document.getElementById("end-screen");
const h1End = document.querySelector(".end");
const restartBtn = document.querySelector(".restart");

let userChoice;
let userScore = 0;
let computerScore = 0
let computerChoice;

function getComputerChoice() {
    min = Math.ceil(0);
    max = Math.floor(5);
    return parseInt(Math.floor(Math.random() * (max - min) + min));
};

function checkWin(playerChoice, computerChoice) {
    let output;
    if (playerChoice === computerChoice) {
        output = "It's a draw!";
    } else if (playerChoice === "Water") {
        if (computerChoice === "Fire" || computerChoice === "Wind") {
            output = "You win!"
            userScore++;
        } else {
            output = "You lose!";
            computerScore++;
        }
    } else if (playerChoice === "Fire") {
        if (computerChoice === "Wind" || computerChoice === "Lightning") {
            output = "You win!"
            userScore++;
        } else {
            output = "You lose!";
            computerScore++;
        }
    } else if (playerChoice === "Wind") {
        if (computerChoice === "Lightning" || computerChoice === "Earth") {
            output = "You win!"
            userScore++;
        } else {
            output = "You lose!";
            computerScore++;
        }
    } else if (playerChoice === "Lightning") {
        if (computerChoice === "Earth" || computerChoice === "Water") {
            output = "You win!"
            userScore++;
        } else {
            output = "You lose!";
            computerScore++;
        }
    } else if (playerChoice === "Earth") {
        if( computerChoice === "Water" || computerChoice === "Fire") {
            output = "You win!"
            userScore++;
        } else {
            output = "You lose!";
            computerScore++;
        }
    } else {
        output = "You lose!";
        computerScore++;
    };
    return output;
};

function convert(num) {
    let item;
    if (num === 0) {
        item = "Water";
    } else if (num === 1) {
        item = "Fire";
    } else if (num === 2) {
        item = "Wind";
    } else if (num === 3) {
        item = "Lightning";
    } else if (num === 4) {
        item = "Earth";
    } else {
        item = "WTF";
    };
    return item;
};

function anotherRound() {
    if (userScore === 5 || computerScore === 5) {
        gameScreen.style.display = "none"
        endScreen.style.display = "flex";
        if (userScore === 5) {
            h1End.textContent = "YOU WON!";
        } else {
            h1End.textContent = "LOSER...";
        };
        userChoice;
        computerChoice;
        userScore = 0;
        computerScore = 0;
    } else {
        gameScreen.style.display = "none";
        choiceScreen.style.display = "flex";
    }
}

function getResult() {
    choiceScreen.style.display = "none";
    gameScreen.style.display = "flex";
    h2User.textContent = `You chose ${userChoice}!`;
    h2Computer.textContent = `Enemy chose ${computerChoice}`;
    h1Outpute.textContent = checkWin(userChoice, computerChoice);
    score.textContent = `${userScore} : ${computerScore}`;
}

function startGame() {
    startScreen.style.display = "none";
    choiceScreen.style.display = "flex";
};

const ending = restartBtn.addEventListener("click", function() {
    endScreen.style.display = "none";
    startScreen.style.display = "flex";
    begin;
});

const round = conBtn.addEventListener("click", anotherRound);

const getChoice = choiceBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        userChoice = btn.innerText;
        computerChoice = convert(getComputerChoice());
        getResult();
    })
});

const begin = startBtn.addEventListener("click", startGame);

