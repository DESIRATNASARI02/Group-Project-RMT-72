//Room state management

const { createEmptyGrid, generateRoomCode } = require("./gameLogic");

const rooms = new Map();

function createRoom(hostSocketId, hostName) {
  const code = generateRoomCode();
  const room = {
    code,
    status: "waiting", 
    players: [
      {
        id: hostSocketId,
        name: hostName,
        grid: createEmptyGrid(),
        shots: Array.from({ length: 10 }, () => Array(10).fill(false)),
        ready: false,
        isHost: true,
      },
    ],
    currentTurn: null, 
    winner: null,
  };
  rooms.set(code, room);
  return room;
}

function joinRoom(code, socketId, playerName) {
  const room = rooms.get(code);
  if (!room) return { error: "Room tidak ditemukan" };
  if (room.players.length >= 2) return { error: "Room sudah penuh" };
  if (room.status !== "waiting") return { error: "Game sudah dimulai" };

  room.players.push({
    id: socketId,
    name: playerName,
    grid: createEmptyGrid(),
    shots: Array.from({ length: 10 }, () => Array(10).fill(false)),
    ready: false,
    isHost: false,
  });

  return { room };
}

function getRoom(code) {
  return rooms.get(code);
}

function getRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.id === socketId)) return room;
  }
  return null;
}

function removePlayerFromRoom(socketId) {
  for (const [code, room] of rooms.entries()) {
    const idx = room.players.findIndex((p) => p.id === socketId);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      if (room.players.length === 0) rooms.delete(code);
      return room;
    }
  }
  return null;
}

function getOpponent(room, socketId) {
  return room.players.find((p) => p.id !== socketId);
}

function getPlayer(room, socketId) {
  return room.players.find((p) => p.id === socketId);
}

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  getRoomBySocketId,
  removePlayerFromRoom,
  getOpponent,
  getPlayer,
};
