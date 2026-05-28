import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";
import { SHIPS_CONFIG, createEmptyGrid, isValidPlacement, placeShipOnGrid } from "../utils/gameUtils";
import Grid from "../components/Board/Grid";

export default function PlaceShips() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [grid, setGrid] = useState(createEmptyGrid());
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [placedShips, setPlacedShips] = useState([]);

  useEffect(() => {
    socket.on("battle_start", (data) => {
      dispatch({ type: "BATTLE_START", payload: data });
      navigate("/battle");
    });

    return () => {
      socket.off("battle_start");
    };
  }, []);

  const remainingShips = SHIPS_CONFIG.filter((s) => !placedShips.includes(s.name));
  const currentShip = remainingShips[0];

  function handleCellClick(row, col) {
    if (!currentShip) return;
    if (!isValidPlacement(grid, row, col, currentShip.size, isHorizontal)) return;
    const newGrid = placeShipOnGrid(grid, row, col, currentShip.size, isHorizontal, currentShip.name);
    setGrid(newGrid);
    setPlacedShips([...placedShips, currentShip.name]);
  }

  function handleReset() {
    setGrid(createEmptyGrid());
    setPlacedShips([]);
  }

  function handleReady() {
    if (placedShips.length < SHIPS_CONFIG.length) return;
    dispatch({ type: "UPDATE_MY_GRID", payload: grid });
    socket.emit("ships_placed", { code: state.roomCode, grid });
  }

  const allPlaced = placedShips.length === SHIPS_CONFIG.length;

  return (
    <div className="min-h-screen bg-[#0a1628] p-6" style={{ zoom: "150%" }}>
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold text-blue-400">⚓ Susun Armada</h2>
        <p className="text-slate-400 text-sm">Tempatkan semua kapalmu sebelum battle dimulai</p>
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <div>
          <Grid grid={grid} shots={null} onCellClick={handleCellClick} interactive={!allPlaced} />
        </div>

        <div className="flex flex-col gap-3 w-52">
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm transition-colors"
              onClick={() => setIsHorizontal(!isHorizontal)}
            >
              {isHorizontal ? "↔ Horizontal" : "↕ Vertikal"}
            </button>
            <button
              className="px-3 py-2 border border-slate-600 text-slate-400 hover:bg-slate-800 rounded-lg text-sm transition-colors"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-3">Kapal tersisa:</p>
            <div className="flex flex-col gap-2">
              {SHIPS_CONFIG.map((ship) => {
                const placed = placedShips.includes(ship.name);
                return (
                  <div key={ship.name} className="flex items-center justify-between">
                    <span className={`text-xs ${placed ? "text-green-400" : "text-slate-300"}`}>
                      {ship.name} ({ship.size})
                    </span>
                    <div className="flex gap-1">
                      {Array(ship.size).fill(0).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${placed ? "bg-green-500" : "bg-slate-500"}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {currentShip && (
          <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-400">
            <p>Menempatkan: <span className="text-blue-400 font-medium">{currentShip.name}</span></p>
            <p>Jumlah kotak: <span className="text-blue-400 font-medium">{currentShip.size}</span></p>
          </div>
          )}

          {allPlaced && (
            <button
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              onClick={handleReady}
            >
              Siap Battle! ⚔️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}