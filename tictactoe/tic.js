const GameBoard = (() => {
    let board = [];
    const initBoard = () => {
        let cellNum = 1;
        for (let i = 0; i < 3; i++) {
            let row = [];
            board.push(row);
            for (let j = 0; j < 3; j++) {
                const cell = {
                    num: cellNum,
                    token: "-"
                };
                row.push(cell);
                cellNum++;
            };
        };
    };

    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j].token = "-";
            };
        };
    };

    const findCell = (index) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (index == board[i][j].num) {
                    return [i, j];
                };
            };
        };
        return -1;
    };

    const getCellToken = (index) => {
        let cell = findCell(index);
        return board[cell[0]][cell[1]].token;
    }

    const replaceToken = (index, token) => {
        let cell = findCell(index);
        board[cell[0]][cell[1]].token = token;
    };

    const printGame = () => console.log(board);

    return { initBoard, clearBoard, replaceToken, getCellToken, printGame };
})();

const Player = (name) => {
    let score = 0;
    return {name, score};
};

const Game = (() => {
    let players = [];
    let activePlayer = players[0];

    const start = () => {
        GameBoard.initBoard();
        console.log("Hi! Welcome to my TicTacToe game!");
        console.log("Please enter your names!");
        createPlayers();
        console.log(`Hello ${players[0].name} and ${players[1].name}! Let's play!`);
        newRound();
    };

    const getPlayerName = () => {
        pname = prompt("What's your name?")
        return pname;
    };

    const createPlayers = () => {
        players[0] = {
            name: getPlayerName(),
            token: "X"
        };
        players[1] = {
            name: getPlayerName(),
            token: "O"
        };
    };

    const getPlayerCell = () => {
        let cell = prompt("Choose a cell between 1 - 9");
        if (cell >= 1 && cell <= 9 || cell === null) {
            return cell;
        } else {
            return false;
        };
    };

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        newRound();
    };

    const newRound = () => {
        let won = false;
        GameBoard.printGame();
        console.log(`It's ${players[0].name}'s turn`);
        console.log("Choose a cell!");
        while (!won) {
            let cell = getPlayerCell();
            if (cell !== false && cell !== null) {
                if (GameBoard.getCellToken(cell) === "-") {
                    GameBoard.replaceToken(cell, players[0].token);
                    switchActivePlayer();
                    break;
                } else {
                    console.log("This cell is already taken");
                };
            } else if (cell === null) {
                break;
            } else {
                console.log("Invalid choice");
            };
        };
    };

    return { start, newRound };
})();

