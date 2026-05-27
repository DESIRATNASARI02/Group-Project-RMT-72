const COLS = ["A","B","C","D","E","F","G","H","I","J"];
const ROWS = [1,2,3,4,5,6,7,8,9,10];

export default function Grid({ grid, shots, onCellClick, interactive = false, label }) {
  function getCellClass(row, col) {
    const shotStatus = shots?.[row]?.[col];
    const shipName = grid?.[row]?.[col];

    if (shotStatus === "hit") {
      return interactive
        ? "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs font-bold cursor-crosshair bg-red-600 text-white"
        : "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs font-bold bg-orange-500 text-white";
    }
    if (shotStatus === "miss") {
      return interactive
        ? "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs bg-slate-700 text-slate-400"
        : "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs bg-blue-900 text-blue-400";
    }
    if (shipName) {
      return "w-7 h-7 border border-slate-600 rounded-sm flex items-center justify-center text-xs bg-slate-500";
    }
    return interactive
      ? "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs bg-[#0f2744] cursor-crosshair hover:bg-slate-700 transition-colors"
      : "w-7 h-7 border border-slate-700 rounded-sm flex items-center justify-center text-xs bg-[#0f2744]";
  }

  function getCellContent(row, col) {
    const shotStatus = shots?.[row]?.[col];
    if (shotStatus === "hit") return "✕";
    if (shotStatus === "miss") return "·";
    return "";
  }

  return (
    <div className="flex flex-col">
      {label && <p className="text-sm text-slate-400 mb-2">{label}</p>}
      <div className="inline-flex flex-col">
        <div className="flex ml-6">
          {COLS.map((c) => (
            <div key={c} className="w-7 h-5 text-[10px] text-slate-500 text-center">{c}</div>
          ))}
        </div>
        {ROWS.map((row, ri) => (
          <div key={row} className="flex items-center">
            <div className="w-6 text-[10px] text-slate-500 text-right pr-1">{row}</div>
            {COLS.map((col, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={getCellClass(ri, ci)}
                onClick={() => interactive && onCellClick && onCellClick(ri, ci)}
              >
                {getCellContent(ri, ci)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}