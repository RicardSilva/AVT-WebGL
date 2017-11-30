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
	
	this.updateHitbox();
}

Orange.prototype.draw = function() {
	
}

Orange.prototype.update = function() {
	
}

Orange.prototype.increaseSpeed = function() {
	
}

Orange.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.radius;
    this.yMin = this.position[1] - this.radius + 30;
	this.zMin = this.position[2] - this.radius;
	this.xMax = this.position[0] + this.radius;
    this.yMax = this.position[1] + this.radius + 30;
	this.zMax = this.position[2] + this.radius;
}