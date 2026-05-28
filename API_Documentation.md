# NavalStrike API Documentation

Base URL:

```txt
http://localhost:3000
```

Production URL:

```txt
https://group-project-rmt-72.vercel.app
```

Default error response:

```json
{
  "message": "Error message"
}
```

Common status codes:

* `200` success
* `201` created
* `400` bad request
* `404` room not found
* `500` internal server error

---

# 1. Health Check

## GET `/`

Response `200`

```json
{
  "message": "NavalStrike server is running"
}
```

---

# 2. Socket.IO Connection

Client connects to server using Socket.IO.

Example:

```js
const socket = io("http://localhost:3000");
```

---

# 3. Multiplayer Events

## Create Room

### Client Emit

```js
socket.emit("create_room", {
  playerName: "Playerx"
});
```

### Server Response

Event:

```js
socket.on("room_created", (data) => {})
```

Response `200`

```json
{
  "code": "AB1234",
  "player": {
    "id": "socket-id",
    "name": "Playerx",
    "ready": false,
    "isHost": true
  }
}
```

---

## Join Room

### Client Emit

```js
socket.emit("join_room", {
  code: "AB1234",
  playerName: "Player2"
});
```

### Success Response

Event:

```js
socket.on("room_joined", (data) => {})
```

```json
{
  "code": "AB1234",
  "player": {
    "id": "socket-id",
    "name": "Player2",
    "ready": false,
    "isHost": false
  }
}
```

---

## Join Error

### Server Emit

```js
socket.on("join_error", ({ message }) => {})
```

Possible errors:

```txt
Room tidak ditemukan
Room sudah penuh
Game sudah dimulai
```

---

## Start AI Game

### Client Emit

```js
socket.emit("start_ai_game", {
  playerName: "Playerx"
});
```

---

## Start Ship Placement

### Server Emit

```js
socket.on("start_placing", () => {})
```

Triggered when both players successfully join the room.

---

## Ships Placed

### Client Emit

```js
socket.emit("ships_placed", {
  code: "AB1234",
  grid
});
```

Example grid:

```json
[
  [null, null, "Destroyer"],
  [null, "Carrier", null]
]
```

---

## Battle Start

### Server Emit

```js
socket.on("battle_start", (data) => {})
```

Response:

```json
{
  "currentTurn": "socket-id",
  "players": [
    {
      "id": "socket-id",
      "name": "Playerx"
    }
  ]
}
```

---

## Fire Shot

### Client Emit

```js
socket.emit("fire", {
  code: "AB1234",
  row: 3,
  col: 5
});
```

---

## Shot Result

### Server Emit

```js
socket.on("shot_result", (data) => {})
```

Response:

```json
{
  "shooterId": "socket-id",
  "row": 3,
  "col": 5,
  "result": "hit",
  "shipName": "Destroyer",
  "gameOver": false,
  "winnerId": null
}
```

Possible results:

```txt
hit
miss
sunk
already_shot
```

---

## Turn Change

### Server Emit

```js
socket.on("turn_change", ({ currentTurn }) => {})
```

---

## Opponent Left

### Server Emit

```js
socket.on("opponent_left", ({ message }) => {})
```

Response:

```json
{
  "message": "Lawan meninggalkan game"
}
```

---

# 4. Room Structure

```json
{
  "code": "AB1234",
  "status": "waiting",
  "players": [],
  "currentTurn": null,
  "winner": null
}
```

Room status:

```txt
waiting
placing
battle
finished
```

---

# 5. Features

* Realtime multiplayer battleship
* Room system
* AI bot enemy
* Ship placement system
* Turn-based realtime gameplay
* React Context state management
* SPA architecture
* Sound effects and background music

---

# 6. Deployment

Frontend:

* Vercel

Backend:

* Render / Railway

---

# 7. Environment Variables

Client `.env`

```env
VITE_SERVER_URL=http://localhost:5173
```

Production:

```env
VITE_SERVER_URL=https://group-project-rmt-72.vercel.app
```

---

# 8. Run Project

Client:

```bash
npm install
npm run dev
```

Server:

```bash
npm install
node --watch index
```
