const GRID_SIZE = 10;

class AIBot {
  constructor() {
    this.mode = "hunt"; 
    this.lastHit = null;
    this.hitStack = []; 
    this.shotsFired = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(false)
    );
  }

  getNextShot() {
    let row, col;

    if (this.mode === "target" && this.hitStack.length > 0) {
      const next = this.hitStack.pop();
      row = next.row;
      col = next.col;
    } else {
      this.mode = "hunt";
      ({ row, col } = this._huntShot());
    }

    this.shotsFired[row][col] = true;
    return { row, col };
  }

  processResult(row, col, result) {
    if (result === "hit" || result === "sunk") {
      this.lastHit = { row, col };
      if (result === "hit") {
        this.mode = "target";
        this._addAdjacentCells(row, col);
      } else {
        this.mode = "hunt";
        this.hitStack = [];
        this.lastHit = null;
      }
    }
  }

  _huntShot() {
    const candidates = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!this.shotsFired[r][c] && (r + c) % 2 === 0) {
          candidates.push({ row: r, col: c });
        }
      }
    }
    if (candidates.length === 0) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (!this.shotsFired[r][c]) candidates.push({ row: r, col: c });
        }
      }
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  _addAdjacentCells(row, col) {
    const directions = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    directions.forEach(({ row: r, col: c }) => {
      if (
        r >= 0 &&
        r < GRID_SIZE &&
        c >= 0 &&
        c < GRID_SIZE &&
        !this.shotsFired[r][c]
      ) {
        this.hitStack.push({ row: r, col: c });
      }
    });
  }
}

module.exports = AIBot;
