const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};
document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
    }
    desenhar() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura)
        this.corpo = [{ x: this.x, y: this.y }]
        this.tamanho = 1
    }
    desenhar() {
        ctx.fillStyle = 'green'
        this.corpo.forEach(parte => {
            ctx.fillRect(parte.x, parte.y, this.largura, this.altura)
        })
    }
    atualizar() {
        let novaCabeca = { x: this.corpo[0].x, y: this.corpo[0].y }
        if (teclasPressionadas.KeyW) {
            novaCabeca.y -= 7
        } else if (teclasPressionadas.KeyS) {
            novaCabeca.y += 7
        } else if (teclasPressionadas.KeyA) {
            novaCabeca.x -= 7
        } else if (teclasPressionadas.KeyD) {
            novaCabeca.x += 7
        }
        this.corpo.unshift(novaCabeca)
        if (this.corpo.length > this.tamanho) {
            this.corpo.pop()
        }
        this.verificarColisaoCanvas()
        this.verificarColisaoCorpo()
    }
    verificarColisao(comida) {
        if (
            this.corpo[0].x < comida.x + comida.largura &&
            this.corpo[0].x + this.largura > comida.x &&
            this.corpo[0].y < comida.y + comida.altura &&
            this.corpo[0].y + this.altura > comida.y
        ) {
            this.#houveColisao(comida)
        }
    }
    #houveColisao(comida) {
        comida.x = Math.random() * (canvas.width - 10)
        comida.y = Math.random() * (canvas.height - 10)
        this.tamanho++
    }
    verificarColisaoCanvas() {
        if (
            this.corpo[0].x < 0 ||
            this.corpo[0].x + this.largura > canvas.width ||
            this.corpo[0].y < 0 ||
            this.corpo[0].y + this.altura > canvas.height
        ) {
            gameOver()
        }
    }
    verificarColisaoCorpo() {
        for (let i = 1; i < this.corpo.length; i++) {
            if (this.corpo[0].x === this.corpo[i].x && this.corpo[0].y === this.corpo[i].y) {
                gameOver()
            }
        }
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random() * (canvas.width - 10), Math.random() * (canvas.height - 10), 20, 20)
    }
    desenhar() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

function gameOver() {
    alert('Game Over')
    cobra = new Cobra(100, 200, 20, 20)
    comida = new Comida()
}

let cobra = new Cobra(100, 200, 20, 20)
let comida = new Comida()

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.desenhar()
    cobra.atualizar()
    cobra.verificarColisao(comida)
    comida.desenhar()
    requestAnimationFrame(loop)
}
loop()