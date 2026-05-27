import { createContext, useContext, useReducer } from "react";
import { createEmptyGrid, createEmptyShots } from "../utils/gameUtils";

export const GameContext = createContext({
  state: {},
  dispatch: () => {}
});

const initialState = {
  playerName: "",
  playerId: null,
  roomCode: null,
  isHost: false,
  isAIMode: false,
  phase: "lobby",
  myGrid: createEmptyGrid(),
  myShots: createEmptyShots(),
  enemyGrid: createEmptyGrid(),
  enemyShots: createEmptyShots(),
  currentTurn: null,
  players: [],
  winner: null,
  battleLog: [],
  enemySunkShips: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.payload };

    case "ROOM_CREATED":
      return {
        ...state,
        roomCode: action.payload.code,
        playerId: action.payload.player.id,
        isHost: true,
      };

    case "ROOM_JOINED":
      return {
        ...state,
        roomCode: action.payload.code,
        playerId: action.payload.player.id,
        isHost: false,
      };

    case "START_PLACING":
      return { ...state, phase: "placing" };

    case "UPDATE_MY_GRID":
      return { ...state, myGrid: action.payload };

    case "BATTLE_START":
      return {
        ...state,
        phase: "battle",
        currentTurn: action.payload.currentTurn,
        players: action.payload.players,
      };

    case "SHOT_RESULT": {
      const { shooterId, row, col, result, shipName, gameOver, winnerId } = action.payload;
      const isMyShot = shooterId === state.playerId;
      const logMsg = isMyShot
        ? `Kamu menembak [${col},${row + 1}] → ${result === "hit" || result === "sunk" ? "HIT!" : "Miss"}`
        : `Musuh menembak [${col},${row + 1}] → ${result === "hit" || result === "sunk" ? "HIT!" : "Miss"}`;

      if (isMyShot) {
        const newEnemyShots = (state.enemyShots || createEmptyShots()).map((r) => [...r]);
        newEnemyShots[row][col] = result === "hit" || result === "sunk" ? "hit" : "miss";
        const newSunkShips = result === "sunk" && shipName
          ? [...(state.enemySunkShips || []), shipName]
          : (state.enemySunkShips || []);
        return {
          ...state,
          enemyShots: newEnemyShots,
          enemySunkShips: newSunkShips,
          winner: gameOver ? winnerId : null,
          phase: gameOver ? "finished" : state.phase,
          battleLog: [logMsg, ...(state.battleLog || [])],
        };
      } else {
        const newMyShots = (state.myShots || createEmptyShots()).map((r) => [...r]);
        newMyShots[row][col] = result === "hit" || result === "sunk" ? "hit" : "miss";
        return {
          ...state,
          myShots: newMyShots,
          winner: gameOver ? winnerId : null,
          phase: gameOver ? "finished" : state.phase,
          battleLog: [logMsg, ...(state.battleLog || [])],
        };
      }
    }

    case "TURN_CHANGE":
      return { ...state, currentTurn: action.payload.currentTurn };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}