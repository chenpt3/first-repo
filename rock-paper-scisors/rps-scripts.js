const rockBtn = document.getElementById("rock");
const paperBtn = document.getElementById("paper");
const scissorsBtn = document.getElementById("scissors");
let outputText1 = document.getElementById("output-text-1");
let outputText2 = document.getElementById("output-text-2");
let outputText3 = document.getElementById("output-text-3");

function getComputerChoice() {
    let computerChoice;
    min = Math.ceil(1);
    max = Math.floor(4);
    let choiceNum = Math.floor(Math.random() * (4 - 1) + 1);
    if (choiceNum === 1) {
        computerChoice = "Rock"
        return computerChoice
    } else if (choiceNum === 2) {
        computerChoice = "Paper"
        return computerChoice
    } else if (choiceNum === 3) {
        computerChoice = "Scissors"
        return computerChoice
    } else {}
};

function checkWin(playerSelection, computerChoice) {
    let roundScore;
    if (playerSelection === computerChoice) {
        roundScore = "It's a Tie!"
    } else if (playerSelection === "Rock" && computerChoice === "Paper") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "Paper" && computerChoice === "Scissors") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "Scissors" && computerChoice === "Rock") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "Scissors" && computerChoice === "Paper") {
        roundScore = "You win!"
    }  else if (playerSelection === "Paper" && computerChoice === "Rock") {
        roundScore = "You win!"
    }  else if (playerSelection === "Rock" && computerChoice === "Scissors") {
        roundScore = "You win!"
    } else {}
    return(roundScore)
}

function game(userInput) {
    outputText1.innerText = `You chose: ${userInput.innerText}!`;
    let computerChoice = getComputerChoice();
    outputText2.innerText = `Computer chose: ${computerChoice}!`;
    outputText3.innerText = checkWin(userInput.innerText, computerChoice);
}

[...document.getElementsByClassName("input-btn")].forEach(x => {
    x.addEventListener('click', function(){
        game(this)
    })
})



