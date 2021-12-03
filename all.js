
class Food {
  constructor() {
    this.ele = document.getElementsByClassName('food')[0];
    this.change()
  }
  get X () {
    return parseInt(this.ele.style.left);
  }
  get Y () {
    return parseInt(this.ele.style.top);
  }
  change () {
    let x = Math.round(Math.random() * 44) * 10;
    let y = Math.round(Math.random() * 44) * 10;
    this.ele.style.left = x + "px"
    this.ele.style.top = y + "px"
  }
}



class ScorePanel {
  constructor(maxLevel = 10) {
    this.scoreEle = document.getElementsByClassName('score')[0]
    this.levelEle = document.getElementsByClassName('level')[0]
    this.score = 0;
    this.level = 0;
    this.maxLevel = maxLevel
  }
  init () {
    this.score = 0;
    this.level = 0;
  }
  addScore () {
    this.scoreEle.innerText = ++this.score;
    this.score % 3 == 0 ? this.addLevel() : '';
  }
  addLevel () {
    if (this.level < this.maxLevel) {
      this.levelEle.innerText = ++this.level;
    }
  }
}




class Snake {
  constructor() {

    this.init();
    this.isLive = true;
  }
  init () {
    this.ele = document.getElementsByClassName('snake')[0];
    this.head = this.ele.getElementsByTagName('div')[0];
    this.body = this.ele.getElementsByTagName('div');
    this.head.style.left = 0;
    this.head.style.top = 0;

  }
  move () {
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].style.left = this.body[i - 1].style.left;
      this.body[i].style.top = this.body[i - 1].style.top;
    }

  }
  collision () {
    for (let i = this.body.length - 1; i > 0; i--) {
      if (this.head.style.left === this.body[i].style.left && this.head.style.top === this.body[i].style.top) {
        this.isLive = false
        break;
      }
    }
  }
  get X () {

    return parseInt(this.head.style.left);
  }
  set X (val) {
    if (val < 0 || val > 440) {
      throw new Error('game over')
    }
    if (this.X == val) {
      return;
    }
    this.move()
    this.head.style.left = val + "px"
    this.collision()
  }
  get Y () {
    return parseInt(this.head.style.top);
  }
  set Y (val) {
    if (val < 0 || val > 440) {
      throw new Error('game over')
    }
    if (this.Y == val) {
      return;
    }
    this.move()
    this.head.style.top = val + "px"
    this.collision()


  }
  addBody () {
    let newBody = document.createElement('div')
    newBody.style.left = this.head.style.left;
    newBody.style.top = this.head.style.top;
    console.log(this.head.style.left);
    this.ele.insertAdjacentElement('beforeend', newBody)

  }
  restBody () {
    for (let i = 0; i < this.body.length; i++) {
      this.body[i].remove()
      console.log(i);
    }
    this.addBody()
    this.init()
  }

}

class GameControl {

  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.scorePanel = new ScorePanel();
    this.direction = [65, 87, 68, 83];
    this.beforeDirection = 83
    this.nowDirection = 83;
    this.init()
  }
  init () {
    document.addEventListener('keydown', this.keydownHandler.bind(this))
    this.run();
  }
  restart () {
    this.snake.isLive = true;
    this.snake.restBody()
    this.food.change();
    this.scorePanel.init();
    this.beforeDirection = 83
    this.nowDirection = 83;
    this.run();
  }
  /* 
      65 左
      87 上
      68 右
      83 下
      
  */
  keydownHandler (event) {
    let code = event.keyCode;
    if (this.direction.indexOf(code) != -1) {
      this.nowDirection = code;
    }

  }
  run (speed = 300 - this.scorePanel.level * 20) {
    if (!this.snake.isLive) {
      confirm('重新游戏？') ? this.restart() : ''
      return;
    }
    if (this.snake.X == this.food.X && this.snake.Y == this.food.Y) {
      this.scorePanel.addScore();
      this.food.change();
      this.snake.addBody();
    }
    console.log(this.nowDirection);
    try {
      switch (this.nowDirection) {
        case 65: {
          if (this.beforeDirection !== 68) {
            this.snake.X -= 10;
            this.beforeDirection = this.nowDirection
          } else {
            this.snake.X += 10;
          }
          break;
        }
        case 87: {
          if (this.beforeDirection !== 83) {
            this.snake.Y -= 10;
            this.beforeDirection = this.nowDirection
          } else {
            this.snake.Y += 10;

          }
          break
        }
        case 68: {
          if (this.beforeDirection !== 65) {
            this.snake.X += 10;
            this.beforeDirection = this.nowDirection
          } else {
            this.snake.X -= 10;

          }
          break;
        }
        case 83: {
          if (this.beforeDirection !== 87) {
            this.snake.Y += 10;
            this.beforeDirection = this.nowDirection
          } else {
            this.snake.Y -= 10;

          }
          break;
        }
      }
      setTimeout(this.run.bind(this), speed);
    } catch (e) {
      this.snake.isLive = false;
      confirm('重新游戏？') ? this.restart() : ''

    }

  }

}
let g = null
window.onload = function () {
  if (confirm('开始游戏？')) {
    g = new GameControl()
  }
}