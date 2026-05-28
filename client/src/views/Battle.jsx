import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";
import Grid from "../components/Board/Grid";
import ShipList from "../components/Ship/ShipList";
import { playShotSound, playHitSound, playMissSound, playSunkSound } from "../utils/soundManager";

export default function Battle() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const isMyTurn = state.currentTurn === state.playerId;

  useEffect(() => {
    socket.on("shot_result", (data) => {
      if (data.result === "sunk") playSunkSound();
      else if (data.result === "hit") playHitSound();
      else playMissSound();
      dispatch({ type: "SHOT_RESULT", payload: data });
      if (data.gameOver) navigate("/result");
    });

    socket.on("turn_change", (data) => {
      dispatch({ type: "TURN_CHANGE", payload: data });
    });

    socket.on("opponent_left", ({ message }) => {
      alert(message);
      navigate("/");
    });

    return () => {
      socket.off("shot_result");
      socket.off("turn_change");
      socket.off("opponent_left");
    };
  }, []);

  function handleFire(row, col) {
    if (!isMyTurn) return;
    const shot = state.enemyShots?.[row]?.[col];
    if (shot === "hit" || shot === "miss") return;
    playShotSound();
    socket.emit("fire", { code: state.roomCode, row, col });
  }

  const opponent = state.players?.find((p) => p.id !== state.playerId);
  const totalEnemyHits = state.enemyShots?.flat()?.filter((s) => s === "hit")?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#0a1628] p-4" style={{ zoom: "150%" }}>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <h2 className="text-xl font-bold text-blue-400">⚔️ FleetClash</h2>
        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${isMyTurn ? "bg-green-900 text-green-400" : "bg-slate-800 text-slate-400"}`}>
          {isMyTurn ? "🎯 Giliran kamu — Tembak!" : "⏳ Menunggu lawan..."}
        </div>
        <div className="ml-auto text-xs text-slate-500">Room: {state.roomCode}</div>
      </div>

      <div className="flex gap-5 flex-wrap">
        <div>
          <p className="text-sm text-red-400 mb-2">
            🎯 Papan {opponent?.name || "Musuh"} — klik untuk menyerang
          </p>
          <Grid
            grid={state.enemyGrid ?? []}
            shots={state.enemyShots ?? []}
            onCellClick={handleFire}
            interactive={isMyTurn}
          />
        </div>

        <div>
          <p className="text-sm text-blue-400 mb-2">🛡 Papan kamu</p>
          <Grid
            grid={state.myGrid ?? []}
            shots={state.myShots ?? []}
            interactive={false}
          />
        </div>

        <div className="flex flex-col gap-4 w-48">
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-3">
              💥 Kapal {opponent?.name || "Musuh"}
            </p>
            <div className="flex flex-col gap-2">
              {["Carrier","Battleship","Cruiser","Submarine","Destroyer"].map((ship) => {
                const isSunk = (state.enemySunkShips || []).includes(ship);
                return (
                  <div key={ship} className="flex items-center justify-between">
                    <span className={`text-xs ${isSunk ? "text-red-400 line-through" : "text-slate-300"}`}>
                      {ship}
                    </span>
                    {isSunk
                      ? <span className="text-xs text-red-500">💀 Sunk</span>
                      : <span className="text-xs text-slate-600">—</span>
                    }
                  </div>
                );
              })}
              <div className="mt-1 pt-2 border-t border-slate-700">
                <span className="text-xs text-slate-400">Total hit: </span>
                <span className="text-xs text-red-400 font-bold">{totalEnemyHits}</span>
              </div>
            </div>
          </div>

          <ShipList grid={state.myGrid ?? []} shots={state.myShots ?? []} title="🛡 Status kapalmu" />

          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-2">📋 Log Serangan</p>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {(state.battleLog || []).slice(0, 10).map((log, i) => (
                <div key={i} className={`text-xs py-1 border-b border-slate-700 ${log.includes("HIT") ? "text-red-400" : "text-slate-400"}`}>
                  {log}
                </div>
              ))}
              {(state.battleLog || []).length === 0 && (
                <div className="text-xs text-slate-600 italic">Belum ada serangan</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}