// Cell object
const Cell = () => {
    let value = null;

    const setValue = (newValue) => {
        value = newValue;
    };

    const getValue = () => {
        return value;
    };

    return {
        setValue,
        getValue
    };
};

// Game board object
const GameBoard = (() => {
    const cells = Array(9).fill(Cell());

    const getCell = (position) => {
        return cells[position];
    };

    const printBoard = () => {
        let boardString = '';
        for (let i = 0; i < cells.length; i++) {
            const cellValue = cells[i].getValue();
            boardString += cellValue !== null ? cellValue : '-';
            if (i % 3 === 2) {
                boardString += '\n';
            } else {
                boardString += ' ';
            }
        }
        console.log(boardString);
    };

    return {
        getCell,
        printBoard
    };
})();

// Player object
const Player = (name, symbol) => {
    const getName = () => {
        return name;
    };

    const getSymbol = () => {
        return symbol;
    };

    return {
        getName,
        getSymbol
    };
};

// Game flow object
const GameFlow = (() => {
    const players = [
        Player('Player 1', 'X'),
        Player('Player 2', 'O')
    ];
    let currentPlayerIndex = 0;

    const getCurrentPlayer = () => {
        return players[currentPlayerIndex];
    };

    const switchPlayer = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    };

    const makeMove = (position) => {
        const cell = GameBoard.getCell(position);
        if (cell.getValue() !== null) {
            console.log('Invalid move. Position already occupied.');
            return;
        }

        const currentPlayer = getCurrentPlayer();
        cell.setValue(currentPlayer.getSymbol());
        switchPlayer();
    };

    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const cellA = GameBoard.getCell(a).getValue();
            const cellB = GameBoard.getCell(b).getValue();
            const cellC = GameBoard.getCell(c).getValue();
            if (
                cellA !== null &&
                cellA === cellB &&
                cellA === cellC
            ) {
                return cellA;
            }
        }

        return null;
    };

    const isBoardFull = () => {
        for (const cell of GameBoard.cells) {
            if (cell.getValue() === null) {
                return false;
            }
        }
        return true;
    };

    return {
        makeMove,
        checkWin,
        isBoardFull
    };
})();

// Usage example:
GameFlow.makeMove(0);
