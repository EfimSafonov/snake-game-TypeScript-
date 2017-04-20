/**
 * Created by efims on 19.04.2017.
 */
interface point {
    x : number;
    y : number;
}

class Snake {
    private _gameField: HTMLElement = document.getElementById("game-field");
    private _gameSpeed: number = 500;
    private _fieldSize: point = {x : 10 , y : 10};
    private _food: point;
    private _body: point[] = [];
    private _state: boolean = true;
    private _direction: number = 0;
    private _onKeyDownHandler: EventListenerObject;
    private static _instance : Snake;

    constructor() {
        this._onKeyDownHandler = this.onKeyDownHandler.bind(this);
    }

    static getInstance() {
        if (!Snake._instance) {
            Snake._instance = new Snake();
        }
        return Snake._instance;
    }

    public startGame() {
        document.addEventListener("keydown", this._onKeyDownHandler);
        this.createHead();
        this.generateApple();
        if (this._state) {
            setInterval(()=>this.loop(), this._gameSpeed);
        } else {
            console.log("VSOSAL");
        }
    }
    private loop() {
            this.move();
            this.render();
    }

    private onKeyDownHandler(e: KeyboardEvent) {
        if (e.key == "ArrowUp") {
            this._direction = 0;
        } else if (e.key == "ArrowDown") {
            this._direction = 2;
        } else if (e.key == "ArrowRight") {
            this._direction = 3;
        } else if (e.key == "ArrowLeft") {
            this._direction = 1;
        }

    }

    private render() {
        this._gameField.innerHTML = "";
        for (let i = 0; i < this._fieldSize.x; i++) {
            for (let j = 0; j < this._fieldSize.y; j++) {
                let cell = document.createElement("li");
                cell.setAttribute("x","" + i);
                cell.setAttribute("y","" + j);
                if (this._food.x == i && this._food.y == j) {
                    cell.classList.add("apple");
                }
                if (this.checkCell(i,j)) {
                    if (this._body[0].x == i && this._body[0].y == j) {
                        cell.classList.add("head");
                    } else {
                        cell.classList.add("body");
                    }
                }
                this._gameField.appendChild(cell);
            }
        }
    }

    private move(){
        let point = {x : this._body[0].x , y : this._body[0].y};
        switch (this._direction) {
            case 0:
                if (--point.x < 0) {
                    point.x = 9;
                }
                break;
            case 1:
                if (--point.y < 0){
                    point.y = 9;
                }
                break;
            case 2:
                if (++point.x == this._fieldSize.x) {
                    point.x = 0;
                }
                break;
            case 3:
                if (++point.y == this._fieldSize.y) {
                    point.y = 0;
                }
                break;
        }
        if (this._food.x == point.x && this._food.y == point.y) {
            this._body.unshift(point);
            this.generateApple();
        } else {
            for (let i = (this._body.length - 1); i > 0; i--) {
                this._body[i] = this._body[i-1];
            }
            this._body[0] = point;
            console.log(this._body);
        }
    }

    private createHead() {
        let x = Math.floor(Math.random() * 9);
        let y = Math.floor(Math.random() * 9);
        this._body.push({x : x,y : y});
    }

    private checkCell(x : number, y : number){
        for (let bodyCell in this._body) {
            if (this._body[bodyCell].x == x && this._body[bodyCell].y == y) {
                return true;
            }
        }
        return false;
    }

    private generateApple() {
        let _x = 0;
        let _y = 0;
        do {
            _x = Math.floor(Math.random() * 9);
            _y = Math.floor(Math.random() * 9);
        } while (this.checkCell(_x,_y));
        this._food = {x : _x, y : _y};
        console.log(this._food);
    }

}
window.onload = () => {
    let game = Snake.getInstance();
    game.startGame();
}