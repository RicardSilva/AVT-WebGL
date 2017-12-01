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

Car.prototype.update = function() {
	
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