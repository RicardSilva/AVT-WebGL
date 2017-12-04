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
   // this.initTextures(["resources/title.gif"], createTextures);
    this.initCameras();
    this.initLights();
    this.initGameObjects();
    document.getElementById("loadingtext").textContent = "";
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

	this.activeCamera = topCamera;
}

GameManager.prototype.initLights = function() {
}

GameManager.prototype.initGameObjects = function() {
	
	this.track = new Track(vec3.fromValues(0,-0.1,0), this.shader);
	this.track.loadFromFile(this.track, "../resources/tracks/track.txt");
	
	this.car = new Car(this.track.getStartingPosition(), this.shader);
}


GameManager.prototype.draw = function() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(modelMatrix);

    this.activeCamera.computeView();
    this.activeCamera.computeProjection();
    this.shader.use();
    this.car.draw();
    this.track.draw();

}

GameManager.prototype.drawHUD = function() {
    
}

GameManager.prototype.drawMirrorReflection = function() {
    
}

GameManager.prototype.drawFlare = function() {
    
}

GameManager.prototype.update = function(timeStep) {
   this.car.update(timeStep);
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
    return ((obj1.maxCorner.x > obj2.minCorner.x) && (obj1.minCorner.x < obj2.maxCorner.x) 
			&& (obj1.maxCorner.z > obj2.minCorner.z) && (obj1.minCorner.z < obj2.maxCorner.z));
}

GameManager.prototype.computePositionAfterCollision = function(obj1, obj2) {
    var distance = vec3.create(obj2.center.x - obj1.center.x,
							obj2.center.y - obj1.center.y,
							obj2.center.z - obj1.center.z);
	
	var x = (obj1.maxCorner.x - obj1.minCorner.x)/2 + (obj2.maxCorner.x - obj2.minCorner.x)/2 - fabs(distance.x);
	var z = (obj1.maxCorner.z - obj1.minCorner.z)/2 + (obj2.maxCorner.z - obj2.minCorner.z)/2 - fabs(distance.x);
	
	if (x < z) {
		if (distance.x < 0)
			x = -x;
		obj1.position.set(obj1.position.x - x, obj1.position.y, obj.position.z);
	}
	else {
		if (distance.z > 0)
			z = -z;
		obj1.position.set(obj1.position.x, obj1.position.y, obj.position.z + z);
	}
	
	obj1.updateHitbox();
}

GameManager.prototype.processCarObstacleCollision = function(obj) {
    obs.angle.copy(car.angle);
	obs.speed.copy(car.speed);
	car.speed = vec3.set(0, 0, 0);
	
	this.computePositionAfterCollision(car, obj);
}

GameManager.prototype.resetCar = function() {
	this.car.angle = 0;
	this.car.speed.set(0, 0, 0);
	this.car.position.set(this.track.startingPosition);

	if (--this.carLives == 0) {
		this.gameOver = true;
		this.pause = true;
	}
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
			this.resetCar();
	}
	
	for (lamp of this.track.lamps){
		if(this.checkCollision(this.car, lamp))
			this.processCarObstacleCollision(lamp);
	}
	
	for (border of this.track.borders){
		if(this.checkCollision(this.car, border))
			this.resetCar();
	}
	
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
	switch (key) {
	/*case 27:
		glutLeaveMainLoop();
		break;*/
	case 49:
		//activeCamera = cameras[0];
		break;
	case 50:
		//activeCamera = cameras[1];
		break;
	case 51:
		//activeCamera = cameras[2];
		break;
	case 52:
		//activeCamera = cameras[3];
		break;
	case 53:
		//activeCamera = cameras[4];
		break;
	/*case '8':
		track->toogleDirectionalLight();
		day = !day;
		if (day) {
			if (raining && foggy)
				setDayRainingFoggyColor();
			else if (raining)
				setDayRainingColor();
			else if (foggy)
				setDayFoggyColor();
			else {
				setDayClearColor();
			}
		}

		else
			if (foggy)
				setNightFoggyColor();
			else
				setNightColor();

		break;
	case '9':
		track->tooglePointLights();
		break;
	case '0':
		car->toogleSpotLights();
		break;*/
	case 68:
		this.car.turnRight = true;
		break;
	case 83:
		this.car.goBack = true;
		break;
	case 87:
		this.car.goForward = true;
		break;
	case 65:
		this.car.turnLeft = true;
		break;
	case 80:
		this.pause = !this.pause;
		break;
	case 49:
		this.restart();
		break;
	case 39:
		this.car.turnRight = true;
		break;
	case 37:
		this.car.turnLeft = true;
		break;
	case 38:
		this.car.goForward = true;
		break;
	case 40:
		this.car.goBack = true;
		break;
	/*case 112:
		raining = !raining;
		if (day) {
			if (raining) {
				if (foggy)
					setDayRainingFoggyColor();
				else
					setDayRainingColor();

			}
			else {
				if (foggy)
					setDayFoggyColor();
				else
					setDayClearColor();
			}
		}
		break;
	case 113:
		/*foggy = !foggy;
		if (foggy) {
			fog->on();
			if (day) {
				if (raining)
					setDayRainingFoggyColor();
				else
					setDayFoggyColor();
			}
			else
				setNightFoggyColor();
		}
		else {
			fog->off();
			if (day) {
				if (raining)
					setDayRainingColor();
				else
					setDayClearColor();
			}
			else
				setNightColor();
		}

		break;*/
	case 114:
		//lensFlaring = !lensFlaring;
		break;
	}

}
GameManager.prototype.keyUp = function(key) {
	switch (key) {
	case 68:
		this.car.turnRight = false;
		break;
	case 83:
		this.car.goBack = false;
		break;
	case 87:
		this.car.goForward = false;
		break;
	case 65:
		this.car.turnLeft = false;
		break;
	case 39:
		this.car.turnRight = false;
		break;
	case 37:
		this.car.turnLeft = false;
		break;
	case 38:
		this.car.goForward = false;
		break;
	case 40:
		this.car.goBack = false;
		break;
	}
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