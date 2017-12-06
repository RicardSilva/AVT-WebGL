function Cheerio(position, shader) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;

	this.inercia = 320;
	
	this.width = 15;
	this.height = 4.5;
	this.length = 15;
	
	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = models.cheerio;
	this.shader = shader;
	
	this.updateHitbox();
	
}

Cheerio.prototype.draw = function() {

	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.shader.loadMatrices();
	
	this.model.meshes[0].draw(this.shader);

	gameManager.matrices.popMatrix(modelID);
	this.drawHitbox();
}
Cheerio.prototype.drawHitbox = function() {
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

Cheerio.prototype.update = function(timeStep) {
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

Cheerio.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position[0] - this.width / 2,
								this.position[1] - this.height / 2,
								this.position[2] - this.length / 2);
	this.maxCorner = vec3.fromValues(this.position[0] + this.width / 2,
								this.position[1] + this.height / 2,
								this.position[2] + this.length / 2);
	this.center = vec3.fromValues(this.minCorner[0] + (this.maxCorner[0] - this.minCorner[0]) / 2,
						this.minCorner[1] + (this.maxCorner[1] - this.minCorner[1]) / 2,
						this.minCorner[2] + (this.maxCorner[2] - this.minCorner[2]) / 2);

}