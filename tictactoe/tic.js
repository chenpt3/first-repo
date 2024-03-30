const BOARD_SIZE = 9;
const BOARD_WIDTH = 3;
const EMPTY_MARK = null;
const PLAYER1_MARK = "X";
const PLAYER2_MARK = "O";
let PLAYER1_NAME = "Player 1";
let PLAYER2_NAME = "Player 2";

const GameBoard = (() => {
    const board = Array(BOARD_SIZE).fill(EMPTY_MARK);
    const getBoard = () => board;
    const setBoard = (index, mark) => board[index] = mark;
    const resetBoard = () => board.fill(EMPTY_MARK);
    return { setBoard, getBoard, resetBoard};
})();

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    let score = 0;
    return { getName, getMark, score };
};

const Game = (() => {
    const player1 = Player(PLAYER1_NAME, PLAYER1_MARK);
    const player2 = Player(PLAYER2_NAME, PLAYER2_MARK);
    let currentPlayer = player1;

    const checkWin = (mark) => {
        const board = GameBoard.getBoard();
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < winCombos.length; i++) {
            let [a, b, c] = winCombos[i];
            if (board[a] === mark && board[b] === mark && board[c] === mark) {
                return true;
            }
        }
        return false;
    };

    const checkDraw = () => {
        if (GameBoard.getBoard().every(cell => cell !== EMPTY_MARK)) {
            return true;
        }
        return false;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkIfValid = (index) => {
        if (GameBoard.getBoard()[index] === EMPTY_MARK) {
            return true;
        }
        return false;
    };

    const setScores = (p1, p2) => {
        player1.score = p1;
        player2.score = p2;
    };

    const getScores = () => {
        return [player1.score, player2.score];
    }

    const play = (index) => {
        if (checkIfValid(index)) {
            GameBoard.setBoard(index, currentPlayer.getMark());
            if (checkWin(currentPlayer.getMark())) {
                currentPlayer.score++;
                return currentPlayer;
            } else if (checkDraw()) {
                return "draw";
            } else {
                switchPlayer();
                return null;
            };
        };
    };

    return { play, currentPlayer, getScores, setScores, player1};
})();

const UI = (() => {
    const START_DIV = document.getElementById("start");
    const PREGAME_DIV = document.getElementById("pre-game");
    const GAME_DIV = document.getElementById("game");
    const ENDING_DIV = document.getElementById("ending");
    const WINNER_DIV = document.getElementById("winner");
    const DRAW_DIV = document.getElementById("draw");
    const P1_SCORE = document.getElementById("p1-score");
    const P2_SCORE = document.getElementById("p2-score");
    const START_BTN_1 = document.getElementById("start1");
    const START_BTN_2 = document.getElementById("start2");
    const GAME_BOARD = document.getElementById("game-board");
    const PLAYER_1_INPUT = document.getElementById("player1");
    const PLAYER_2_INPUT = document.getElementById("player2");
    const WINNER_SPAN = document.getElementById("winner-span");
    const REPLAY_YES = document.getElementById("yes");
    const REPLAY_NO = document.getElementById("no");

    const startBtnEvent = () => {
        START_DIV.classList.add("display-off");
        START_DIV.classList.remove("display-on");
        PREGAME_DIV.classList.remove("display-off");
        PREGAME_DIV.classList.add("display-on");
        START_BTN_1.removeEventListener("click", startBtnEvent);
        START_BTN_2.addEventListener("click", startBtn2Event);
    };

    const startBtn2Event = () => {
        PREGAME_DIV.classList.add("display-off");
        PREGAME_DIV.classList.remove("display-on");
        GAME_DIV.classList.remove("display-off");
        GAME_DIV.classList.add("display-on");
        if (PLAYER_1_INPUT.value !== "") PLAYER1_NAME = PLAYER_1_INPUT.value;
        if (PLAYER_2_INPUT.value !== "") PLAYER2_NAME = PLAYER_2_INPUT.value;
        START_BTN_2.removeEventListener("click", startBtn2Event);
        createCells();
        updateScores();
    };

    const updateScores = () => {
        let scores = Game.getScores();
        P1_SCORE.textContent = scores[0];
        P2_SCORE.textContent = scores[1];
    };

    const cellEvent = (e) => {
        let index = e.target.classList[1].split("-")[1];
        let state = Game.play(index);
        updateCell();
        if (state !== null) {
            updateScores();
            for (i = 0; i < BOARD_SIZE; i++) {
                let cell = document.querySelector(`.cell-${i}`);
                cell.removeEventListener("click", cellEvent);
            };
            endingEvent(state);
        };
    };

    const yesEvent = () => {
        ENDING_DIV.classList.add("display-off");
        ENDING_DIV.classList.remove("display-on");
        DRAW_DIV.classList.add("display-off");
        DRAW_DIV.classList.remove("display-on");
        WINNER_DIV.classList.add("display-off");
        WINNER_DIV.classList.remove("display-on");
        WINNER_SPAN.textContent = "";
        REPLAY_NO.removeEventListener("click", noEvent);
        REPLAY_YES.removeEventListener("click", yesEvent);
        GAME_DIV.classList.remove("display-off");
        GAME_DIV.classList.add("display-on");
        for (i = 0; i < BOARD_SIZE; i++) {
            let cell = document.querySelector(`.cell-${i}`);
            cell.addEventListener("click", cellEvent);
        };
        GameBoard.resetBoard();
        Game.currentPlayer = Game.player1;
        updateCell();
        updateScores();
    };

    const noEvent = () => {
        ENDING_DIV.classList.add("display-off");
        ENDING_DIV.classList.remove("display-on");
        DRAW_DIV.classList.add("display-off");
        DRAW_DIV.classList.remove("display-on");
        WINNER_DIV.classList.add("display-off");
        WINNER_DIV.classList.remove("display-on");
        WINNER_SPAN.textContent = "";
        REPLAY_NO.removeEventListener("click", noEvent);
        REPLAY_YES.removeEventListener("click", yesEvent);
        START_DIV.classList.remove("display-off");
        START_DIV.classList.add("display-on");
        START_BTN_1.addEventListener("click", startBtnEvent);
        deleteCells();
        GameBoard.resetBoard();
        Game.currentPlayer = Game.player1;
        Game.setScores(0, 0);
        updateScores();
    };

    const endingEvent = (state) => {
        GAME_DIV.classList.add("display-off");
        GAME_DIV.classList.remove("display-on");
        ENDING_DIV.classList.remove("display-off");
        ENDING_DIV.classList.add("display-on");
        if (state === "draw") {
            DRAW_DIV.classList.remove("display-off");
            DRAW_DIV.classList.add("display-on");
        } else {
            WINNER_DIV.classList.remove("display-off");
            WINNER_DIV.classList.add("display-on");
            WINNER_SPAN.textContent = state.getName();
        };
        REPLAY_YES.addEventListener("click", yesEvent);
        REPLAY_NO.addEventListener("click", noEvent);
    };

    const updateCell = () => {
        const board = GameBoard.getBoard();
        for (i = 0; i < BOARD_SIZE; i++) {
            let cell = document.querySelector(`.cell-${i}`);
            cell.textContent = board[i];
        };
    };

    const deleteCells = () => {
        for (i = 0; i < BOARD_SIZE; i++) {
            let cell = document.querySelector(`.cell-${i}`);
            cell.remove();
        };
    };

    const createCells = () => {
        const board = GameBoard.getBoard();
        for (i = 0; i < BOARD_SIZE; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add(`cell-${i}`);
            cell.textContent = board[i];
            GAME_BOARD.appendChild(cell);
            cell.addEventListener("click", cellEvent);
        };
    }

    START_BTN_1.addEventListener("click", startBtnEvent);

    return { };
})();
