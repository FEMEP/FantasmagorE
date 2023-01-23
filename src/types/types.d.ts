type Rooms = {
    [id: string]: import('../game/Game.js').Game
}

type Card = {
    id: string,
    x: number,
    y: number,
    life: number,
    damage: number
}