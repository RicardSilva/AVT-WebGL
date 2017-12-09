var gl, gameManager;
var ctx;


function initGL(canvas, over) {
    try {
        gl = canvas.getContext("experimental-webgl", {stencil:true});
        gl.viewportWidth  = canvas.width;
        gl.viewportHeight = canvas.height;
        ctx = over.getContext("2d");
    } catch (e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    gameManager.draw();
    drawText();
}

function drawText() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.textAlign = "left";
    ctx.font="25px Verdana";
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    
    var currentLapTime = gameManager.currentLapTime;
    var bestLapTime = gameManager.bestLapTime;
    var best_min = (bestLapTime / 1000) / 60;
    var best_sec = (bestLapTime / 1000) % 60;
    var best_mili = bestLapTime % 1000;
    var curr_min = (currentLapTime / 1000) / 60;
    var curr_sec = (currentLapTime / 1000) % 60;
    var curr_mili = currentLapTime % 1000;
    var text;

    text = "Current Lap: " + Math.floor(curr_min) + ":" + Math.floor(curr_sec) + ":" + Math.floor(curr_mili);
    
    ctx.fillText(text, 900, 40);
    ctx.strokeText(text, 900, 40);
    if(gameManager.atLeastOneLap) {
        text = "Best Lap: " + Math.floor(best_min) + ":" + Math.floor(best_sec) + ":" + Math.floor(best_mili);
    }
    else {
        text = "    Best Lap: ---:---:---" ;
    }   
    ctx.fillText(text, 900, 80);
    ctx.strokeText(text, 900, 80);
    text = "    Lives left: " + gameManager.lives;
    ctx.fillText(text, 900, 120);
    ctx.strokeText(text, 900, 120);
    ctx.textAlign = "center";
    ctx.font="35px Verdana";
    if (gameManager.gameOver) {
        ctx.fillText("Game Over! Press R to restart the game", 500, 350);
        ctx.strokeText("Game Over! Press R to restart the game", 500, 350);
    }
    else if(gameManager.pause) {
        ctx.fillText("Game is paused!", 600, 350);
        ctx.strokeText("Game is paused!", 600, 350);
    }
}

var oldTime = 0;

function update() {
    if (!gameManager.pause && !gameManager.gameOver) {
        var time = new Date().getTime();
        var timeStep = time - oldTime;
        oldTime = time;
        gameManager.update(timeStep);
    }
    else {
        oldTime = new Date().getTime();
    }
}

function tick() {
    requestAnimFrame(tick);
    //handleKeys();

    update();
    resize(ncanvas, nover);
    drawScene();
}

function spawnOrangeTimer(value) {
  gameManager.onSpawnOrangeTimer();
  setTimeout(spawnOrangeTimer, 2000 + 7000 * Math.random());
}
function increaseOrangeSpeedTimer(value) {
  gameManager.onIncreaseOrangeSpeedTimer();
  setTimeout(increaseOrangeSpeedTimer, 10000);
}



function handleKeyDown(event) {
   // currentlyPressedKeys[event.keyCode] = true;
   gameManager.keyDown(event.keyCode);
}

function handleKeyUp(event) {
   // currentlyPressedKeys[event.keyCode] = false;
   gameManager.keyUp(event.keyCode);
}

function resize(canvas, over) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight ;
    over.width    = displayWidth;
    over.height   = displayHeight ;

    gl.viewportWidth  = canvas.width;
    gl.viewportHeight = canvas.height;
  }
}



var ncanvas;
var nover;
function webGLStart() {
    ncanvas = document.getElementById("micromachines-canvas");
    nover = document.getElementById("text-canvas");
    initGL(ncanvas, nover);
    resize(ncanvas, nover);
    gameManager = new GameManager(gl.viewportWidth, gl.viewportHeight);
		
    gl.clearColor(0.53, 0.81, 0.92, 1);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    document.onkeydown = handleKeyDown;
    document.onkeyup   = handleKeyUp;

    setTimeout(spawnOrangeTimer, 2000 + 7000 * Math.random());
    setTimeout(increaseOrangeSpeedTimer, 10000);
    tick();
}