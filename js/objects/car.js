function Car(position) {
	this.position = position;
	this.speed = [0, 0, 0];
	this.angle = 0;
	this.isActive = true;
	
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
	
	this.updateCenter();
	
	this.updateHitbox();
}

Car.prototype.createLights = function() {
	this.lights = [];
	//this.lights.push(/*new Spotlight()*/);
}

Car.prototype.draw = function() {
	
}

Car.prototype.drawLights = function() {
	
}

Car.prototype.drawMirror = function() {
	
}

Car.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;	// convert ms to seconds

	var cosAngle;
	var sinAngle;

	var posX = position[0];
	var posZ = position[2];

	var speedX = speed[0];
	var speedZ = speed[2];

	// update angle
	if (this.turnLeft) {
		this.angle += this.angleInc; 
		this.angle = this.angle % 360;
	}
	else if (this.turnRight) {
		this.angle -= this.angleInc;
		this.angle = this.angle % 360;
	}

	cosAngle = cos(angle * 3.14 / 180);	// TODO sin/cos lib
	sinAngle = sin(angle * 3.14 / 180);

	// update speed
	if (this.goForward) {
		speedX = speedX + this.acceleration * timeStep;
		if (speedX > this.maxSpeed) {
			speedX = this.maxSpeed;
		}
		speed[0] = speedX;

		speedZ = speedZ + this.acceleration * timeStep;
		if (speedZ > this.maxSpeed) {
			speedZ = this.maxSpeed;
		}
		speed[2] = speedZ;

	}
	else if (!this.goForward && !this.goBack) {
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0) {
				speedX = 0;
			}
			speed[0] = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0) {
				speedX = 0;
			}
			speed[0] = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedZ - this.inercia * timeStep;
			if (speedZ < 0) {
				speedZ = 0;
			}
			speed[2] = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0) {
				speedZ = 0;
			}
			speed[2] = speedZ;
		}
	}
	else if (this.goBack) {
		if (speedX > this.maxBackwardsSpeed) {
			speedX = speedX - this.backwardsAcceleration * timeStep;
			if (speedX < this.maxBackwardsSpeed) {
				speedX = this.maxBackwardsSpeed;
			}
			speed[0] = speedX;
		}
		if (speedZ > this.maxBackwardsSpeed) {
			speedZ = speedZ - this.backwardsAcceleration * timeStep;
			if (speedZ < this.maxBackwardsSpeed) {
				speedZ = this.maxBackwardsSpeed;
			}
			speed[2] = speedZ;
		}
	}

	// update position
	position[0] = posX + speedX * cosAngle * timeStep;
	position[2] = posZ + speedZ * -sinAngle * timeStep;

	updateLights();

	updateHitbox();
}

Car.prototype.updateLights = function() {
	
}

Car.prototype.restart = function() {
	
}

Car.prototype.updateCenter = function() {
	this.center = [xMin + (xMax - xMin) / 2, yMin + (yMax - yMin) / 2, zMin + (zMax - zMin) / 2];
}

Car.prototype.updateHitbox = function() { //TODO sin/cos/abs lib
	var sinAngle = fabs(sin(this.angle * 3.14 / 180));
	var cosAngle = fabs(cos(this.angle * 3.14 / 180));
	
	this.xMin = this.position[0] - (this.length * cosAngle + this.width * sinAngle) / 2;
    this.yMin = this.position[1] - this.height / 2;
	this.zMin = this.position[2] - (this.length * sinAngle + this.width * cosAngle) / 2;
	this.xMax = this.position[0] + (this.length * cosAngle + this.width * sinAngle) / 2;
    this.yMax = this.position[1] + this.height / 2;
	this.zMax = this.position[2] + (this.length * sinAngle + this.width * cosAngle) / 2;
}