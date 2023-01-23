import { Router } from "express"
import { Game } from "../game/Game.js"

export const rooms: Rooms = {}

export default Router().get('/:id/:username', (req, res) => {
    const room = rooms[req.params.id]
    if (room) {
        if (room.users.length < 2) {
            if (!room.users.find(u => u.username == req.params.username)) {
                room.addUser(req.params.username)
                res.send()
            } else res.status(409).send()
        } else res.status(401).send()
    } else {
        rooms[req.params.id] = new Game(req.params.username)
        res.send()
    }
})