import { Router } from 'express'
import { users } from '../index.js'
import { v4 } from 'uuid'

export default Router().post('/:username/:pass', async (req, res) => {
    let serverUser = await users.findOne({username: req.params.username})

    if (serverUser) {
        if (serverUser.pass == req.body.pass) res.send(serverUser) // accepted
        else res.status(401).send() // not authorized
    } else res.status(404).send() // not found

}).post('/create', async (req, res) => {
    const user = { id: v4(), ...req.body }
    users.insertOne(user)
    res.send(user)
})