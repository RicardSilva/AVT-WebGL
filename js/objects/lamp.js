function Lamp(position) {
	this.position = position;
	this.speed = speed;
	this.angle = 0;
	this.isActive = true;
	
	this.inercia = 370;
	
	this.createLight();
	
	this.width = 7.8;
	this.height = 37;
	this.length = 7.8;
	
	this.updateCenter();
	
	this.updateHitbox();
}

Lamp.prototype.createLight = function() {
	//this.light = [];
	//this.light.push(/*new Pointlight()*/);
}

Lamp.prototype.draw = function() {
	
}

Lamp.prototype.drawLight = function() {
	
}

Lamp.prototype.update = function(timestep) {
	timeStep = timeStep / 1000;
	
	var speedX = speed[0];
	var speedZ = speed[2];
	
	if (!(speedX == 0 && speedZ == 0)) { //TODO sin/cos lib
		var cosAngle = cos(angle * 3.14 / 180);
		var sinAngle = sin(angle * 3.14 / 180);
		
		var posX = position[0];
		var posZ = position[2];
		
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0)
				speedX = 0;
			speed[0] = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0)
				speedX = 0;
			speed[0] = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedX - this.inercia * timeStep;
			if (speedZ < 0)
				speedZ = 0;
			speed[2] = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0)
				speedZ = 0;
			speed[2] = speedZ;
		}

		// update position
		position[0] = posX + speedX * cosAngle * timeStep;
		position[2] = posZ + speedZ * -sinAngle * timeStep;

		this.updateLight();
		
		this.updateHitbox();
	}
}

Lamp.prototype.updateLight = function() {
	
}

Lamp.prototype.toggleLight = function() {
	
}

Lamp.prototype.updateCenter = function() {
	this.center = [xMin + (xMax - xMin) / 2, yMin + (yMax - yMin) / 2, zMin + (zMax - zMin) / 2];
}

Lamp.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.width / 2;
    this.yMin = this.position[1] - this.height / 2;
	this.zMin = this.position[2] - this.length / 2;
	this.xMax = this.position[0] + this.width / 2;
    this.yMax = this.position[1] + this.height / 2;
	this.zMax = this.position[2] + this.length / 2;
}