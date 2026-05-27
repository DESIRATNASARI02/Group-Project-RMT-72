const express = require("express");
const router = express.Router();
const { getRoom } = require("./rooms");

router.get("/", (req, res) => {
  res.json({ message: "FleetClash Server Running" });
});

router.get("/rooms/:code", (req, res) => {
  const room = getRoom(req.params.code);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json({ code: room.code, status: room.status, playerCount: room.players.length });
});

module.exports = router;