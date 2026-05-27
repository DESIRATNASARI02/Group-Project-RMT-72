const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const initSocket = require("./socket");
const router = require("./router");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(router);

initSocket(io);

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));