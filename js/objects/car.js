function Car(position, shader) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	
	this.turnLeft = false;
	this.turnRight = false;
	this.goForward = false;
	this.goBack = false;
	
	this.angleInc = 1.5;
	this.maxSpeed = 250;
	this.maxBackwardsSpeed = -175;

	this.acceleration = 150;
	this.backwardsAcceleration = 200;
	this.inercia = 175;
	
	this.leftLight = new SpotLight(vec4.fromValues(position[0] + 14.4, position[1] + 20,
												   position[2] - 4.60, 1),
									vec4.fromValues(1, 0, 0, 0), [1,1,1], 1, shader);
	this.rightLight = new SpotLight(vec4.fromValues(position[0] + 14.4, position[1] + 20,
												    position[2] + 4.60, 1),
									vec4.fromValues(1, 0, 0, 0), [1,1,1], 1, shader);
	
	this.width = 16.2;
	this.height = 11.7;
	this.length = 30;

	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = models.car;	
	this.shader = shader;
	
	this.updateHitbox();
	
}


Car.prototype.draw = function() {

	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.rotateY(modelMatrix, modelMatrix, (this.angle * 3.14 / 180), [0, 1, 0]);
	this.shader.loadMatrices();

	gl.cullFace(gl.FRONT);


	this.shader.loadMaterial(this.model.meshes[2].material);
	this.model.meshes[2].draw(this.shader);
	this.shader.loadMaterial(this.model.meshes[3].material);
	this.model.meshes[3].draw(this.shader);
	this.shader.loadMaterial(this.model.meshes[4].material);
	this.model.meshes[4].draw(this.shader);
	this.shader.loadMaterial(this.model.meshes[5].material);
	this.model.meshes[5].draw(this.shader);
	this.shader.loadMaterial(this.model.meshes[8].material);
	this.model.meshes[8].draw(this.shader);
	
	gl.cullFace(gl.BACK);
	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial(this.model.meshes[i].material);
		this.model.meshes[i].draw(this.shader);
	}
	gameManager.matrices.popMatrix(modelID);


	//this.drawHitbox();

}
Car.prototype.drawHitbox = function() {
	gameManager.matrices.pushMatrix(modelID);

	mat4.translate(modelMatrix, modelMatrix, this.center);

	mat4.scale(modelMatrix, modelMatrix, [this.maxCorner[0] - this.minCorner[0],
							  this.maxCorner[1] - this.minCorner[1],
							  this.maxCorner[2] - this.minCorner[2]]);
	this.shader.loadMatrices();


	
	this.shader.loadMaterial(models.cube.meshes[0].material);
	models.cube.meshes[0].draw(this.shader);
	
	gameManager.matrices.popMatrix(modelID);

}

Car.prototype.drawLights = function() {
	this.leftLight.draw();
	this.rightLight.draw();
}

Car.prototype.drawMirror = function() {
	gameManager.matrices.pushMatrix(modelID);

	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.rotateY(modelMatrix, modelMatrix, (this.angle * 3.14 / 180), [0, 1, 0]);
	this.shader.loadMatrices();

	this.shader.loadMaterial(this.model.meshes[9].material);
	this.model.meshes[9].draw(this.shader);

	gameManager.matrices.popMatrix(modelID);
}

Car.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;	// convert ms to seconds

	var cosAngle;
	var sinAngle;

	var posX = this.position[0];
	var posZ = this.position[2];

	var speedX = this.speed[0];
	var speedZ = this.speed[2];

	// update angle
	if (this.turnLeft) {
		this.angle += this.angleInc; 
		this.angle = this.angle % 360;
	}
	else if (this.turnRight) {
		this.angle -= this.angleInc;
		this.angle = this.angle % 360;
	}

	cosAngle = Math.cos(this.angle * 3.14 / 180);	
	sinAngle = Math.sin(this.angle * 3.14 / 180);

	// update speed
	if (this.goForward) {
		speedX = speedX + this.acceleration * timeStep;
		if (speedX > this.maxSpeed) {
			speedX = this.maxSpeed;
		}
		this.speed[0] = speedX;

		speedZ = speedZ + this.acceleration * timeStep;
		if (speedZ > this.maxSpeed) {
			speedZ = this.maxSpeed;
		}
		this.speed[2] = speedZ;

	}
	else if (!this.goForward && !this.goBack) {
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0) {
				speedX = 0;
			}
			this.speed[0] = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0) {
				speedX = 0;
			}
			this.speed[0] = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedZ - this.inercia * timeStep;
			if (speedZ < 0) {
				speedZ = 0;
			}
			this.speed[2] = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0) {
				speedZ = 0;
			}
			this.speed[2] = speedZ;
		}
	}
	else if (this.goBack) {
		if (speedX > this.maxBackwardsSpeed) {
			speedX = speedX - this.backwardsAcceleration * timeStep;
			if (speedX < this.maxBackwardsSpeed) {
				speedX = this.maxBackwardsSpeed;
			}
			this.speed[0]= speedX;
		}
		if (speedZ > this.maxBackwardsSpeed) {
			speedZ = speedZ - this.backwardsAcceleration * timeStep;
			if (speedZ < this.maxBackwardsSpeed) {
				speedZ = this.maxBackwardsSpeed;
			}
			this.speed[2] = speedZ;
		}
	}

	// update position
	this.position[0] = posX + speedX * cosAngle * timeStep;
	this.position[2] = posZ + speedZ * -sinAngle * timeStep;

	this.updateLights();
	this.updateHitbox();
}

Car.prototype.updateLights = function() {
	var posX;
	var posZ;

	var cosAngle = Math.cos(this.angle * 3.14 / 180);
	var sinAngle = Math.sin(this.angle * 3.14 / 180);

	//left
	//update light position
	posX = 10 * cosAngle + 
	       -4.5 * sinAngle + this.position[0];
	posZ = -4.5 * cosAngle -
		   10 * sinAngle + this.position[2];
	this.leftLight.position = vec4.fromValues(posX, 1, posZ, 1);

	//update light direction
	this.leftLight.direction = vec4.fromValues(cosAngle, -0.1,
											  -sinAngle, 0);

	//right
	posX = 10 * cosAngle + 
	       4.5 * sinAngle + this.position[0];
	posZ = 4.5 * cosAngle - 
	       10 * sinAngle + this.position[2];
	this.rightLight.position = vec4.fromValues(posX, 1, posZ, 1);
	
	this.rightLight.direction = vec4.fromValues(cosAngle, -0.1, 
		                                       -sinAngle, 0);
}
Car.prototype.toogleLights = function() {
	if (this.leftLight.isActive || this.rightLight.isActive) {
			this.leftLight.isActive = false;
			this.rightLight.isActive = false;
		}
		else {
			this.leftLight.isActive = true;
			this.rightLight.isActive = true;
		}
}

Car.prototype.restart = function(position) {
	this.position = position;
	this.angle = 0;
	this.speed = vec3.create();
	
}

Car.prototype.updateHitbox = function() { 
	var sinAngle = Math.abs(Math.sin(this.angle * 3.14 / 180));
	var cosAngle = Math.abs(Math.cos(this.angle * 3.14 / 180));
	
	this.minCorner = vec3.fromValues(this.position[0] - (this.length * cosAngle + this.width * sinAngle) / 2,
								this.position[1] - this.height / 2,
								this.position[2] - (this.length * sinAngle + this.width * cosAngle) / 2);
	this.maxCorner = vec3.fromValues(this.position[0] + (this.length * cosAngle + this.width * sinAngle) / 2,
								this.position[1] + this.height / 2,
								this.position[2] + (this.length * sinAngle + this.width * cosAngle) / 2);
	this.center = vec3.fromValues(this.minCorner[0] + (this.maxCorner[0] - this.minCorner[0]) / 2,
							this.minCorner[1] + (this.maxCorner[1] - this.minCorner[1]) / 2,
							this.minCorner[2] + (this.maxCorner[2] - this.minCorner[2]) / 2);
}
