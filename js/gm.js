function GameManager(width, height) {

    this.matrices = new MatrixStack();

	this.width          = width;
	this.height         = height;
    this.lives          = 5;
    this.gameOver       = false;
    this.pause          = false;
    this.score          = 0;

    this.shader;
    this.cameras = [];
    this.activeCamera;

    this.car;
    this.track;

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

GameManager.prototype.initShaders = function() {
    this.shader = new Shader("shader-vs", "shader-fs");
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
	mat4.identity(viewMatrix);

	var topCamera = new OrthoCamera(-750, 750,-550,550, 0.1,150);
	topCamera.setEye(vec3.fromValues(0,100,0));
	topCamera.setTarget(vec3.fromValues(0,0,0));
	topCamera.setUp(vec3.fromValues(0,0,-1));
	

	this.cameras.push(topCamera);

	var topPerspCamera = new PerspectiveCamera(70, this.width / this.height, 0.1, 1500.0);
	topPerspCamera.setEye(vec3.fromValues(0, 500, 900));
	topPerspCamera.setTarget(vec3.fromValues(0, 0, 150));
	topPerspCamera.setUp(vec3.fromValues(0, 0, -1));

	this.cameras.push(topPerspCamera);

	var carCamera = new PerspectiveCamera(60, this.width / this.height, 0.1, 1000.0);
	carCamera.setEye(vec3.fromValues(0, 50, -80));
	carCamera.setTarget(vec3.fromValues(0, 0, 0));
	carCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(carCamera);

	var cockpitCamera = new PerspectiveCamera(90, this.width / this.height, 0.1, 1000.0);
	cockpitCamera.setEye(vec3.fromValues(0, 50, -80));
	cockpitCamera.setTarget(vec3.fromValues(0, 0, 0));
	cockpitCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(cockpitCamera);

	var backCamera = new PerspectiveCamera(130, this.width / this.height, 0.1, 1000.0);
	backCamera.setEye(vec3.fromValues(0, 50, -80));
	backCamera.setTarget(vec3.fromValues(0, 0, 0));
	backCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(backCamera);

	this.activeCamera = carCamera;
}

GameManager.prototype.initLights = function() {
}

GameManager.prototype.initGameObjects = function() {
	this.track = new Track(vec3.fromValues(0,-0.1,0));
	this.car = new Car(track.getStartingPosition());
}


GameManager.prototype.draw = function() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(modelMatrix);

    this.activeCamera.computeView();
    this.activeCamera.computeProjection();
    this.shader.use();
}
}

GameManager.prototype.drawHUD = function() {
    
}

GameManager.prototype.drawMirrorReflection = function() {
    
}

GameManager.prototype.drawFlare = function() {
    
}

GameManager.prototype.update = function(timeStep) {
   //this.car.update(timeStep);
   //this.track.update(timeStep);
   
   this.processCarCollisions();
   this.processObsCollisions();
   
   //compute cameras position
}

GameManager.prototype.resetCar = function() {
    
}

GameManager.prototype.restartGame = function() {
    
}

GameManager.prototype.checkCollision = function(obj1, obj2) {
    return ((obj1.XMax > obj2.XMin) && (obj1.XMin < obj2.XMax) && (obj1.ZMax > obj2.ZMin) && (obj1.ZMin < obj2.ZMax));
}

GameManager.prototype.computePositionAfterCollision = function(obj1, obj2) {
    var distance = [obj2.center[0] - obj1.center[0], obj2.center[1] - obj1.center[1], obj2.center[2] - obj1.center[2]];
	
	var x = (obj1.xMax - obj1.xMin)/2 + (obj2.xMax - obj2.xMin)/2 - fabs(distance[0]);
	var z = (obj1.zMax - obj1.zMin)/2 + (obj2.zMax - obj2.zMin)/2 - fabs(distance[0]);
	
	if (x < z) {
		if (distance[0] < 0)
			x = -x;
		obj1.position([obj1.position[0] - x, obj1.position[1], obj.position[2]]);
	}
	else {
		if (distance[2] > 0)
			z = -z;
		obj1.position([obj1.position[0], obj1.position[1], obj.position[2] + z]);
	}
	
	obj1.updateHitbox();
}

GameManager.prototype.processCarObstacleCollision = function(obj) {
    obs.angle = car.angle;
	obs.speed = car.speed;
	car.speed = [0, 0, 0];
	
	this.computePositionAfterCollision(car, obj);
}

GameManager.prototype.processCarCollisions = function() {
    for (cheerio of this.track.cheerios){
		if(this.checkCollision(this.car, cheerio))
			this.processCarObstacleCollision(cheerio);
	}
	
	for (butter of this.track.butters){
		if(this.checkCollision(this.car, butter))
			this.processCarObstacleCollision(butter);
	}
	
	for (orange of this.track.oranges){
		if(this.checkCollision(this.car, orange))
			this.processCarObstacleCollision(orange);
	}
	
	for (lamp of this.track.lamps){
		if(this.checkCollision(this.car, lamp))
			this.processCarObstacleCollision(lamp);
	}
	
	//TODO borders
	
	//TODO finishline
}

GameManager.prototype.processOrangeCollision = function(i) {
    track.removeOrange(i);
}

GameManager.prototype.processObsCollisions = function() {
    for (cheerio of this.track.cheerios){
		for (border of this.track.borders){
			if(this.checkCollision(cheerio, border))
				this.computePositionAfterCollision(cheerio, border);
		}
	}
	
	for (butter of this.track.butters){
		for (border of this.track.borders){
			if(this.checkCollision(butter, border))
				this.computePositionAfterCollision(butter, border);
		}
	}
	
	for (orange of this.track.oranges){
		for (border of this.track.borders){
			if(this.checkCollision(orange, border))
				this.processOrangeCollision(orange);
		}
	}
	for (i = 0; i < this.track.oranges.length; i++){
		for (border of this.track.borders){
			if(this.checkCollision(oranges[i], border))
				this.processOrangeCollision(i);
		}
	}
	
	for (lamp of this.track.lamps){
		for (border of this.track.borders){
			if(this.checkCollision(lamp, border))
				this.computePositionAfterCollision(lamp, border);
		}
	}
}

GameManager.prototype.keyDown = function(key) {
	
}
GameManager.prototype.keyUp = function(key) {

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