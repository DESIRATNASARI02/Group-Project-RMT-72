const GRID_SIZE = 10;

const SHIPS_CONFIG = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function isValidPlacement(grid, row, col, size, isHorizontal) {
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
}

function placeShip(grid, row, col, size, isHorizontal, shipName) {
  const newGrid = grid.map((r) => [...r]);
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    newGrid[r][c] = shipName;
  }
  return newGrid;
}

function processShot(board, row, col) {
  if (board.shots[row][col]) return { result: "already_shot" };

  const newShots = board.shots.map((r) => [...r]);
  newShots[row][col] = true;

  const hit = board.grid[row][col] !== null;
  const shipName = board.grid[row][col];

  let sunk = false;
  if (hit) {
    sunk = isShipSunk(board.grid, newShots, shipName);
  }

  const allSunk = checkAllSunk(board.grid, newShots);

  return {
    result: hit ? (sunk ? "sunk" : "hit") : "miss",
    shipName: hit ? shipName : null,
    row,
    col,
    shots: newShots,
    gameOver: allSunk,
  };
}

function isShipSunk(grid, shots, shipName) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === shipName && !shots[r][c]) return false;
    }
  }
  return true;
}

function checkAllSunk(grid, shots) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== null && !shots[r][c]) return false;
    }
  }
  return true;
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

module.exports = {
  SHIPS_CONFIG,
  GRID_SIZE,
  createEmptyGrid,
  isValidPlacement,
  placeShip,
  processShot,
  generateRoomCode,
};
