import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";
import { startBgMusic, stopBgMusic, resumeCtx } from "../utils/soundManager";

export default function Lobby() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [name, setName] = useState(state.playerName || "");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    socket.connect();

    const handleFirstInteraction = () => {
      resumeCtx();
      startBgMusic();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    socket.on("room_created", (data) => {
      dispatch({ type: "ROOM_CREATED", payload: data });
      setWaiting(true);
    });

    socket.on("room_joined", (data) => {
      dispatch({ type: "ROOM_JOINED", payload: data });
    });

    socket.on("start_placing", () => {
      dispatch({ type: "START_PLACING" });
      navigate("/place");
    });

    socket.on("join_error", ({ message }) => setError(message));

    return () => {
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("start_placing");
      socket.off("join_error");
      stopBgMusic();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  function handleCreate() {
    if (!name.trim()) { setError("Masukkan nama kamu dulu!"); return; }
    dispatch({ type: "SET_PLAYER_NAME", payload: name });
    socket.emit("create_room", { playerName: name });
  }

  function handleJoin() {
    if (!name.trim()) { setError("Masukkan nama kamu dulu!"); return; }
    if (!joinCode.trim()) { setError("Masukkan kode room!"); return; }
    dispatch({ type: "SET_PLAYER_NAME", payload: name });
    socket.emit("join_room", { code: joinCode.toUpperCase(), playerName: name });
  }

  function handleAI() {
    if (!name.trim()) { setError("Masukkan nama kamu dulu!"); return; }
    dispatch({ type: "SET_PLAYER_NAME", payload: name });
    socket.emit("start_ai_game", { playerName: name });
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Naval Strike Logo"
            className="w-72 md:w-96 drop-shadow-2xl mb-4"
          />
          <p className="text-slate-400 text-sm md:text-base">
            Real-time naval battle. Sink or be sunk.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <input
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-sm outline-none focus:border-blue-500"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
            onClick={handleCreate}
          >
            + Buat Room Baru
          </button>
          <div className="text-center text-slate-500 text-sm">atau</div>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-sm outline-none focus:border-blue-500"
              placeholder="Kode room (contoh: XK4821)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-medium transition-colors"
              onClick={handleJoin}
            >
              Join
            </button>
          </div>
          <div className="text-center text-slate-500 text-sm">atau</div>
          <button
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm transition-colors"
            onClick={handleAI}
          >
            🤖 Lawan AI
          </button>
        </div>
        {waiting && state.roomCode && (
          <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm mb-1">Room Code:</p>
            <h2 className="text-3xl font-bold tracking-widest text-blue-400 mb-2">{state.roomCode}</h2>
            <p className="text-slate-500 text-sm">Bagikan kode ini ke temanmu, menunggu lawan...</p>
          </div>
        )}
      </div>
    </div>
  );
}