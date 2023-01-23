import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'; config()
import room from './routes/room.js'
import connection from './routes/connection.js'

const mongodb = await new MongoClient(process.env.URL).connect()
export const rooms = mongodb.db('default').collection('rooms')
export const users = mongodb.db('default').collection('users')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/room', room)
app.use('/api/connection', connection)

app.listen(3000, () => {
    console.log('Server On')
})