(function () {
    
    "use strict";

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const green = "#17700d";
    const darkGreen = "#0d3f07";
    const paddleW = 25;
    const paddleL = 125;
    const speed = 8;
    const winningScore = 11;
    const fontVT323 = "VT323";
    
    let ballSpeed = 2;
    let Paddle1;
    let Paddle2;
    let Ball;
  
    const center = {
        x: canvas.width / 2,
        y: canvas.height  / 2
    }
  
    const p1Start = {
        x: 25,
        y: (canvas.height / 2) - (paddleL / 2)
    };
  
    const p2Start = {
        x: canvas.width - 50,
        y: (canvas.height / 2) - (paddleL / 2)
    };
  
    const ballStart = {
        x: center.x,
        y: center.y + 10
    };
  
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function resetPos(paddle1, paddle2, ball) {
        ballSpeed = 2;
//        paddle1.x = p1Start.x;
//        paddle1.y = p1Start.y;
//        paddle2.x = p2Start.x;
//        paddle2.y = p2Start.y;
        ball.x = ballStart.x;
        ball.y = ballStart.y;
    }
  
    function Paddle(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.movUp = 0;
        this.movDn = 0;
        this.score = 0;
    
        this.drawPaddle = ()=> {
            ctx.beginPath();
            ctx.rect(this.x, this.y, paddleW, paddleL);
            ctx.fillStyle = green;
            ctx.fill();
            ctx.closePath();
        };
    
        this.updatePosition =  ()=> {
            this.y += -this.movUp + this.movDn;
            constrain(this);
        };
 
    }
  
    function Puck(startX, startY) {
        this.radius = 10;
        this.x = startX;
        this.y = startY;
        this.dx = -ballSpeed;
        this.dy = ballSpeed;
    
        this.drawBall = ()=> {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = green;
            ctx.fill();
            ctx.closePath;
        },
      
        this.updatePosition = ()=> {
            this.x += this.dx;
            this.y += this.dy;
      
            //if the ball bounces off the top or bottom
            if(this.y + this.radius >= canvas.height) {
                this.dy = -ballSpeed;
            }
            if(this.y - this.radius <= 0) {
                this.dy = ballSpeed;
            }
      
            //if the ball hits Paddle 1
            if((this.x - this.radius <= Paddle1.x + paddleW) 
               && ((this.y >= Paddle1.y) && (this.y <= Paddle1.y + paddleL - this.radius))) {
                this.dx = ballSpeed;
            }

            //if the ball hits Paddle 2
            if((this.x + this.radius >= Paddle2.x) 
               && ((this.y >= Paddle2.y) && (this.y <= Paddle2.y + paddleL - this.radius))) {
                this.dx = -ballSpeed;
            }

            //if the ball hits the left or right
            //score the game
            if(this.x - this.radius <= 0) {
                resetPos(Paddle1, Paddle2, this);
                Paddle2.score += 1;
            }
          
            if(this.x + this.radius >= canvas.width) {
                resetPos(Paddle1, Paddle2, this);
                Paddle1.score += 1;
            }
        }
    }
  
    function constrain(paddle) {
        if(paddle.y < 25) paddle.y = 25;
        if(paddle.y > canvas.height - paddleL - 25) paddle.y = canvas.height - paddleL - 25;
    }
  
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    function setFont(fontsize, face) {
        return `normal ${fontsize}pt ${face}`;
    }
  
    function drawText(obj = {
                      string: string, 
                      fontsize: fontsize, 
                      face: face, 
                      color: color, 
                      just: just, 
                      x: x, 
                      y: y
                     }) {
        ctx.font = setFont(obj.fontsize, obj.face);
        ctx.fillStyle = obj.color;
        ctx.textAlign = obj.just;
        ctx.fillText(obj.string, obj.x, obj.y);
    }
  
    function drawGameLines() {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = darkGreen;
        ctx.stroke();
    }
  
    function drawScore() {
        const fontsize = 64;
        ctx.font = setFont(fontsize, fontVT323);
        ctx.fillText(`${Paddle1.score}`, canvas.width / 4, fontsize);
        ctx.fillText(`${Paddle2.score}`, (canvas.width / 4) * 3, fontsize);
    }
  
    window.addEventListener("keydown", (e)=> {
        switch(e.key) {
            case "w":
                if(!Paddle1) break;
                Paddle1.movUp = speed;
                break;
            case "s":
                if(!Paddle1) break;
                Paddle1.movDn = speed;
                break;
            case "o":
                if(!Paddle2) break;
                Paddle2.movUp = speed;
                break;
            case "l":
                if(!Paddle2) break;
                Paddle2.movDn = speed;
                break;
        }
    });
  
    window.addEventListener("keyup", (e)=> {
        switch(e.key) {
            case " ":
                startTwoPlayerGame();
                break;
            case "w":
                if(!Paddle1) break;
                Paddle1.movUp = 0;
                break;
            case "s":
                if(!Paddle1) break;
                Paddle1.movDn = 0;
                break;
            case "o":
                if(!Paddle2) break;
                Paddle2.movUp = 0;
                break;
            case "l":
                if(!Paddle2) break;
                Paddle2.movDn = 0;
                break;
        }
    });
    
    function startTwoPlayerGame() {
        Paddle1 = new Paddle(p1Start.x, p1Start.y);
        Paddle2 = new Paddle(p2Start.x, p2Start.y);
        Ball = new Puck(ballStart.x, ballStart.y);
        const gameLoop = setInterval(()=> {
            clear();
            drawGameLines();
            drawScore();
            Paddle1.drawPaddle();
            Paddle1.updatePosition();
            Paddle2.drawPaddle();
            Paddle2.updatePosition();
            Ball.drawBall();
            Ball.updatePosition();
            ballSpeed += 0.001;
            if((Paddle1.score >= winningScore) || (Paddle2.score >= winningScore)) {
                clearInterval(gameLoop);
                clear();
                const victoryString = Paddle1.score > Paddle2.score ? "Player 1 wins!" : "Player 2 wins!";
                const victoryProps = {
                    string: victoryString,
                    fontsize: 80,
                    face: fontVT323,
                    color: green,
                    just: "center",
                    x: center.x,
                    y: center.y
                }
                drawText(victoryProps);
                const playAgainProps = {
                    string: "Press Space to play again!",
                    fontsize: 24,
                    face: fontVT323,
                    color: green,
                    just: "center",
                    x: center.x,
                    y: center.y + 36
                }
                drawText(playAgainProps);
            }
        }, 10);
    } 
  
    function drawWelcome() {
        clear();
        const titleProps = {
            string: "Welcome to Pong!",
            fontsize: 80,
            face: fontVT323,
            color: green,
            just: "center",
            x: center.x,
            y: center.y
        };
        drawText(titleProps);
        const subProps = {
            string: "Hit [1] for Single Player and [2] for Two Player!",
            fontsize: 24,
            face: fontVT323,
            color: green,
            just: "center",
            x: center.x,
            y: center.y + 36
        };
        drawText(subProps);
        const credits = {
            string: "Based on the game Pong by Allan Alcorn",
            fontsize: 12,
            face: fontVT323,
            color: green,
            just: "right",
            x: canvas.width - 25,
            y: canvas.height - 25
        };
        drawText(credits);
        const author = {
            string: "Written in JavaScript by Jonathan C Kuhl",
            fontsize: 12,
            face: fontVT323,
            color: green,
            just: "left",
            x: 25,
            y: canvas.height - 25
        };
        drawText(author);
    }
  
    drawWelcome();

})();