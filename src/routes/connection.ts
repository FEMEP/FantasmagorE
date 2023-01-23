import { Router } from "express"
import { rooms } from "./room.js"

export default Router().get('/:id/:username', (req, res) => {
    const room = rooms[req.params.id]
    if (room) {
        const user = room.users.find(u => u.username == req.params.username)
        if (user) {
            user.lastPing = Date.now()
            res.send({user: user, board: room.getGrid()})
        } else res.status(404).send()
    } else {
        res.status(404).send()
    }
})

setInterval(() => {
    for (const room in rooms) {
        for (const user of rooms[room].users) {
            if (Date.now() - user.lastPing < 2000) {
                user.lastPing = Date.now()
            } else {
                rooms[room].users.splice(rooms[room].users.indexOf(user), 1)
            }
        }
    }
}, 1000)