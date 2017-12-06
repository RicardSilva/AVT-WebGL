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
    var text = "Score: " + gameManager.score.toFixed(0);
    ctx.fillText(text, 900, 40);
    ctx.strokeText(text, 900, 40);
    text = "Lives left: " + gameManager.lives;
    ctx.fillText(text, 900, 80);
    ctx.strokeText(text, 900, 80);
    ctx.textAlign = "center";
    if (gameManager.gameOver) {
        ctx.fillText("Game Over! Press R to restart the game", 500, 350);
        ctx.strokeText("Game Over! Press R to restart the game", 500, 350);
    }
    else if(gameManager.pause) {
        ctx.fillText("Game is paused!", 500, 350);
        ctx.strokeText("Game is paused!", 500, 350);
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
    canvas.height = displayHeight / 1.4;
    over.width    = displayWidth;
    over.height   = displayHeight / 1.4;

    gl.viewportWidth  = canvas.width;
    gl.viewportHeight = canvas.height;
  }
}

var textures = [];

function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

function loadImages(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;

  // Called each time an image finished
  // loading.
  var onImageLoad = function() {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      callback(images);
    }
  };

  for (var i = 0; i < imagesToLoad; ++i) {
    var image = loadImage(urls[i], onImageLoad);
    images.push(image);
  }
}

function createTextures(images) {
    for (var i = 0; i < images.length; ++i) {
        var texture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        // gl.generateMipmap(gl.TEXTURE_2D);
        // add the texture to the array of textures.
        textures.push(texture);
    }
    document.getElementById("loadingtext").textContent = "";
}
var ncanvas;
var nover;
function webGLStart() {
    ncanvas = document.getElementById("micromachines-canvas");
    nover = document.getElementById("text-canvas");
    initGL(ncanvas, nover);
    resize(ncanvas, nover);
    gameManager = new GameManager(gl.viewportWidth, gl.viewportHeight);
	
	  loadImages(["../resources/textures/christmastree.tga", "../resources/textures/particle2.tga",
				"../resources/textures/lensFlare/flare2.tga", "../resources/textures/lensFlare/flare3.tga",
				"../resources/textures/lensFlare/flare4.tga", "../resources/textures/lensFlare/flare5.tga",
				"../resources/textures/lensFlare/flare5.tga"], createTextures);
	
    gl.clearColor(0.53, 0.81, 0.92, 1);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    document.onkeydown = handleKeyDown;
    document.onkeyup   = handleKeyUp;

    setTimeout(spawnOrangeTimer, 2000 + 7000 * Math.random());
    setTimeout(increaseOrangeSpeedTimer, 10000);
    tick();
}