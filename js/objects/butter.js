function Butter(position) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	this.isActive = true;
	
	this.inercia = 350;
	
	this.width = 18;
	this.height = 20;
	this.length = 40;
	
	this.updateCenter();
	
	this.updateHitbox();
}

Butter.prototype.draw = function() {
	
}

Butter.prototype.update = function(timestep) {
	timeStep = timeStep / 1000;
	
	var speedX = this.speed.x;
	var speedZ = this.speed.z;
	
	if (!(speedX == 0 && speedZ == 0)) { //TODO sin/cos lib
		var cosAngle = cos(this.angle * 3.14 / 180);
		var sinAngle = sin(this.angle * 3.14 / 180);
		
		var posX = this.position.x;
		var posZ = this.position.z;
		
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0)
				speedX = 0;
			this.speed.x = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0)
				speedX = 0;
			this.speed.x = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedX - this.inercia * timeStep;
			if (speedZ < 0)
				speedZ = 0;
			this.speed.z = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0)
				speedZ = 0;
			this.speed.z = speedZ;
		}

		// update position
		this.position.x = posX + speedX * cosAngle * timeStep;
		this.position.z = posZ + speedZ * -sinAngle * timeStep;

		this.updateHitbox();
	}
}

Butter.prototype.updateCenter = function() {
	this.center = vec3.fromValues(this.minCorner.x + (this.maxCorner.x - this.minCorner.x) / 2,
							this.minCorner.y + (this.maxCorner.y - this.minCorner.y) / 2,
							this.minCorner.z + (this.maxCorner.z - this.minCorner.z) / 2);
}

Butter.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position.x - this.width / 2,
								this.position.y - this.height / 2,
								this.position.z - this.length / 2);
	this.maxCorner = vec3.fromValues(this.position.x + this.width / 2,
								this.position.y + this.height / 2,
								this.position.z + this.length / 2);
}