function Butter(position, shader) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	this.isActive = true;
	
	this.inercia = 350;
	
	this.width = 18;
	this.height = 20;
	this.length = 40;

	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = models.butter;
	this.shader = shader;
	
	this.updateHitbox();
	this.updateCenter();
	
}

Butter.prototype.draw = function() {

	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.shader.loadMatrices();

	
	this.shader.loadMaterial(this.model.meshes[0].material);
	//console.log(this.model.meshes[0].material);
	this.model.meshes[0].draw(this.shader);
	

	gameManager.matrices.popMatrix(modelID);
}

Butter.prototype.update = function(timestep) {
	timeStep = timeStep / 1000;
	
	var speedX = this.speed[0];
	var speedZ = this.speed[2];
	
	if (!(speedX == 0 && speedZ == 0)) { 
		var cosAngle = Math.cos(this.angle * 3.14 / 180);
		var sinAngle = Math.sin(this.angle * 3.14 / 180);
		
		var posX = this.position[0];
		var posZ = this.position[2];
		
		if (speedX > 0) {
			speedX = speedX - this.inercia * timeStep;
			if (speedX < 0)
				speedX = 0;
			this.speed[0] = speedX;
		}
		else if (speedX < 0) {
			speedX = speedX + this.inercia * timeStep;
			if (speedX > 0)
				speedX = 0;
			this.speed[0] = speedX;
		}

		if (speedZ > 0) {
			speedZ = speedX - this.inercia * timeStep;
			if (speedZ < 0)
				speedZ = 0;
			this.speed[2] = speedZ;
		}
		else if (speedZ < 0) {
			speedZ = speedZ + this.inercia * timeStep;
			if (speedZ > 0)
				speedZ = 0;
			this.speed[2] = speedZ;
		}

		// update position
		this.position[0] = posX + speedX * cosAngle * timeStep;
		this.position[2] = posZ + speedZ * -sinAngle * timeStep;

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