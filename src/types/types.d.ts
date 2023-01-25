type Rooms = {
    [id: string]: import('../game/Game.js').Game
}

type Card = {
    id: string
    x: number
    y: number
}

type User = {
    
}

type Profile = {
    id: string
    username: string
    pass: string
    picture: string
}

type Image = {
    id: string
    base64: string
    completed: boolean
}