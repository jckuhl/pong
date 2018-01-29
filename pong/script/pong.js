//import EasyCanvas from "easycanvas.js";
!function () {
    
    "use strict";

    const canvas = document.querySelector("#playArea");
    const ctx = canvas.getContext("2d");
    const menu = document.querySelector("#menuArea");
    const menuCtx = menu.getContext("2d");
    const audio = Array.from(document.querySelectorAll("audio"));
    const green = "#17700d";
    const darkGreen = "#0d3f07";
    const paddleW = 25;
    const paddleL = 125;
    const speed = 8;
    const winningScore = 11;
    const fontVT323 = "VT323";
    const corners = EasyCanvas.getCornerPositions(canvas);
    const center = EasyCanvas.getCenter(canvas);
    
    let paused = false;
    let playing = false;
    let activateSpace = false;
    let ballSpeed = 2;
    let Paddle1;
    let Paddle2;
    let Ball;
    
    menu.style.top = corners.top + "px";
    menu.style.left = corners.left + "px";
  
    //init coords for paddles and ball
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
        y: center.y + 10    //ball has a radius of 10, lower it by 10 to center it
    };
  
    //inclusive random integer generator
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //sets the ball back in the center
    function resetPos(ball) {
        ballSpeed = 2;
        ball.x = ballStart.x;
        ball.y = ballStart.y;
    }
  
    //paddle constructor
    function Paddle(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.movUp = 0;
        this.movDn = 0;
        this.score = 0;
    
        this.drawPaddle = ()=> {
            EasyCanvas.drawRectNoBorder(ctx, this.x, this.y, paddleW, paddleL, green);
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
        this.dx = ballSpeed * random(-1, 1);
        this.dy = Math.sign(this.dx) === -1 ? ballSpeed : -ballSpeed;
    
        this.drawBall = ()=> {
            EasyCanvas.drawCircleNoBorder(ctx, this.x, this.y, this.radius, green);
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
                audio[0].play();
                this.dx = ballSpeed;
            }

            //if the ball hits Paddle 2
            if((this.x + this.radius >= Paddle2.x) 
               && ((this.y >= Paddle2.y) && (this.y <= Paddle2.y + paddleL - this.radius))) {
                audio[1].play();
                this.dx = -ballSpeed;
            }

            //if the ball hits the left or right
            //score the game
            if(this.x - this.radius <= 0) {
                resetPos(this);
                audio[2].play();
                Paddle2.score += 1;
            }
          
            if(this.x + this.radius >= canvas.width) {
                resetPos(this);
                audio[2].play();
                Paddle1.score += 1;
            }
        }
    }
  
    function constrain(paddle) {
        if(paddle.y < 25) paddle.y = 25;
        if(paddle.y > canvas.height - paddleL - 25) paddle.y = canvas.height - paddleL - 25;
    }
  
    function drawGameLines() {
        const lineProps = {
            x: center.x,
            y: 0,
            dx: center.x,
            dy: canvas.height,
            lineWidth: 4,
            color: darkGreen
        }
        EasyCanvas.drawLine(ctx, lineProps);
    }
  
    function drawScore() {
        const fontsize = 64;
        ctx.font = EasyCanvas.setFont(fontsize, fontVT323);
        ctx.fillText(`${Paddle1.score}`, canvas.width / 4, fontsize);
        ctx.fillText(`${Paddle2.score}`, (canvas.width / 4) * 3, fontsize);
    }

    function togglePause() {
        if(!paused) {
            paused = true;
            menu.style.display = "block";
            menu.style.backgroundColor = "rgba(0, 0, 0, 0)";
            const pauseProps = {
                string: "Paused",
                fontsize: 80,
                face: fontVT323,
                color: green,
                just: "center",
                x: center.x,
                y: center.y
            }
            EasyCanvas.drawText(menuCtx, pauseProps);
            const pauseSub = {
                string: "Hit Esc or Space to contine",
                fontsize: 24,
                face: fontVT323,
                color: green,
                just: "center",
                x: center.x,
                y: center.y + 36
            }
            EasyCanvas.drawText(menuCtx, pauseSub);
        } else {
            paused = false;
            menu.style.display = "none";
            menu.style.backgroundColor = "rgba(0, 0, 0, 1)";
            EasyCanvas.clearAll(canvas.width, canvas.height, menuCtx);
        }
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
                if(activateSpace) startTwoPlayerGame();
                if(paused) paused = false;
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
            case "Escape":
                togglePause();
        }
    });
    
    function startTwoPlayerGame() {
        Paddle1 = new Paddle(p1Start.x, p1Start.y);
        Paddle2 = new Paddle(p2Start.x, p2Start.y);
        Ball = new Puck(ballStart.x, ballStart.y);
        menu.style.display = "none";
        EasyCanvas.clearAll(canvas.width, canvas.height, menuCtx);
        const gameLoop = setInterval(()=> {
            activateSpace = false;
            playing = true;
            EasyCanvas.clearAll(canvas.width, canvas.height, ctx);
            drawGameLines();
            drawScore();
            Ball.drawBall();
            Paddle1.drawPaddle();
            Paddle2.drawPaddle();
            if(!paused) {
                Paddle1.updatePosition();
                Paddle2.updatePosition();
                Ball.updatePosition();
                ballSpeed += 0.001;
            }
            if((Paddle1.score >= winningScore) || (Paddle2.score >= winningScore)) {
                menu.style.display = "block";
                clearInterval(gameLoop);
                EasyCanvas.clearAll(canvas.width, canvas.height, ctx, menuCtx);
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
                EasyCanvas.drawText(menuCtx, victoryProps);
                const playAgainProps = {
                    string: "Press Space to play again!",
                    fontsize: 24,
                    face: fontVT323,
                    color: green,
                    just: "center",
                    x: center.x,
                    y: center.y + 36
                }
                EasyCanvas.drawText(menuCtx, playAgainProps);
                activateSpace = true;
                playing = false;
            }
        }, 10);
    } 
  
    function drawWelcome() {
        EasyCanvas.clearAll(canvas.width, canvas.height, ctx, menuCtx);
        const titleProps = {
            string: "Welcome to Pong!",
            fontsize: 80,
            face: fontVT323,
            color: green,
            just: "center",
            x: center.x,
            y: center.y
        };
        EasyCanvas.drawText(menuCtx, titleProps);
        const subProps = {
            string: "Hit [1] for Single Player and [2] for Two Player!",
            fontsize: 24,
            face: fontVT323,
            color: green,
            just: "center",
            x: center.x,
            y: center.y + 36
        };
        EasyCanvas.drawText(menuCtx, subProps);
        const credits = {
            string: "Based on the game Pong by Allan Alcorn",
            fontsize: 12,
            face: fontVT323,
            color: green,
            just: "right",
            x: canvas.width - 25,
            y: canvas.height - 25
        };
        EasyCanvas.drawText(menuCtx, credits);
        const author = {
            string: "Written in JavaScript by Jonathan Kuhl",
            fontsize: 12,
            face: fontVT323,
            color: green,
            just: "left",
            x: 25,
            y: canvas.height - 25
        };
        EasyCanvas.drawText(menuCtx, author);
        activateSpace = true;
    }
  
    drawWelcome();

}();