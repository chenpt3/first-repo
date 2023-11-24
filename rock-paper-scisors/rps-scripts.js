

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
}

function game(playerSelection, computerChoice) {
    let roundScore;
    if (playerSelection === computerChoice) {
        roundScore = "It's a Tie!"
    } else if (playerSelection === "rock" && computerChoice === "paper") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "paper" && computerChoice === "scissors") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "scissors" && computerChoice === "rock") {
        roundScore = "Computer Wins!"
    } else if (playerSelection === "scissors" && computerChoice === "paper") {
        roundScore = "Player Wins!"
    }  else if (playerSelection === "paper" && computerChoice === "rock") {
        roundScore = "Player Wins!"
    }  else if (playerSelection === "rock" && computerChoice === "scissors") {
        roundScore = "Player Wins!"
    } else {}
    return roundScore
}


console.log(game())