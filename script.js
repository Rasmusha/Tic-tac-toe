
let player1, player2

document.getElementById('start-button').addEventListener('click', function() {
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    if (!player1Name || !player2Name) {
        alert("Please enter both player names to start the game.");
        return;
    }

    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('game-board').style.display = 'flex';

    document.getElementById('player1-score').textContent = `${player1Name}: 0`;
    document.getElementById('player2-score').textContent = `${player2Name}: 0`;

    player1 = player(player1Name, "O");
    player2 = player(player2Name, "X");

    gameController(player1,player2).startGame();
    
})

document.getElementById('restart-button').addEventListener('click', function() {
    document.getElementById('player1-name').value = ''
    document.getElementById('player2-name').value = ''

    document.getElementById('board-container').innerHTML = '';

    document.getElementById('game-setup').style.display = 'flex';
    document.getElementById('game-board').style.display = 'none';
})

document.getElementById('new-game-button').addEventListener('click', function() {
    document.getElementById('board-container').innerHTML = '';
    document.getElementById('notification').style.display = 'none';
    document.getElementById('new-game-button').style.display = 'none';

    gameController(player1,player2).startGame();
})

function gameBoard() {
    const board = ['','','','','','','','',''];

    function updateBoard(index, player) {
        if(index < 0 || index >= board.length || board[index] === 'X' || board[index] === 'O') {
            return false;
        }
        else {
            board[index] = player;
            const cell = document.querySelector(`.cell[data-index='${index}'`)
            cell.textContent = player;
            return true;
        }
    }

    function renderBoard() {
        const boardContainer = document.getElementById('board-container')
        for(let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            boardContainer.appendChild(cell);
        }
    }

    function isFull() {
        for(let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                return false;
            }
        } 
        return true;
    }

    function checkWin() {
        const winConditions = [
            [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
        ]
        for(const line of winConditions ) {
            const[a,b,c] = line;
            if(board[a] && board[a] === board[b] && board[b] === board[c])
                return board[a];
        }
        return null;
    }

    return {renderBoard, updateBoard, isFull, checkWin}
};

function player(name, symbol) {
    let score = 0;

    function makeMove(index, board) {
        const moveSuccess = board.updateBoard(index, symbol);
        return moveSuccess;
    }

    function setPlayer() {
        return {
            name: name,       
            symbol: symbol,
        }
    }

    function incrementScore() {
        score++;
    }

    function getScore() {
        return score;
    }

    return {setPlayer, makeMove, incrementScore, getScore};

}

function gameController (player1,player2) {
    const board = gameBoard();
    let currentPlayer = player1;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1
    }

    function startGame() {
        board.renderBoard();
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick))
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        handleMove(index);
    }

    function handleMove(index) {
        const move = currentPlayer.makeMove(index, board);
        if(move) {
            if (checkGameOver()) {
                document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick))
                isGameOver = true;
                return;
            }
            switchPlayerTurn();
        } else {
            return;
        }
    }  

    function checkGameOver() {
        const winner = board.checkWin();
        if(winner) {
            currentPlayer.incrementScore();
            updateScore();
            showNotification(`${currentPlayer.setPlayer().name} wins!`);
            document.getElementById('new-game-button').style.display = 'block'
            return true;
        } else if (board.isFull()) {
            showNotification("It's a draw!");
            document.getElementById('new-game-button').style.display = 'block';
            return true;
        }
        return false;
    }

    function updateScore() {
        document.getElementById('player1-score').textContent = `${player1.setPlayer().name}: ${player1.getScore()}`;
        document.getElementById('player2-score').textContent = `${player2.setPlayer().name}: ${player2.getScore()}`;
        
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block'
    }

    return {
        startGame, handleMove
    };
} 