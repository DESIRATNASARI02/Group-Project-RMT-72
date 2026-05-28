# NavalStrike REST API Documentation

Base URL:

```txt
http://localhost:3000
```

Production URL:

```txt
https://group-project-rmt-72.vercel.app/
```

Default error response:

```json
{
  "message": "Error message"
}
```

Common status codes:

* `200` success
* `400` bad request
* `404` not found
* `500` internal server error

---

# 1. Health Check

## GET `/`

Check whether server is running.

Response `200`

```json
{
  "message": "NavalStrike server is running"
}
```

---

# 2. Get Active Rooms

## GET `/rooms`

Get all active game rooms.

Response `200`

```json
[
  {
    "code": "AB1234",
    "status": "waiting",
    "players": [
      {
        "id": "socket-id",
        "name": "Playerx"
      }
    ]
  }
]
```

---

# 3. Get Room Detail

## GET `/rooms/:code`

Get specific room information.

Example:

```txt
/rooms/AB1234
```

Response `200`

```json
{
  "code": "AB1234",
  "status": "battle",
  "players": [
    {
      "id": "socket-id",
      "name": "Playerx",
      "ready": true
    },
    {
      "id": "socket-id-2",
      "name": "Player2",
      "ready": true
    }
  ],
  "currentTurn": "socket-id",
  "winner": null
}
```

---

# Notes

* Main realtime communication uses Socket.IO.
* REST API is mainly used for server status and room information.
* Multiplayer gameplay uses realtime socket events.
* Detailed socket events are documented in `API_Documentation.md`.
