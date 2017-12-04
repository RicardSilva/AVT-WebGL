function Cheerio(position) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	this.isActive = true;

	this.inercia = 320;
	
	this.width = 15;
	this.height = 4.5;
	this.length = 15;
	
	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = model;
	this.shader = shader;
	
	this.updateCenter();
	
	this.updateHitbox();
}

Cheerio.prototype.draw = function() {
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.shader.loadMatrices();

	this.shader.loadMaterial[this.model.meshes[0].material];
	this.model.meshes[0].draw(this.shader);

	gameManager.matrices.popMatrix(modelID);
}

Cheerio.prototype.update = function(timestep) {
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

Cheerio.prototype.updateCenter = function() {
	this.center = vec3.fromValues(this.minCorner.x + (this.maxCorner.x - this.minCorner.x) / 2,
						this.minCorner.y + (this.maxCorner.y - this.minCorner.y) / 2,
						this.minCorner.z + (this.maxCorner.z - this.minCorner.z) / 2);
}

Cheerio.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position.x - this.width / 2,
								this.position.y - this.height / 2,
								this.position.z - this.length / 2);
	this.maxCorner = vec3.fromValues(this.position.x + this.width / 2,
								this.position.y + this.height / 2,
								this.position.z + this.length / 2);
}