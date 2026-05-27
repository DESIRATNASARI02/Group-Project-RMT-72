export const GRID_SIZE = 10;
export const COLS = ["A","B","C","D","E","F","G","H","I","J"];

export const SHIPS_CONFIG = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

export const CELL_STATUS = {
  WATER: "water",
  SHIP: "ship",
  HIT: "hit",
  MISS: "miss",
  SUNK: "sunk",
};

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

export function createEmptyShots() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
}

export function isValidPlacement(grid, row, col, size, isHorizontal) {
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
}

export function placeShipOnGrid(grid, row, col, size, isHorizontal, shipName) {
  const newGrid = grid.map((r) => [...r]);
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    newGrid[r][c] = shipName;
  }
  return newGrid;
}
