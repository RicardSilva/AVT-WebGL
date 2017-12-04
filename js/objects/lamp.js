function Lamp(position) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
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
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	
	this.shader.loadMatrices();

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial[this.model.meshes[i].material];
		this.model.meshes[i].draw(this.shader);
	}

	gameManager.matrices.popMatrix(modelID);
}

Lamp.prototype.drawLight = function() {
	
}

Lamp.prototype.update = function(timestep) {
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

		this.updateLight();
		
		this.updateHitbox();
	}
}

Lamp.prototype.updateLight = function() {
	
}

Lamp.prototype.toggleLight = function() {
	
}

Lamp.prototype.updateCenter = function() {
	this.center = vec3.fromValues(this.minCorner.x + (this.maxCorner.x - this.minCorner.x) / 2,
							this.minCorner.y + (this.maxCorner.y - this.minCorner.y) / 2,
							this.minCorner.z + (this.maxCorner.z - this.minCorner.z) / 2);
}

Lamp.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position.x - this.width / 2,
								this.position.y - this.height / 2,
								this.position.z - this.length / 2);
	this.maxCorner = vec3.fromValues(this.position.x + this.width / 2,
								this.position.y + this.height / 2,
								this.position.z + this.length / 2);
}