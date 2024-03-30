let ROWS;
let COLUMNS;
const EMPTY_TOKEN = "empty";

const Player = (name, token) => {
    let score = 0;

    const setName = (newName) => name = newName;
    const setToken = (newToken) => token = newToken;
    const getName = () => name;
    const getToken = () => token;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;

    return { setName, setToken, getName, getToken, getScore, incrementScore, resetScore };
}; 

const Board = (() => {
    let board = [];

    const Cell = () => {
        let token = EMPTY_TOKEN;
        let cellNum = null;
        let cellClaimed = false;

        const setToken = (newToken) => token = newToken;
        const getToken = () => token;
        const setCellNum = (newCellNum) => cellNum = newCellNum;
        const getCellNum = () => cellNum;
        const setCellClaimed = (newCellClaimed) => cellClaimed = newCellClaimed;
        const getCellClaimed = () => cellClaimed;


        return { setToken, getToken, setCellNum, getCellNum, setCellClaimed, getCellClaimed};
    };

    const initBoard = () => { 
        let count = 0;
        for (let i = 0; i < ROWS; i++) {
            board.push([]);
            for (let j = 0; j < COLUMNS; j++) {
                let cell = Cell();
                cell.setCellNum(count);
                board[i].push(cell);
                count++;
            };
        };
    };

    const getBoard = () => board;

    const resetBoard = () => board = [];

    const insertToken = (column, token) => {
        let row = ROWS - 1;
        while (row >= 0) {
            if (board[row][column].getToken() === EMPTY_TOKEN) {
                board[row][column].setToken(token);
                break;
            }
            row--;
        };
    };

    return { initBoard, getBoard, resetBoard, insertToken };
})();

const GameControls = (() => {
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkIfValidMove = (column) => {
        const board = Board.getBoard();
        if (column < 0 || column >= COLUMNS) return false;
        if (board[0][column].getToken() !== EMPTY_TOKEN) return false;
        return true;
    };

    const checkIfWin = () => {
        const board = Board.getBoard();
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (board[i][j].getToken() === EMPTY_TOKEN) continue;
                if (j + 3 < COLUMNS &&
                    board[i][j].getToken() === board[i][j + 1].getToken() &&
                    board[i][j].getToken() === board[i][j + 2].getToken() &&
                    board[i][j].getToken() === board[i][j + 3].getToken()) {
                    return true;
                }
                if (i + 3 < ROWS) {
                    if (board[i][j].getToken() === board[i + 1][j].getToken() &&
                        board[i][j].getToken() === board[i + 2][j].getToken() &&
                        board[i][j].getToken() === board[i + 3][j].getToken()) {
                        return true;
                    }
                    if (j + 3 < COLUMNS &&
                        board[i][j].getToken() === board[i + 1][j + 1].getToken() &&
                        board[i][j].getToken() === board[i + 2][j + 2].getToken() &&
                        board[i][j].getToken() === board[i + 3][j + 3].getToken()) {
                        return true;
                    }
                    if (j - 3 >= 0 &&
                        board[i][j].getToken() === board[i + 1][j - 1].getToken() &&
                        board[i][j].getToken() === board[i + 2][j - 2].getToken() &&
                        board[i][j].getToken() === board[i + 3][j - 3].getToken()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const checkIfDraw = () => {
        const board = Board.getBoard();
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (board[i][j].getToken() === EMPTY_TOKEN) return false;
            }
        }
        return true;
    };

    const initGame = () => {
        Board.initBoard();
    };

    const resetGame = () => {
        Board.resetBoard();
        currentPlayer = player1;
    };

    const getRoundWinner = () => {
        if (checkIfWin()) {
            currentPlayer.incrementScore();
            return currentPlayer;
        }
        return null;
    };

    const getPlayersScore = () => {
        return [player1.getScore(), player2.getScore()];
    };

    return { getRoundWinner, getPlayersScore, initGame, resetGame, getCurrentPlayer, switchPlayer, checkIfValidMove, checkIfWin, checkIfDraw, player1, player2};
})();

const DOMControls = (() => {
    const START_SCREEN = document.querySelector('#start-screen');
    const SETTINGS_SCREEN = document.querySelector('#settings-screen');
    const GAME_SCREEN = document.querySelector('#game-screen');
    const END_SCREEN = document.querySelector('#end-screen');

    const startBtn = document.querySelector('#start-btn');
    const player1NameInput = document.querySelector('#player1');
    const player2NameInput = document.querySelector('#player2');
    const rowsInput = document.querySelector('#rows');
    const columnsInput = document.querySelector('#columns');
    const startGameBtn = document.querySelector('#start-game-btn');
    const board = document.querySelector('#board');
    const player1NameOutput = document.querySelector('#player1-name');
    const player2NameOutput = document.querySelector('#player2-name');
    const player1ScoreOutput = document.querySelector('#player1-score');
    const player2ScoreOutput = document.querySelector('#player2-score');
    const backBtn = document.querySelector('#back-btn');
    const settingsBackBtn = document.querySelector('#settings-back');
    const settingsBtn = document.querySelector('#settings-btn');
    const endMessage = document.querySelector('#end-message');
    const restartBtn = document.querySelector('#restart-btn');
    const exitBtn = document.querySelector('#exit-btn');
    const player1EndName = document.querySelector('#player1-end-name');
    const player2EndName = document.querySelector('#player2-end-name');
    const player1EndScore = document.querySelector('#player1-end-score');
    const player2EndScore = document.querySelector('#player2-end-score');

    const changeScreen = (screen) => {
        START_SCREEN.classList.add("display-off");
        START_SCREEN.classList.remove("display-on");
        SETTINGS_SCREEN.classList.add("display-off");
        SETTINGS_SCREEN.classList.remove("display-on");
        GAME_SCREEN.classList.add("display-off");
        GAME_SCREEN.classList.remove("display-on");
        END_SCREEN.classList.add("display-off");
        END_SCREEN.classList.remove("display-on");

        screen.classList.remove("display-off");
        screen.classList.add("display-on");
    };

    const addListener = (element, handler, event = "click") => {
        element.addEventListener(event, handler);
    };

    const removeListener = (element, handler, event = "click") => {
        element.removeEventListener(event, handler);
    };

    const getSettings = () => {
        let rows = parseInt(rowsInput.value);
        let columns = parseInt(columnsInput.value);
        let player1Name = player1NameInput.value;
        let player2Name = player2NameInput.value;

        if (rows < 4 || rows > 9 || isNaN(rows)) {
            rows = 6;
        };
        if (columns < 4 || columns > 9 || isNaN(columns)) {
            columns = 7;
        };
        if (player1Name === "") {
            player1Name = "Player 1";
        };
        if (player2Name === "") {
            player2Name = "Player 2";
        };

        ROWS = rows;
        COLUMNS = columns;
        GameControls.player1.setName(player1Name);
        GameControls.player2.setName(player2Name);
    };

    const startBtnHandler = () => {
        changeScreen(SETTINGS_SCREEN);
        removeListener(startBtn, startBtnHandler);
        addListener(startGameBtn, startGameBtnHandlerHome);
        addListener(settingsBackBtn, backBtnHandlerHome);
        settingsBackBtn.innerHTML = "Exit";
        rowsInput.value = 6;
        columnsInput.value = 7;
        player1NameInput.value = "Player 1";
        player2NameInput.value = "Player 2";
    };

    const backBtnHandlerHome = () => {
        changeScreen(START_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        addListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "";
    };

    const startGameBtnHandlerHome = () => {
        changeScreen(GAME_SCREEN);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        getSettings();
        handleGame();
        settingsBackBtn.innerHTML = "";
    };

    const backBtnHandlerGame = () => {
        changeScreen(GAME_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);   
    };

    const backBtnHandler = () => {
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startBtn, startBtnHandler);
        exitBtnHandler();
    };

    const startGameBtnHandlerGame = () => {
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        GameControls.player1.resetScore();
        GameControls.player2.resetScore();
        getSettings();
        restartBtnHandler();
    };

    const settingsBtnHandler = () => {
        settingsBackBtn.innerHTML = "Back";
        changeScreen(SETTINGS_SCREEN);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startGameBtn, startGameBtnHandlerGame);
        addListener(settingsBackBtn, backBtnHandlerGame);
    };

    const handleGame = () => {
        GameControls.initGame();
        renderBoard();
        renderGamePlayer();
    };

    const clearBoard = () => {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        };
    };

    const clearCellListeners = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', cellHandler);
        });
    };

    const cellHandler = (e) => {
        let cell = e.target;
        let cellClaimed = cell.dataset.cellClaimed;
        let cellNum = parseInt(cell.dataset.cellNum);
        let column = (cellNum % COLUMNS);

        if (GameControls.checkIfValidMove(column) === false || cellClaimed === "true") return;
        Board.insertToken(column, GameControls.getCurrentPlayer().getToken());

        if (GameControls.checkIfWin()) {
            gameEndHandler("win");
        };
        if (GameControls.checkIfDraw()) {
            gameEndHandler("draw");
        };
        GameControls.switchPlayer();
        renderBoard();
    };

    const restartBtnHandler = () => {
        clearCellListeners();
        changeScreen(GAME_SCREEN);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        clearBoard();
        GameControls.resetGame();
        handleGame();
    };

    const exitBtnHandler = () => {
        if (END_SCREEN.classList.contains("display-on")) {
            removeListener(restartBtn, restartBtnHandler);
            removeListener(exitBtn, exitBtnHandler);
        };
        clearCellListeners();
        changeScreen(START_SCREEN);
        addListener(startBtn, startBtnHandler);
        clearBoard();
        GameControls.resetGame();
        GameControls.player1.resetScore();
        GameControls.player2.resetScore();
    };

    const renderGamePlayer = () => {
        player1NameOutput.textContent = GameControls.player1.getName();
        player2NameOutput.textContent = GameControls.player2.getName();
        player1ScoreOutput.textContent = GameControls.player1.getScore();
        player2ScoreOutput.textContent = GameControls.player2.getScore();
    };

    const renderEndPlayer = () => {
        player1EndName.textContent = GameControls.player1.getName();
        player2EndName.textContent = GameControls.player2.getName();
        player1EndScore.textContent = GameControls.player1.getScore();
        player2EndScore.textContent = GameControls.player2.getScore();
    };

    const gameEndHandler = (state) => {
        if (state === "win") {
            let winner = GameControls.getRoundWinner();
            endMessage.textContent = `${winner.getName()} wins!`;
        } else if (state === "draw") {
            endMessage.textContent = "It's a draw!";
        };
        changeScreen(END_SCREEN);
        addListener(restartBtn, restartBtnHandler);
        addListener(exitBtn, exitBtnHandler);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        renderEndPlayer();
    };

    const renderBoard = () => {
        clearBoard();
        const boardArr = Board.getBoard();
        for (let i = 0; i < ROWS; i++) {
            let row = document.createElement('div');
            row.classList.add('cell-row');
            board.appendChild(row);
            for (let j = 0; j < COLUMNS; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.cellNum = boardArr[i][j].getCellNum();
                cell.dataset.cellClaimed = boardArr[i][j].getCellClaimed();
                cell.dataset.token = boardArr[i][j].getToken();
                if (cell.dataset.token === GameControls.player1.getToken()) {
                    cell.classList.add('cell-player1');
                } else if (cell.dataset.token === GameControls.player2.getToken()) {
                    cell.classList.add('cell-player2');
                } else {
                    cell.classList.add('cell-empty');
                };
                if (i === 0) {
                    cell.classList.add('cell-top');
                };
                cell.addEventListener('click', cellHandler);
                row.appendChild(cell);
            };
        };

    };


    const init = () => {
        addListener(startBtn, startBtnHandler);
    };

    return { init };

})();

DOMControls.init();