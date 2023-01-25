import { Router } from 'express'
import { users, images } from '../index.js'

export default Router().get('/validate/:username', async (req, res) => {
    if (await users.findOne({ username: req.params.username })) {
        res.send('username')
    } else {
        res.status(404).send()
    }
}).post('/edit', async (req, res) => {
    const user = await users.findOne({ username: req.body.username, pass: req.body.pass })

    if (await users.findOne({ username: req.body.username })) {
        return res.status(409).send() //conflict
    }

    if (user) {
        for (const key in req.body) {
            if (key == 'picture') {
                await images.deleteOne({ id: user.picture })
            }
            await users.updateOne({ id: user.id }, { $set: { [key]: req.body[key] } })
        }
        res.send(await users.findOne({ id: user.id }))
    } else {
        res.status(401).send()
    }
}).delete('/:username/:pass', async (req, res) => {
    const user = await users.findOne({ username: req.body.username, pass: req.body.pass })

    if (user) {
        await images.deleteOne({ id: user.picture })
        await users.deleteOne({ username: req.body.username })
        res.send()
    } else res.status(401).send()
})