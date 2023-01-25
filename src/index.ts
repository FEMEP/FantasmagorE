import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'; config()

import img from './routes/img.js'
import room from './routes/room.js'
import login from './routes/login.js'
import account from './routes/account.js'
import connection from './routes/connection.js'

const mongodb = await new MongoClient(process.env.URL).connect()
export const users = mongodb.db('default').collection<Profile>('users')
export const images = mongodb.db('default').collection<Image>('images')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/img', img)
app.use('/api/room', room)
app.use('/api/login', login)
app.use('/api/account', account)
app.use('/api/connection', connection)

app.listen(3000, () => {
    console.log('Server On')
})