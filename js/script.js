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
    var text = "Score: "+gameManager.score.toFixed(0);
    ctx.fillText(text, 1150, 40);
    ctx.strokeText(text, 1150, 40);
    text = "Lives left: "+gameManager.lives;
    ctx.fillText(text, 1150, 80);
    ctx.strokeText(text, 1150, 80);
    ctx.textAlign = "center";
    if (gameManager.gameOver) {
        ctx.fillText("Game Over! Press R to restart the game", 700, 350);
        ctx.strokeText("Game Over! Press R to restart the game", 700, 350);
    }
    else if(gameManager.pause) {
        ctx.fillText("Game is paused!", 700, 350);
        ctx.strokeText("Game is paused!", 700, 350);
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
    drawScene();
}
//var currentlyPressedKeys = {};

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
    canvas.height = displayHeight;
    over.width    = displayWidth;
    over.height   = displayHeight;

    gl.viewportWidth  = canvas.width;
    gl.viewportHeight = canvas.height;
  }
}

function webGLStart() {
    var canvas = document.getElementById("micromachines-canvas");
    var overCanvas = document.getElementById("text-canvas");
    initGL(canvas, overCanvas);
    resize(canvas, overCanvas);
    gameManager = new GameManager(gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup   = handleKeyUp;

    tick();
}