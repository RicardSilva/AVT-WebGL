function Car(position, model, shader) {
	this.position = position;
	this.speed = vec3.create(0, 0, 0);
	this.angle = 0;
	
	this.turnLeft = false;
	this.turnRight = false;
	this.goForward = false;
	this.goBack = false;
	
	this.angleInc = 3;
	this.maxSpeed = 325;
	this.maxBackwardsSpeed = -175;

	this.acceleration = 150;
	this.backwardsAcceleration = 200;
	this.inercia = 175;
	
	this.createLights();
	
	this.width = 16.2;
	this.height = 11.7;
	this.length = 30;

	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = model;
	this.shader = shader;
	this.updateHitbox();
	this.updateCenter();
	
}

Car.prototype.createLights = function() {
	this.lights = [];
	//this.lights.push(/*new Spotlight()*/);
}

Car.prototype.draw = function() {
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.rotate(modelMatrix, modelMatrix, this.angle, [0, 1, 0]);
	this.shader.loadMatrices();

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial[this.model.meshes[i]];
		this.model.meshes[i].draw();
	}


	gameManager.matrices.popMatrix(modelID);
	alert(this.position);
}

Car.prototype.drawLights = function() {
	
}

Car.prototype.drawMirror = function() {
	
}

Car.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;	// convert ms to seconds

	var cosAngle;
	var sinAngle;

	var posX = this.position.x;
	var posZ = this.position.z;

	var speedX = this.speed.x;
	var speedZ = this.speed.z;

	// update angle
	if (this.turnLeft) {
		this.angle += this.angleInc; 
		this.angle = this.angle % 360;
	}
	else if (this.turnRight) {
		this.angle -= this.angleInc;
		this.angle = this.angle % 360;
	}

	cosAngle = cos(this.angle * 3.14 / 180);	// TODO sin/cos lib
	sinAngle = sin(this.angle * 3.14 / 180);

	// update speed
	if (this.goForward) {
		speedX = speedX + this.acceleration * timeStep;
		if (speedX > this.maxSpeed) {
			speedX = this.maxSpeed;
		}
		this.speed.x = speedX;

		speedZ = speedZ + this.acceleration * timeStep;
		if (speedZ > this.maxSpeed) {
			speedZ = this.maxSpeed;
		}
		this.speed.z = speedZ;

	}
	else if (!this.goForward && !this.goBack) {
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0) {
				speedX = 0;
			}
			this.speed.x = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0) {
				speedX = 0;
			}
			this.speed.x = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedZ - this.inercia * timeStep;
			if (speedZ < 0) {
				speedZ = 0;
			}
			this.speed.z = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0) {
				speedZ = 0;
			}
			this.speed.z = speedZ;
		}
	}
	else if (this.goBack) {
		if (speedX > this.maxBackwardsSpeed) {
			speedX = speedX - this.backwardsAcceleration * timeStep;
			if (speedX < this.maxBackwardsSpeed) {
				speedX = this.maxBackwardsSpeed;
			}
			this.speed.x = speedX;
		}
		if (speedZ > this.maxBackwardsSpeed) {
			speedZ = speedZ - this.backwardsAcceleration * timeStep;
			if (speedZ < this.maxBackwardsSpeed) {
				speedZ = this.maxBackwardsSpeed;
			}
			this.speed.z = speedZ;
		}
	}

	// update position
	this.position.x = posX + speedX * cosAngle * timeStep;
	this.position.z = posZ + speedZ * -sinAngle * timeStep;

	updateLights();

	updateHitbox();
}

Car.prototype.updateLights = function() {
	
}

Car.prototype.restart = function() {
	
}

Car.prototype.updateCenter = function() {
	this.center = vec3.fromValues(this.minCorner[0] + (this.maxCorner[0] - this.minCorner[0]) / 2,
							this.minCorner[1] + (this.maxCorner[1] - this.minCorner[1]) / 2,
							this.minCorner[2] + (this.maxCorner[2] - this.minCorner[2]) / 2);
}

Car.prototype.updateHitbox = function() { //TODO sin/cos/abs lib
	var sinAngle = Math.abs(Math.sin(this.angle * 3.14 / 180));
	var cosAngle = Math.abs(Math.cos(this.angle * 3.14 / 180));
	
	this.minCorner = vec3.fromValues(this.position[0] - (this.length * cosAngle + this.width * sinAngle) / 2,
								this.position[1] - this.height / 2,
								this.position[2] - (this.length * sinAngle + this.width * cosAngle) / 2);
	this.maxCorner = vec3.fromValues(this.position[0] + (this.length * cosAngle + this.width * sinAngle) / 2,
								this.position[1] + this.height / 2,
								this.position[2] + (this.length * sinAngle + this.width * cosAngle) / 2);
}