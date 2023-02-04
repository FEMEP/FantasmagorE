export class Sprite {
    constructor(position) {
        this.position = position
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, thist.position.y, 50, 50)
    }
}