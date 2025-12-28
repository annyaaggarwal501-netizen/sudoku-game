const grid = document.getElementById("sudoku-grid");
const solveBtn = document.getElementById("solve-btn");
const resetBtn = document.getElementById("reset-btn");
const timerEl = document.getElementById("timer");

/* ==================== TIMER ==================== */
/* ==================== TIMER ==================== */
const startDate = new Date().getTime();
let timer;

function startTimer() {
    timer = setInterval(function () {

        const now = new Date().getTime();
        const endTime = startDate + 5 * 60 * 1000;
        const distancePending = endTime - now;

        const mins = Math.floor((distancePending % (60 * 60 * 1000)) / (60 * 1000));
        const secs = Math.floor((distancePending % (60 * 1000)) / 1000);

        document.getElementById("time").innerHTML =
            "Time : " + mins + ":" + (secs < 10 ? "0" + secs : secs);

        if (distancePending <= 0) {
            clearInterval(timer);
            const main = document.getElementById("main");
    main.innerHTML = `<h2>⏰ Time Up!</h2>`
            showTimeUpOptions();
        }

    }, 1000);
}




/* ==================== SUDOKU GENERATION ==================== */
function generateEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
        if (board[x][col] === num) return false;
    }

    const sr = row - (row % 3);
    const sc = col - (col % 3);

    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[sr + i][sc + j] === num) return false;

    return true;
}

function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const nums = shuffle([1,2,3,4,5,6,7,8,9]);
                for (let num of nums) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeNumbers(board, count) {
    while (count > 0) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (board[r][c] !== 0) {
            board[r][c] = 0;
            count--;
        }
    }
}

/* ==================== CREATE PUZZLE ==================== */
let solution = generateEmptyBoard();
fillBoard(solution);

let puzzle = JSON.parse(JSON.stringify(solution));
removeNumbers(puzzle, 45); // difficulty

/* ==================== CREATE GRID ==================== */
function createGrid() {
    for (let r = 0; r < 9; r++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < 9; c++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.maxLength = "1";

            if (puzzle[r][c] !== 0) {
                input.value = puzzle[r][c];
                input.disabled = true;
            } else {
                input.addEventListener("input", () => {
                    if (!/^[1-9]$/.test(input.value)) {
                        input.value = "";
                    }
                });
            }

            td.appendChild(input);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}

createGrid();
startTimer();

/* ==================== CHECK USER SOLUTION ==================== */
function checkUserSolution() {
    const rows = grid.querySelectorAll("tr");
    for (let i = 0; i < 9; i++) {
        const cells = rows[i].querySelectorAll("input");
        for (let j = 0; j < 9; j++) {
            if (parseInt(cells[j].value) !== solution[i][j]) {
                return false;
            }
        }
    }
    return true;
}

/* ==================== SHOW SOLUTION ==================== */
function showSolution() {
    clearInterval(timer);
    const rows = grid.querySelectorAll("tr");
    rows.forEach((row, i) => {
        row.querySelectorAll("input").forEach((cell, j) => {
            cell.value = solution[i][j];
            cell.disabled = true;
        });
    });
}

/* ==================== BUTTON EVENTS ==================== */
solveBtn.addEventListener("click", () => {
    clearInterval(timer);
    if (checkUserSolution()) {
        alert("🎉 Congratulations! You WON!");
    } else {
        alert("❌ Wrong solution! You lost.");
        showSolution();
    }
});

resetBtn.addEventListener("click", () => location.reload());