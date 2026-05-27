const { createRoom, joinRoom, getRoom, getRoomBySocketId, removePlayerFromRoom, getOpponent, getPlayer } = require("./rooms");
const { processShot } = require("./gameLogic");
const { SHIPS_CONFIG, isValidPlacement, placeShip, createEmptyGrid } = require("./gameLogic");
const AIBot = require("./aiBot");

function generateAIGrid() {
  let grid = createEmptyGrid();
  for (const ship of SHIPS_CONFIG) {
    let placed = false;
    while (!placed) {
      const isH = Math.random() > 0.5;
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (isValidPlacement(grid, row, col, ship.size, isH)) {
        grid = placeShip(grid, row, col, ship.size, isH, ship.name);
        placed = true;
      }
    }
  }
  return grid;
}

function initSocket(io) {
  io.on("connection", (socket) => {

    socket.on("create_room", ({ playerName }) => {
      const room = createRoom(socket.id, playerName);
      socket.join(room.code);
      socket.emit("room_created", {
        code: room.code,
        player: room.players[0],
      });
    });

    socket.on("join_room", ({ code, playerName }) => {
      const result = joinRoom(code, socket.id, playerName);
      if (result.error) {
        socket.emit("join_error", { message: result.error });
        return;
      }
      socket.join(code);
      const room = result.room;
      socket.emit("room_joined", { code, player: room.players[1] });
      io.to(code).emit("player_joined", {
        players: room.players.map((p) => ({ id: p.id, name: p.name, ready: p.ready })),
      });
      if (room.players.length === 2) {
        room.status = "placing";
        io.to(code).emit("start_placing");
      }
    });

    socket.on("start_ai_game", ({ playerName }) => {
      const room = createRoom(socket.id, playerName);
      socket.join(room.code);
      room.status = "placing";
      room.isAI = true;
      room.aiBot = new AIBot();
      room.players.push({
        id: "AI",
        name: "Fleet AI",
        grid: null,
        shots: Array.from({ length: 10 }, () => Array(10).fill(false)),
        ready: false,
        isHost: false,
      });
      socket.emit("room_created", { code: room.code, player: room.players[0] });
      socket.emit("start_placing");
    });

    socket.on("ships_placed", ({ code, grid }) => {
      const room = getRoom(code);
      if (!room) return;
      const player = getPlayer(room, socket.id);
      if (!player) return;

      player.grid = grid;
      player.ready = true;

      if (room.isAI) {
        const aiPlayer = room.players.find((p) => p.id === "AI");
        aiPlayer.grid = generateAIGrid();
        aiPlayer.ready = true;
      }

      const allReady = room.players.every((p) => p.ready);
      if (allReady) {
        room.status = "battle";
        room.currentTurn = room.players[0].id;
        io.to(code).emit("battle_start", {
          currentTurn: room.currentTurn,
          players: room.players.map((p) => ({ id: p.id, name: p.name })),
        });
      } else {
        io.to(code).emit("player_ready", {
          playerId: socket.id,
          players: room.players.map((p) => ({ id: p.id, name: p.name, ready: p.ready })),
        });
      }
    });

    socket.on("fire", ({ code, row, col }) => {
      const room = getRoom(code);
      if (!room) return;
      if (room.currentTurn !== socket.id) return;

      const opponent = getOpponent(room, socket.id);
      const board = { grid: opponent.grid, shots: opponent.shots };
      const result = processShot(board, row, col);

      if (result.result === "already_shot") return;

      opponent.shots = result.shots;

      io.to(code).emit("shot_result", {
        shooterId: socket.id,
        row,
        col,
        result: result.result,
        shipName: result.shipName,
        gameOver: result.gameOver,
        winnerId: result.gameOver ? socket.id : null,
      });

      if (result.gameOver) {
        room.status = "finished";
        room.winner = socket.id;
        return;
      }

      room.currentTurn = opponent.id;
      io.to(code).emit("turn_change", { currentTurn: room.currentTurn });

      if (room.isAI && room.currentTurn === "AI") {
        setTimeout(() => {
          const aiShot = room.aiBot.getNextShot();
          const humanPlayer = getPlayer(room, socket.id);
          const aiBoard = { grid: humanPlayer.grid, shots: humanPlayer.shots };
          const aiResult = processShot(aiBoard, aiShot.row, aiShot.col);

          humanPlayer.shots = aiResult.shots;
          room.aiBot.processResult(aiShot.row, aiShot.col, aiResult.result);

          io.to(code).emit("shot_result", {
            shooterId: "AI",
            row: aiShot.row,
            col: aiShot.col,
            result: aiResult.result,
            shipName: aiResult.shipName,
            gameOver: aiResult.gameOver,
            winnerId: aiResult.gameOver ? "AI" : null,
          });

          if (!aiResult.gameOver) {
            room.currentTurn = socket.id;
            io.to(code).emit("turn_change", { currentTurn: room.currentTurn });
          } else {
            room.status = "finished";
          }
        }, 1000);
      }
    });

    socket.on("disconnect", () => {
      const room = getRoomBySocketId(socket.id);
      if (room) {
        io.to(room.code).emit("opponent_left", { message: "Lawan meninggalkan game" });
        removePlayerFromRoom(socket.id);
      }
    });
  });
}

module.exports = initSocket;