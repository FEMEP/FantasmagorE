type Rooms = {
    [id: string]: import('../game/Game.js').Game
}

type Card = {
    id: string
    x: number
    y: number
    type: string
    owner: string
}

type User = {
    username: string
    lastPing: number
    cards: Card[]
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