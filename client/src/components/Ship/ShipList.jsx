import { SHIPS_CONFIG } from "../../utils/gameUtils";

export default function ShipList({ grid, shots, title }) {
  function getShipHealth(shipName, size) {
    if (!grid || !shots) return Array(size).fill("alive");
    const blocks = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (grid[r][c] === shipName) {
          blocks.push(shots[r][c] ? "dead" : "alive");
        }
      }
    }
    return blocks.length ? blocks : Array(size).fill("alive");
  }

  return (
    <div className="bg-slate-800 rounded-xl p-3">
      {title && <p className="text-xs text-slate-400 mb-3">{title}</p>}
      <div className="flex flex-col gap-2">
        {SHIPS_CONFIG.map((ship) => {
          const health = getShipHealth(ship.name, ship.size);
          return (
            <div key={ship.name} className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex-1">{ship.name}</span>
              <div className="flex gap-1">
                {health.map((status, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${status === "dead" ? "bg-red-600" : "bg-slate-500"}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}