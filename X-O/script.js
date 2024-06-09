const mainObject = {
    statusText: document.getElementById("statusText"),
    restartBtn: document.getElementById("restartBtn"),
    humanScore: document.getElementById("human"),
    mode: document.getElementById("mode"),
    aiScore: document.getElementById("ai"),
    cells: document.querySelectorAll(".cell"),
    cellContainer: document.querySelector(".cellContainer"),
    modeBtn: document.querySelector(".mode"),
    aiTurn: false,
    running: true,
    easy: true,
    playerList: ["", "", "", "", "", "", "", "", ""],
    aiList: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    players: ["X", "O"],
    timeOut: 0,
    scores: {
        ai: 0,
        human: 0,
    },
    winConditions: [
        [0, 1, 2], [3, 4, 5],
        [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
}

mainObject.restartBtn.addEventListener('click', restartGame)
mainObject.modeBtn.addEventListener('click', changeMode)
mainObject.cells.forEach(cell => cell.addEventListener('click', cellClicked))

mainObject.human = mainObject.players[Math.floor(Math.random() * mainObject.players.length)]
mainObject.ai = mainObject.human == 'X' ? "O" : "X"
mainObject.cellContainer.classList.add(mainObject.human)
mainObject.statusText.textContent = `Your Turn as ${mainObject.human}`
mainObject.restartBtn.textContent = `Play as ${mainObject.ai}`

function restartGame() {
    clearTimeout(mainObject.timeOut)
    mainObject.cellContainer.classList.remove(mainObject.human)
    mainObject.cellContainer.classList.remove("draw")
    mainObject.cells.forEach(cell => {
        cell.classList.remove('O');
        cell.classList.remove('X');
        cell.classList.remove('win');
    });
    mainObject.aiTurn = false;
    mainObject.running = true;
    mainObject.playerList = ["", "", "", "", "", "", "", "", ""];
    mainObject.aiList = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    mainObject.human = mainObject.human == "X" ? "O" : "X";
    mainObject.ai = mainObject.human == 'X' ? "O" : "X";
    mainObject.statusText.textContent = `Your Turn as ${mainObject.human}`
    mainObject.restartBtn.textContent = `Play as ${mainObject.ai}`
    mainObject.cellContainer.classList.add(mainObject.human)
    return
};

function changeMode() {
    if (mainObject.modeBtn.textContent === "Hard Mode") {
        mainObject.easy = false
        mainObject.modeBtn.classList.remove("easy")
        mainObject.modeBtn.classList.add("hard")
        mainObject.mode.textContent = "Mode: Hard"
        mainObject.modeBtn.textContent = "Easy Mode"
    }
    else {
        mainObject.easy = true
        mainObject.modeBtn.classList.remove("hard")
        mainObject.modeBtn.classList.add("easy")
        mainObject.mode.textContent = "Mode: Easy"
        mainObject.modeBtn.textContent = "Hard Mode"
    }
    restartGame();
    return
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (mainObject.playerList[cellIndex] != "" || !mainObject.running || mainObject.aiTurn) return;

    this.classList.add(mainObject.human);
    mainObject.cellContainer.classList.remove(mainObject.human)

    mainObject.playerList[cellIndex] = mainObject.human;
    mainObject.aiList.splice(mainObject.aiList.indexOf(parseInt(cellIndex)), 1);

    const check = checkWinner();
    if (check) return;
    aiPlayTurn();
    return
};

function aiPlayTurn() {

    mainObject.aiTurn = true
    mainObject.statusText.textContent = "Ai Turn"
    if (!mainObject.easy) {
        const bestMove = findBestMove();
        if (bestMove) {
            mainObject.timeOut = setTimeout(() => {
                mainObject.aiTurn = false
                mainObject.cellContainer.classList.add(mainObject.human)
                mainObject.cells[bestMove].classList.add(mainObject.ai);
                mainObject.playerList[bestMove] = mainObject.ai;
                mainObject.statusText.textContent = `Your Turn`
                checkWinner();
            }, 1000)
            return
        }
    }
    mainObject.timeOut = setTimeout(() => {
        mainObject.aiTurn = false
        const myRand = Math.floor(Math.random() * mainObject.aiList.length)
        mainObject.cellContainer.classList.add(mainObject.human)
        mainObject.cells[mainObject.aiList[myRand]].classList.add(mainObject.ai);
        mainObject.playerList[mainObject.aiList[myRand]] = mainObject.ai;
        mainObject.statusText.textContent = `Your Turn`
        mainObject.aiList.splice(myRand, 1)
        checkWinner();
    }, 1000)
    return
}

function minimax(board, depth, isMax) {
    const score = evaluate(board);

    if (score == 1)
        return score;

    if (score == -1)
        return score;

    if (score == 0)
        return 0;

    if (isMax) {
        let best = -1;

        for (let i in board) {

            if (board[i] == '') {

                board[i] = mainObject.ai;

                best = Math.max(best, minimax(board,
                    depth + 1, !isMax));

                board[i] = '';
            }

        }
        return best;
    }

    else {
        let best = 1;

        for (let i in board) {

            if (board[i] == '') {

                board[i] = mainObject.human;

                best = Math.min(best, minimax(board,
                    depth + 1, !isMax));

                board[i] = '';
            }
        }
        return best;
    }
}

function findBestMove() {
    let bestVal = -1;
    let bestMove;

    for (let i in mainObject.playerList) {

        if (mainObject.playerList[i] == '') {

            mainObject.playerList[i] = mainObject.ai;

            let moveVal = minimax(mainObject.playerList, 0, false);

            mainObject.playerList[i] = '';

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }

    }
    return bestMove;
}

function evaluate(board) {

    for (let i in mainObject.winConditions) {
        const condition = mainObject.winConditions[i];
        const cellA = board[condition[0]];
        const cellB = board[condition[1]];
        const cellC = board[condition[2]];

        if ((cellA == cellB && cellB == cellC) && cellA != '') {
            if (cellA == mainObject.ai) return +1;
            return -1;
        };
    };

    if (!board.includes("")) {
        return 0;
    }
    return
};

function checkWinner() {

    for (let i in mainObject.winConditions) {
        const condition = mainObject.winConditions[i];
        const cellA = mainObject.playerList[condition[0]];
        const cellB = mainObject.playerList[condition[1]];
        const cellC = mainObject.playerList[condition[2]];

        if ((cellA == cellB && cellB == cellC) && cellA != '') {
            mainObject.running = false;
            mainObject.restartBtn.textContent = "Restart";
            mainObject.statusText.textContent = cellA == mainObject.ai ? "Ai Won!" : "You Won!"
            cellA == mainObject.ai ? mainObject.scores.ai += 1 : mainObject.scores.human += 1;
            mainObject.aiScore.textContent = `Ai: ${mainObject.scores.ai}`
            mainObject.humanScore.textContent = `You: ${mainObject.scores.human}`
            mainObject.cells[condition[0]].classList.add('win');
            mainObject.cells[condition[1]].classList.add('win');
            mainObject.cells[condition[2]].classList.add('win');
            mainObject.cellContainer.classList.remove(mainObject.human);
            return true
        };
    };

    if (!mainObject.playerList.includes("")) {
        mainObject.running = false;
        mainObject.restartBtn.textContent = "Restart";
        mainObject.cellContainer.classList.remove(mainObject.human);
        mainObject.statusText.textContent = "Draw!";
        mainObject.cellContainer.classList.add("draw");
        return true
    }
    return false
};