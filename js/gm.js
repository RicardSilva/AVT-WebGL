function GameManager(width, height) {

    this.matrices = new MatrixStack();

	this.width          = width;
	this.height         = height;

    this.lives          = 5;
    this.gameOver       = false;
    this.pause          = false;
    this.score          = 0;
    this.day            = true;
    this.raining        = false;

    this.shader;
    this.cameras = [];
    this.activeCamera;

    this.car;
    this.track;
	
	this.rain;
	this.sun;
	this.flare;

    this.init();
}

GameManager.prototype.init = function() {
    this.initShaders();
    this.initMeshes();
    this.initTextures(["../resources/textures/christmastree.gif", "../resources/textures/particle2.gif",
				"../resources/textures/lensFlare/flare2.gif", "../resources/textures/lensFlare/flare3.gif",
				"../resources/textures/lensFlare/flare4.gif", "../resources/textures/lensFlare/flare1.gif",
				"../resources/textures/lensFlare/flare6.gif", "../resources/textures/track/wood_diffuse.gif",
				"../resources/textures/track/wood_specular.gif", "../resources/textures/track/bamboo_diffuse.gif",
				"../resources/textures/track/bamboo_specular.gif", "../resources/textures/track/mask.gif",
				"../resources/textures/finish.gif", "../resources/textures/lensFlare/flare5.gif"], 
				createTextures);
    this.initCameras();
    this.initGameObjects();
    document.getElementById("loadingtext").textContent = "";
}

GameManager.prototype.initShaders = function() {
    this.shader = new Shader("shader-vs", "shader-fs");
}

var models = {}
GameManager.prototype.initMeshes = function() {
	var m = new ObjModel();
	m.loadFromFile(m, "../resources/objModels/cheerio.txt");
	models.cheerio = m;

	var m2 = new ObjModel();
	m2.loadFromFile(m2, "../resources/objModels/butter.txt");
	models.butter = m2;

	var m3 = new ObjModel();
	m3.loadFromFile(m3, "../resources/objModels/car.txt");
	models.car = m3;

	var m4 = new ObjModel();
	m4.loadFromFile(m4, "../resources/objModels/track.txt");
	models.track = m4;

	var m5 = new ObjModel();
	m5.loadFromFile(m5, "../resources/objModels/lamp.txt");
	models.lamp = m5;

	var m6 = new ObjModel();
	m6.loadFromFile(m6, "../resources/objModels/orange.txt");
	models.orange = m6;

	var m7 = new ObjModel();
	m7.loadFromFile(m7, "../resources/objModels/cube.txt");
	models.cube = m7;
	
	var m8 = new ObjModel();
	m8.loadFromFile(m8, "../resources/objModels/billboard.txt");
	models.billboard = m8;
	
	var m9 = new ObjModel();
	m9.loadFromFile(m9, "../resources/objModels/finish.txt");
	models.finishline = m9;
	
	var m10 = new ObjModel();
	m10.loadFromFile(m10, "../resources/objModels/particle.txt");
	models.particle = m10;
	
	var m11 = new ObjModel();
	m11.loadFromFile(m11, "../resources/objModels/flare.txt");
	models.flare = m11;
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

	var topPerspCamera = new PerspectiveCamera(70 * 3.14 / 180, this.width / this.height, 0.1, 1500.0);
	topPerspCamera.setEye(vec3.fromValues(0, 500, 900));
	topPerspCamera.setTarget(vec3.fromValues(0, 0, 150));
	topPerspCamera.setUp(vec3.fromValues(0, 0, -1));

	this.cameras.push(topPerspCamera);
	var carCamera = new PerspectiveCamera(60 * 3.14 / 180, this.width / this.height, 0.1, 1000.0);
	carCamera.setEye(vec3.fromValues(0, 50, -80));
	carCamera.setTarget(vec3.fromValues(0, 0, 0));
	carCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(carCamera);

	var cockpitCamera = new PerspectiveCamera(90 * 3.14 / 180, this.width / this.height, 0.1, 1000.0);
	cockpitCamera.setEye(vec3.fromValues(0, 50, -80));
	cockpitCamera.setTarget(vec3.fromValues(0, 0, 0));
	cockpitCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(cockpitCamera);

	var backCamera = new PerspectiveCamera(130 * 3.14 / 180, this.width / this.height, 0.1, 1000.0);
	backCamera.setEye(vec3.fromValues(0, 50, -80));
	backCamera.setTarget(vec3.fromValues(0, 0, 0));
	backCamera.setUp(vec3.fromValues(0, 1, 0));

	this.cameras.push(backCamera);

	this.activeCamera = carCamera;
}

GameManager.prototype.initGameObjects = function() {
	
	this.track = new Track(vec3.fromValues(0,-0.1,0), this.shader);
	this.track.loadFromFile(this.track, "../resources/tracks/track.txt");
	this.track.createFinishingLine();
	
	this.car = new Car(vec3.clone(this.track.getStartingPosition()), this.shader);
	
	this.rain = new ParticleSystem(this.shader);
	this.sun = new Sun(vec3.fromValues(800, 50, 0), this.shader);
	this.flare = new Flare(this.shader);
}

GameManager.prototype.onSpawnOrangeTimer = function() {
	if (this.pause == false)
		this.track.attemptToSpawnOrange();
}
GameManager.prototype.onIncreaseOrangeSpeedTimer = function() {
	this.track.increaseOrangeSpeed();
}

GameManager.prototype.update = function(timeStep) {
   this.car.update(timeStep);
   this.track.update(timeStep);
   
   this.processCarCollisions();
   this.processObsCollisions();
   
   //compute cameras position
   this.cameras[2].computeCarCameraPosition(this.car.position, this.car.angle);
   this.cameras[3].computeCockpitCameraPosition(this.car.position, this.car.angle);
   this.cameras[4].computeBackCameraPosition(this.car.position, this.car.angle);
}

GameManager.prototype.draw = function() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(projectionMatrix);
	
    this.activeCamera.computeView();
    this.activeCamera.computeProjection();
    this.shader.loadMatrices();
    this.shader.use();

    this.track.drawLights();
    this.car.drawLights();

    this.track.draw(this.activeCamera.eye);
    this.car.draw();

    if(this.activeCamera == this.cameras[3])
		this.drawMirrorReflection();
	
	if(this.raining)
		this.rain.draw();
	
	if (day){
	//this.sun.draw();}
	
	
}

GameManager.prototype.drawMirrorReflection = function() {
    gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.STENCIL_TEST);
	// Draw mirror

	gl.clear(gl.STENCIL_BUFFER_BIT); // Clear stencil buffer (0 by default)
	gl.stencilFunc(gl.ALWAYS, 1, 0xFF); // Set any stencil to 1
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
	gl.stencilMask(0xFF); // Write to stencil buffer
	gl.depthMask(false); // Don't write to depth buffer

	this.car.drawMirror();

	// Draw back camera
	gl.stencilFunc(gl.EQUAL, 1, 0xFF); // Pass test if stencil value is 1
	gl.stencilMask(0x00); // Don't write anything to stencil buffer
	gl.depthMask(true); // Write to depth buffer

	this.cameras[4].computeView();
	this.cameras[4].computeProjection();
	// Render objects
	
	this.track.drawLights();
	this.car.drawLights();

	this.track.draw();
	this.car.draw();


	gl.disable(gl.STENCIL_TEST);
}

GameManager.prototype.drawFlare = function() {
    //this.flare.draw(this.sun.position;);
}

GameManager.prototype.resetCar = function() {
    this.car.angle = 0;
	this.car.speed = vec3.create();
	vec3.copy(this.car.position, this.track.startingPosition);

	if (--this.lives == 0) {
		this.gameOver = true;
		this.pause = true;
	}
}

GameManager.prototype.restartGame = function() {
    this.track.restart(this.track, "../resources/tracks/track.txt");
	this.car.restart(this.track.startingPosition);
	this.lives = 5;
	this.pause = false;
	this.gameOver = false;
}

GameManager.prototype.checkCollision = function(obj1, obj2) {
    return ((obj1.maxCorner[0] > obj2.minCorner[0]) && (obj1.minCorner[0] < obj2.maxCorner[0]) 
			&& (obj1.maxCorner[2] > obj2.minCorner[2]) && (obj1.minCorner[2] < obj2.maxCorner[2]));
}

GameManager.prototype.computePositionAfterCollision = function(obj1, obj2) {
    var distance = vec3.fromValues(obj2.center[0] - obj1.center[0],
								obj2.center[1] - obj1.center[1],
								obj2.center[2] - obj1.center[2]);
	
	var x = (obj1.maxCorner[0] - obj1.minCorner[0])/2.0 + (obj2.maxCorner[0] - obj2.minCorner[0])/2.0 - Math.abs(distance[0]);
	var z = (obj1.maxCorner[2] - obj1.minCorner[2])/2.0 + (obj2.maxCorner[2] - obj2.minCorner[2])/2.0 - Math.abs(distance[2]);

	if (x < z) {
		if (distance[0] < 0)
			x = -x;
		obj1.position = vec3.fromValues(obj1.position[0] - x, obj1.position[1], obj1.position[2]);
	}
	else {
		if (distance[2] > 0)
			z = -z;
		obj1.position = vec3.fromValues(obj1.position[0], obj1.position[1], obj1.position[2] + z);
	}
	
	obj1.updateHitbox();
}

GameManager.prototype.processCarObstacleCollision = function(obj) {
    obj.angle = this.car.angle;
	vec3.copy(obj.speed, this.car.speed);
	vec3.set(this.car.speed, 0, 0, 0);
	
	this.computePositionAfterCollision(this.car, obj);
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
	
	
	for (lamp of this.track.lamps){
		for (border of this.track.borders){
			if(this.checkCollision(lamp, border))
				this.computePositionAfterCollision(lamp, border);
		}
	}
}

GameManager.prototype.setDayRainingColor = function() {
	gl.clearColor(0.35, 0.60, 0.70, 1);
}
GameManager.prototype.setDayClearColor = function() {
	gl.clearColor(0.53, 0.81, 0.92, 1);
}
GameManager.prototype.setNightColor = function() {
	gl.clearColor(0.2, 0.2, 0.2, 1);
}

GameManager.prototype.keyDown = function(key) {
	switch (key) {
	
	case 49:
		this.activeCamera = this.cameras[0];
		break;
	break;
	case 50:
		this.activeCamera = this.cameras[1];
		break;
	case 51:
		this.activeCamera = this.cameras[2];
		break;
	case 52:
		this.activeCamera = this.cameras[3];
		break;
	case 53:
		this.activeCamera = this.cameras[4];
		break;
	case 56:
		this.track.toogleDirectionalLight();
		this.day = !this.day;
		if (this.day) {
			if (this.raining)
				this.setDayRainingColor();
			else {
				this.setDayClearColor();
			}
		}

		else
			this.setNightColor();
	
		break;
	case 57:
		this.track.tooglePointLights();
		break;
	case 48:
		this.car.toogleLights();
		break;
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
	case 82:
		this.restartGame();
		break;
	case 39: //right arrow
		this.car.turnRight = true;
		break;
	case 37: //left arrow 
		this.car.turnLeft = true;
		break;
	case 38: //up arrow
		this.car.goForward = true;
		break;
	case 40: //down arrow
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

      
        // add the texture to the array of textures.
        textures.push(texture);
    }
    document.getElementById("loadingtext").textContent = "";
}