function GameManager(width, height) {

    this.matrices = new MatrixStack();

	this.width          = width;
	this.height         = height;
    this.lives          = 5;
    this.gameOver       = false;
    this.pause          = false;
    this.score          = 0;

    this.init();


}

GameManager.prototype.init = function() {
    this.initShaders();
    this.initMeshes();
    this.initTextures(["resources/title.gif"], createTextures);
    this.initCameras();
    this.initLights();
    this.initGameObjects();

}

GameManager.prototype.initShader = function() {
    //FIXME
     initShaders();
}
GameManager.prototype.initMeshes = function() {
}

GameManager.prototype.initTextures = function(urls, callback) {
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

GameManager.prototype.initCameras = function() {
}

GameManager.prototype.initLights = function() {
}

GameManager.prototype.initGameObjects = function() {
}



GameManager.prototype.draw = function() {
	
}
GameManager.prototype.drawHUD = function() {
    
}
GameManager.prototype.drawMirrorReflection = function() {
    
}
GameManager.prototype.drawFlare = function() {
    
}

GameManager.prototype.update = function(delta_t) {
   
}






GameManager.prototype.resetCar = function() {
    
}
GameManager.prototype.restartGame = function() {
    
}


function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}
var textures = [];
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