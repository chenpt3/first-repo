const gameBoard = () => {
    const rows = 3;
    const cols = 3;
    let board = [];

    const newBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push([]);
            for (let j = 0; j < cols; j++) {
                board[i].push[j];
            };
        };
        console.log(board);
    };

    return {newBoard};
};

const board = gameBoard();
board.newBoard();