export class Game {
    public users: User[] = []
    private grid: Card[] = []

    constructor(username: string) {
        this.addUser(username)
    }

    public addUser(username: string) {
        this.users.push({ username, lastPing: Date.now(), cards: [] })
    }

    public getGrid() {
        return this.grid
    }

    public setCard(card: Card): boolean {
        if (!this.grid.find(c => c.x == card.x && c.y == card.y)) {
            this.grid.push(card)
            return true
        } else return false
    }
}