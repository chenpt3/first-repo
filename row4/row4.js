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
        let fullRow = false;

        const setToken = (newToken) => token = newToken;
        const getToken = () => token;
        const setCellNum = (newCellNum) => cellNum = newCellNum;
        const getCellNum = () => cellNum;
        const setCellClaimed = (newCellClaimed) => cellClaimed = newCellClaimed;
        const getCellClaimed = () => cellClaimed;
        const getFullRow = () => fullRow;
        const setFullRow = (newFullRow) => fullRow = newFullRow;


        return { setToken, getToken, setCellNum, getCellNum, setCellClaimed, getCellClaimed, getFullRow, setFullRow};
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
    let winningCells = [];
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
                    winningCells = [board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]];
                    return true;
                }
                if (i + 3 < ROWS) {
                    if (board[i][j].getToken() === board[i + 1][j].getToken() &&
                        board[i][j].getToken() === board[i + 2][j].getToken() &&
                        board[i][j].getToken() === board[i + 3][j].getToken()) {
                        winningCells = [board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]];
                        return true;
                    }
                    if (j + 3 < COLUMNS &&
                        board[i][j].getToken() === board[i + 1][j + 1].getToken() &&
                        board[i][j].getToken() === board[i + 2][j + 2].getToken() &&
                        board[i][j].getToken() === board[i + 3][j + 3].getToken()) {
                        winningCells = [board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3]];
                        return true;
                    }
                    if (j - 3 >= 0 &&
                        board[i][j].getToken() === board[i + 1][j - 1].getToken() &&
                        board[i][j].getToken() === board[i + 2][j - 2].getToken() &&
                        board[i][j].getToken() === board[i + 3][j - 3].getToken()) {
                        winningCells = [board[i][j], board[i + 1][j - 1], board[i + 2][j - 2], board[i + 3][j - 3]];
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
        winningCells = [];
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

    return { getRoundWinner, getPlayersScore, initGame, resetGame, getCurrentPlayer, switchPlayer, checkIfValidMove, checkIfWin, checkIfDraw, player1, player2, winningCells};
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

    const clearBoard = () => {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        };
    };

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

    const getTopCell = (column) => {
        const boardArr = Board.getBoard();
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j === column && boardArr[i][j].getToken() !== EMPTY_TOKEN) {
                    let cellNum = boardArr[i][j].getCellNum();
                    let cell = getCellDiv(cellNum);
                    return cell;
                };         
            };
        };
        return null;
    };

    const addListener = (element, handler, event = "click") => {
        element.addEventListener(event, handler);
    };

    const removeListener = (element, handler, event = "click") => {
        element.removeEventListener(event, handler);
    };

    const clearCellListeners = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', cellHandler);
        });
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

    const startBtnHandler = async () => {
        removeListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "Exit";
        rowsInput.value = 6;
        columnsInput.value = 7;
        player1NameInput.value = "Player 1";
        player2NameInput.value = "Player 2";
        await startScreenTransitionAnimation();
        addListener(startGameBtn, startGameBtnHandlerHome);
        addListener(settingsBackBtn, backBtnHandlerHome);
        changeScreen(SETTINGS_SCREEN);
    };

    const backBtnHandlerHome = async () => {
        await settingsExitAnimation();
        changeScreen(START_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        addListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "";
    };

    const startGameBtnHandlerHome = async () => {
        removeListener(startGameBtn, startGameBtnHandlerHome);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        getSettings();
        handleGame();
        await gameStartAnimation();
        changeScreen(GAME_SCREEN);
        settingsBackBtn.innerHTML = "";
    };

    const backBtnHandlerGame = async () => {
        await gameBackAnimation();
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

    const startGameBtnHandlerGame = async () => {
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        GameControls.player1.resetScore();
        GameControls.player2.resetScore();
        getSettings();
        restartBtnHandler();
    };

    const settingsBtnHandler = async () => {
        settingsBackBtn.innerHTML = "Back";
        await gameSettingsAnimation();
        changeScreen(SETTINGS_SCREEN);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startGameBtn, startGameBtnHandlerGame);
        addListener(settingsBackBtn, backBtnHandlerGame);
    };

    const restartBtnHandler = async () => {
        clearCellListeners();
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        clearBoard();
        GameControls.resetGame();
        handleGame();
        if (END_SCREEN.classList.contains("display-on")) {
            await endRestartAnimation();
        } else {
            await gameStartAnimation();
        };
        changeScreen(GAME_SCREEN);
    };

    const exitBtnHandler = async () => {
        if (END_SCREEN.classList.contains("display-on")) {
            removeListener(restartBtn, restartBtnHandler);
            removeListener(exitBtn, exitBtnHandler);
            await endExitAnimation();
        } else {
            await gameExitAnimation();
        };
        clearCellListeners();
        changeScreen(START_SCREEN);
        addListener(startBtn, startBtnHandler);
        clearBoard();
        GameControls.resetGame();
        GameControls.player1.resetScore();
        GameControls.player2.resetScore();
    };

    const handleGame = () => {
        GameControls.initGame();
        renderBoard();
        renderGamePlayer();
    };

    const cellHandler = async (e) => {
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
        checkFullRow();
        renderBoard();
        await insertTokenAnimation(cell);
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

    const setFullRow = async (column) => {
        const boardArr = Board.getBoard();
        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLUMNS; j++) {
                if (j === column) {
                    boardArr[i][j].dataset.fullRow = "true";
                };
            };
        };
    };

    const checkFullRow = async () => {
        const boardArr = Board.getBoard();
        for (i = 0; i < COLUMNS; i++) {
            if (boardArr[0][i].getToken() !== EMPTY_TOKEN && boardArr[0][i].getFullRow() === false) {
                setFullRow(i);
            };
        };
    };
    const renderBoard = async () => {
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
                cell.dataset.fullRow = boardArr[i][j].getFullRow();
                if (cell.dataset.fullRow === "true") {
                    cell.classList.add('full-row');
                };
                if (cell.dataset.token === GameControls.player1.getToken()) {
                    cell.classList.add('cell-player1');
                } else if (cell.dataset.token === GameControls.player2.getToken()) {
                    cell.classList.add('cell-player2');
                } else {
                    cell.classList.add('cell-empty');
                };
                if (i === 0) {
                    cell.classList.add('cell-top');
                };;
                cell.addEventListener('click', cellHandler);
                row.appendChild(cell);
            };
        };
    };

    const startScreenTransitionAnimation = async () => {
        START_SCREEN.classList.add("start-screen-start-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-start-animation");
        SETTINGS_SCREEN.classList.add("display-on");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-start-animation");
        START_SCREEN.classList.remove("start-screen-start-animation");
        START_SCREEN.classList.remove("display-on");
    };

    const settingsExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        SETTINGS_SCREEN.classList.add("settings-screen-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-exit-animation");
        SETTINGS_SCREEN.classList.remove("display-on");
    };

    const gameStartAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-start-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-game-start-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-game-start-animation");
        GAME_SCREEN.classList.remove("game-screen-game-start-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    const gameExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        GAME_SCREEN.classList.remove("game-screen-game-exit-animation");

        GAME_SCREEN.classList.remove("display-on");
    };

    const gameSettingsAnimation = async () => {
        SETTINGS_SCREEN.classList.remove("display-off");
        SETTINGS_SCREEN.classList.add("display-on");
        SETTINGS_SCREEN.classList.add("settings-screen-game-settings-animation");
        GAME_SCREEN.classList.add("game-screen-game-settings-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-game-settings-animation");
        GAME_SCREEN.classList.remove("game-screen-game-settings-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    const gameBackAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-back-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-game-back-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("display-on");
        SETTINGS_SCREEN.classList.remove("settings-screen-game-back-animation");
        GAME_SCREEN.classList.remove("game-screen-game-back-animation");
      
    };
    
    const gameStartDecorativeAnimation = async () => {};

    const endRestartAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-end-restart-animation");
        END_SCREEN.classList.add("end-screen-end-restart-animation");
        await new Promise(r => setTimeout(r, 500));
        END_SCREEN.classList.remove("end-screen-end-restart-animation");
        GAME_SCREEN.classList.remove("game-screen-end-restart-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    const endExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        START_SCREEN.classList.add("start-screen-end-exit-animation");
        END_SCREEN.classList.add("end-screen-end-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        END_SCREEN.classList.remove("end-screen-end-exit-animation");
        START_SCREEN.classList.remove("start-screen-end-exit-animation");
        END_SCREEN.classList.remove("display-on");
    };

    const getCellDiv = (cellIndex) => {
        let cells = Array.from(document.querySelectorAll('.cell'));
        return cells[cellIndex];
    };

    const insertTokenAnimation = async (token) => {
        let tempCol = parseInt(token.dataset.cellNum) % COLUMNS;
        let topCell = getTopCell(tempCol);
        let rowOfTopCell = parseInt(parseInt(topCell.dataset.cellNum) / COLUMNS);
        switch (rowOfTopCell) {
            case 0:
                topCell.classList.add('insert-token-row-0');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-0');
                break;
            case 1:
                topCell.classList.add('insert-token-row-1');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-1');
                break;
            case 2:
                topCell.classList.add('insert-token-row-2');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-2');
                break;
            case 3:
                topCell.classList.add('insert-token-row-3');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-3');
                break;
            case 4:
                topCell.classList.add('insert-token-row-4');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-4');
                break;
            case 5:
                topCell.classList.add('insert-token-row-5');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-5');
                break;
            case 6:
                topCell.classList.add('insert-token-row-6');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-6');
                break;
            case 7:
                topCell.classList.add('insert-token-row-7');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-7');
                break;
            case 8:
                topCell.classList.add('insert-token-row-8');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-8');
                break;
        };
    };

    const fillingColumnAnimation = async (cell) => {
        let columnNum = parseInt(cell.dataset.cellNum) % COLUMNS;
        let column = document.querySelectorAll(`[data-cell-num="${columnNum}"]`);
        column.forEach(cell => {
            cell.classList.add('filling-column');
        });
        await new Promise(r => setTimeout(r, 500));
        column.forEach(cell => {
            cell.classList.remove('filling-column');
        });
    };

    const winningCellsAnimation = async () => {};

    const drawCellsAnimation = async () => {};

    const winAnimation = async () => {};

    const drawAnimation = async () => {};

    const init = () => {
        addListener(startBtn, startBtnHandler);
    };

    return { init };

})();

DOMControls.init();