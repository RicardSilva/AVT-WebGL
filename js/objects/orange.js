function Orange(position, speed, rotationAngle, rotationAxle) {
	this.position = position;
	this.speed = speed;
	this.angle = 0;
	this.isActive = true;
	
	this.maxSpeed = 325;
	this.acceleration = 150;
	this.rotationAngle = rotationAngle;
	this.rotationAxle = rotationAxle;
	
	this.radius = 15;
	
	this.updateCenter();
	
	this.updateHitbox();
}

Orange.prototype.draw = function() {
	
}

Orange.prototype.update = function(timestep) {
	timeStep = timeStep / 1000;
	
	var speedX = speed[0];
	var speedZ = speed[2];
	
	var cosAngle = cos(angle * 3.14 / 180);
	var sinAngle = sin(angle * 3.14 / 180);

	var posX = position[0];
	var posZ = position[2];
	
	// update position
	position[0] = posX + speedX * cosAngle * timeStep;
	position[2] = posZ + speedZ * -sinAngle * timeStep;
	
	// update rotation angle
	this.rotationAngle = this.rotationAngle + speed[0] * 0.04;
	this.rotationAngle = this.rotationAngle % 360;
	
	this.updateHitbox();
}

Orange.prototype.increaseSpeed = function() {
	
}

Orange.prototype.updateCenter = function() {
	this.center = [xMin + (xMax - xMin) / 2, yMin + (yMax - yMin) / 2, zMin + (zMax - zMin) / 2];
}

Orange.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.radius;
    this.yMin = this.position[1] - this.radius + 30;
	this.zMin = this.position[2] - this.radius;
	this.xMax = this.position[0] + this.radius;
    this.yMax = this.position[1] + this.radius + 30;
	this.zMax = this.position[2] + this.radius;
}