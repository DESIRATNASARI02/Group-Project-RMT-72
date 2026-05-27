import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";
import { playWinJingle, playLoseJingle } from "../utils/soundManager";

export default function Result() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const isWinner = state.winner === state.playerId;

  useEffect(() => {
    if (isWinner) playWinJingle();
    else playLoseJingle();
  }, []);

  function handlePlayAgain() {
    socket.disconnect();
    dispatch({ type: "RESET" });
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-5">
      <div className="bg-slate-800 rounded-2xl p-10 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">{isWinner ? "🏆" : "💥"}</div>
        <h1 className={`text-3xl font-bold mb-2 ${isWinner ? "text-green-400" : "text-red-400"}`}>
          {isWinner ? "Kamu Menang!" : "Kamu Kalah!"}
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          {isWinner
            ? "Semua kapal musuh berhasil ditenggelamkan!"
            : "Armadamu berhasil dihancurkan musuh."}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900 rounded-xl p-4">
            <span className="block text-xs text-slate-500 mb-1">Total Tembakan</span>
            <span className="block text-2xl font-bold text-slate-100">
              {(state.battleLog || []).filter((l) => l.startsWith("Kamu")).length}
            </span>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <span className="block text-xs text-slate-500 mb-1">Hit</span>
            <span className="block text-2xl font-bold text-slate-100">
              {(state.battleLog || []).filter((l) => l.includes("HIT")).length}
            </span>
          </div>
        </div>

        <button
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          onClick={handlePlayAgain}
        >
          Main Lagi
        </button>
      </div>
    </div>
  );
}