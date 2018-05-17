const EasyCanvas = require('./easycanvas');

!function () {
    
    'use strict';

    const canvas = document.querySelector('#playArea');
    const ctx = canvas.getContext('2d');
    const menu = document.querySelector('#menuArea');
    const menuCtx = menu.getContext('2d');
    const audio = document.querySelectorAll('audio');
    const green = '#17700d';
    const darkGreen = '#0d3f07';
    const paddleW = 25;
    const paddleL = 125;
    const speed = 8;
    const winningScore = 21;
    const fontVT323 = 'VT323';
    const corners = EasyCanvas.getCornerPositions(canvas);
    const center = EasyCanvas.getCenter(canvas);
    
    let aiFlag = false;
    let paused = false;
    let playing = false;
    let activateSpace = false;
    let ballSpeed = 2;
    let Paddle1;
    let Paddle2;
    let Ball;
    
    menu.style.top = corners.top + 'px';
    menu.style.left = corners.left + 'px';
    
    const fontSize = {
        Lg: 80,
        Md: 24,
        Sm: 12
    };
  
    //init coords for paddles and ball
    const p1Start = {
        x: 25,
        y: center.y - (paddleL / 2)
    };
  
    const p2Start = {
        x: canvas.width - 50,
        y: center.y - (paddleL / 2)
    };
  
    const ballStart = {
        x: center.x,
        y: center.y + 10    //ball has a radius of 10, lower it by 10 to center it
    };
  
    //inclusive random integer generator
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function negFactor() {
        let i = random(1, 2);
        return i === 1 ? 1 : -1;
    }

    //sets the ball back in the center
    function resetPos(ball) {
        ballSpeed = 2;
        ball.x = ballStart.x;
        ball.y = ballStart.y; 
        ball.dx = ballSpeed * negFactor();
        ball.dy = ballSpeed * negFactor();
    }
  
    //paddle constructor
    class Paddle {
        constructor(startX, startY) {
            this.x = startX;
            this.y = startY;
            this.movUp = 0;
            this.movDn = 0;
            this.score = 0;
            this.iAmAnAI = false;
        }
        drawPaddle() {
            EasyCanvas.drawRectNoBorder(ctx, this.x, this.y, paddleW, paddleL, green);
        }
        aiUpdatePosition(ball) {
            if (ball.x > center.x + 300) {
                this.targetY = ball.y;
                if (this.y + (paddleL / 2) > this.targetY) {
                    this.y -= 8;
                    //                    this.movDn = 0;
                }
                else {
                    //                    this.movUp = 0;
                    this.y += 8;
                }
                //this.y += -this.movUp + this.movDn;
                constrain(this);
            }
        }

        updatePosition() {
            this.y += -this.movUp + this.movDn;
            constrain(this);
        };
    }
    
    
     
  
    class Puck {
        constructor(startX, startY) {
            this.radius = 10;
            this.x = startX;
            this.y = startY;
            this.color = green;
            this.dx = ballSpeed * negFactor();
            this.dy = ballSpeed * negFactor();
            this.drawBall = () => {
                EasyCanvas.drawCircleNoBorder(ctx, this.x, this.y, this.radius, this.color);
            }; //End drawBall()
            this.glow = () => {
                this.color = 'lime';
                setTimeout(() => {
                    this.color = green;
                }, 100);
            }; //end glow()
            this.isHittingLeftPaddle = () => {
                return ((this.x - this.radius <= Paddle1.x + paddleW)
                    && ((this.y >= Paddle1.y)
                        && (this.y <= Paddle1.y + paddleL - this.radius)));
            };
            this.isHittingRightPaddle = () => {
                return ((this.x + this.radius >= Paddle2.x)
                    && ((this.y >= Paddle2.y)
                        && (this.y <= Paddle2.y + paddleL - this.radius)));
            };
            this.updatePosition = () => {
                this.x += this.dx;
                this.y += this.dy;
                //if the ball bounces off the top or bottom
                if (this.y + this.radius >= canvas.height) {
                    this.dy = -ballSpeed;
                }
                if (this.y - this.radius <= 0) {
                    this.dy = ballSpeed;
                }
                //if the ball hits Paddle 1
                if (this.isHittingLeftPaddle()) {
                    audio[0].play();
                    this.dx = ballSpeed;
                    this.glow();
                }
                //if the ball hits Paddle 2
                if (this.isHittingRightPaddle()) {
                    audio[1].play();
                    this.dx = -ballSpeed;
                    this.glow();
                }
                //if the ball hits the left or right
                //score the game
                if (this.x - this.radius <= 0) {
                    resetPos(this);
                    audio[2].play();
                    Paddle2.score += 1;
                }
                if (this.x + this.radius >= canvas.width) {
                    resetPos(this);
                    audio[2].play();
                    Paddle1.score += 1;
                }
            }; //End updatePosition()
        }
    }
  
    function constrain(paddle) {
        const constraint = {
            left: 25,
            right: canvas.height - paddleL - 25,
        };
        if(paddle.y < constraint.left) paddle.y = constraint.left;
        if(paddle.y > constraint.right) paddle.y = constraint.right;
    }
  
    function drawGameLines() {
        const lineProps = {
            x: center.x,
            y: 0,
            dx: center.x,
            dy: canvas.height,
            lineWidth: 4,
            color: darkGreen
        };
        EasyCanvas.drawLine(ctx, lineProps);
    }
  
    function drawScore() {
        const fontsize = 64;
        ctx.font = EasyCanvas.setFont(fontsize, fontVT323);
        ctx.fillText(`${Paddle1.score}`, canvas.width / 4, fontsize);
        ctx.fillText(`${Paddle2.score}`, (canvas.width / 4) * 3, fontsize);
    }
    
    function displayMenuText(string, fontsize, x, y, just='center') {
        const textProps = {
            string: string,
            fontsize: fontsize,
            face: fontVT323,
            color: green,
            just: just,
            x: x,
            y: y
        };
        EasyCanvas.drawText(menuCtx, textProps);
    }

    function togglePause() {
        if(!paused) {
            paused = true;
            menu.style.display = 'block';
            menu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            displayMenuText('Paused', fontSize.Lg, center.x, center.y);
            displayMenuText('Hit Esc or Space to continue', fontSize.Md, center.x, center.y + 36);
        } else {
            paused = false;
            menu.style.display = 'none';
            menu.style.backgroundColor = 'rgba(0, 0, 0, 1)';
            EasyCanvas.clearAll(canvas.width, canvas.height, menuCtx);
        }
    }
  
    window.addEventListener('keydown', (e)=> {
        switch(e.key) {
        case 'w':
            if(!Paddle1) break;
            Paddle1.movUp = speed;
            break;
        case 's':
            if(!Paddle1) break;
            Paddle1.movDn = speed;
            break;
        }
    });
  
    //ugly fix to stop the page from scrolling when [space] is pressed
    window.addEventListener('keypress', (e)=> {
        if(e.keyCode === 32) {
            e.view.event.preventDefault();
            if(activateSpace) {
                aiFlag = false;
                startGame();
            }
            if(paused) {
                togglePause();
            }
        }
    });
    
    window.addEventListener('keyup', (e)=> {
        switch(e.key) {
        case 'w':
            if(!Paddle1) break;
            Paddle1.movUp = 0;
            break;
        case 's':
            if(!Paddle1) break;
            Paddle1.movDn = 0;
            break;
        case 'o':
            if(!Paddle2) break;
            Paddle2.movUp = 0;
            break;
        case 'l':
            if(!Paddle2) break;
            Paddle2.movDn = 0;
            break;
        case 'Escape':
            togglePause();
            break;
        }
    });
    
    function startGame() {
        Paddle1 = new Paddle(p1Start.x, p1Start.y);
        Paddle2 = new Paddle(p2Start.x, p2Start.y);
        Ball = new Puck(ballStart.x, ballStart.y);
        menu.style.display = 'none';
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
                Paddle1.updatePosition(Ball);
                Paddle2.aiUpdatePosition(Ball);
                Ball.updatePosition();
                ballSpeed += 0.001;
            }
            if((Paddle1.score >= winningScore) || (Paddle2.score >= winningScore)) {
                menu.style.display = 'block';
                clearInterval(gameLoop);
                EasyCanvas.clearAll(canvas.width, canvas.height, ctx, menuCtx);
                const victoryString = Paddle1.score > Paddle2.score ? 'Player 1 wins!' : 'Player 2 wins!';
                displayMenuText(victoryString, 80, center.x, center.y);
                displayMenuText('Press Space to play again!', 24, center.x, center.y + 36);
                activateSpace = true;
                playing = false;
            }
        }, 33);
    } 
  
    function drawWelcome() {
        EasyCanvas.clearAll(canvas.width, canvas.height, ctx, menuCtx);
        displayMenuText('Welcome to Pong', fontSize.Lg, center.x, center.y);
        displayMenuText('Hit [Space] to play!', fontSize.Md, center.x, center.y + 36);
        displayMenuText('Based on the game Pong by Allan Alcorn', fontSize.Sm, canvas.width - 25, canvas.height - 25, 'right');
        displayMenuText('Written in JavaScript by Jonathan Kuhl', fontSize.Sm, 25, canvas.height - 25, 'left');
        activateSpace = true;
    }
  
    drawWelcome();

}();