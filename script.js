var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');
var rule = document.getElementById('rule');


const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Player 1";
const rod2Name = "player 2";

// function for sound effect 
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

  //making aoudio when ball touch the rod

var touch = new sound("f4j5tcx-ball-hits-ball_aXVdDmmF.mp3");


let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;



(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === "null" || maxScore === "null") {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = "Player 1"
    } else {
        alert(rod + " has maximum score of " + maxScore * 100);
    }

    resetBoard(rod);
})();



function resetBoard(rodName) {

    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Losing player will gets the ball
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;

}


function storeWin(rod, score) {
    if (score > maxScore) {
      maxScore = score;
      localStorage.setItem(storeName, rod);
      localStorage.setItem(storeScore, maxScore);
    }
  
    clearInterval(movement);
    resetBoard(rod);
  
    // Add glow effect to winning rod for 1 second
    let winningRod = rod === rod1Name ? rod1 : rod2;
    winningRod.classList.add('rod-glow');
    setTimeout(() => winningRod.classList.remove('rod-glow'), 1000);
  
    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));
  }
  



window.addEventListener('keydown', function () {
    let rodSpeed = 20;

    let rodRect = rod1.getBoundingClientRect();


    if ((event.code === "KeyD" || event.code === "ArrowRight")  && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if ((event.code === "KeyA" || event.code === "ArrowLeft") && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }


    if (event.code === "Enter" || this.event.code==="Space") {

        rule.style. visibility = "hidden";


        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;


            movement = setInterval(function () {
                // To Move the ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                let rod1X = rod1.getBoundingClientRect().x;
                let rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {
                    if ((ballPos >= rod1X) && (ballPos <= (rod1X + rod1Width))) {
                      ballSpeedY = -ballSpeedY; // Reverses the direction
                      score++;
                      touch.play();
                  
                      // Add glow effect to rod1 for 0.5 seconds
                      rod1.classList.add('rod-glow');
                      setTimeout(() => rod1.classList.remove('rod-glow'), 500);
                    } else {
                      storeWin(rod2Name, score);
                      rule.style.visibility = "visible";
                    }
                  } else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    if ((ballPos >= rod2X) && (ballPos <= (rod2X + rod2Width))) {
                      ballSpeedY = -ballSpeedY; // Reverses the direction
                      score++;
                      touch.play();
                  
                      // Add glow effect to rod2 for 0.5 seconds
                      rod2.classList.add('rod-glow');
                      setTimeout(() => rod2.classList.remove('rod-glow'), 500);
                    } else {
                      storeWin(rod1Name, score);
                      rule.style.visibility = "visible";
                    }
                  }
                  


            }, 10);

        }
    }

});
