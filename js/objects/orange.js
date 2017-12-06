function Orange(position, speed, rotationAngle, rotationAxle, shader) {
	this.position = position;
	this.speed = speed;
	this.angle = 0;
	this.isActive = true;
	
	this.maxSpeed = 325;
	this.acceleration = 150;
	this.rotationAngle = rotationAngle;
	this.rotationAxle = rotationAxle;
	
	this.radius = 15;
	
	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.shader = shader;
	this.model = models.orange;
	
	this.updateHitbox();
}

Orange.prototype.draw = function() {
	gameManager.matrices.pushMatrix(modelID);

	var pos;
	vec3.add(pos, this.position, vec3.fromValues(0,30,0));
	mat4.translate(modelMatrix, modelMatrix, pos);
	mat4.rotate(modelMatrix, modelMatrix, this.rotationAngle, this.rotationAxle);

	this.shader.loadMatrices();

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial(this.model.meshes[i].material);
		this.model.meshes[i].draw(this.shader);
	}

	gameManager.matrices.popMatrix(modelID);
}

Orange.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;
	
	var speedX = this.speed[0];
	var speedZ = this.speed[2];
	
	var cosAngle = Math.cos(this.angle * 3.14 / 180);
	var sinAngle = Math.sin(this.angle * 3.14 / 180);

	var posX = this.position[0];
	var posZ = this.position[2];
	
	// update position
	this.position[0] = posX + speedX * cosAngle * timeStep;
	this.position[2] = posZ + speedZ * -sinAngle * timeStep;
	
	// update rotation angle
	this.rotationAngle = this.rotationAngle + speed[0] * 0.04;
	this.rotationAngle = this.rotationAngle % 360;
	
	this.updateHitbox();
}

Orange.prototype.increaseSpeed = function() {
	this.speed[0] += 20;
	this.speed[0] += 20;

	if (this.speed[0] > 400)
		this.speed[0] = 400;
	if (this.speed[2] > 400)
		this.speed[2] = 400;
}


Orange.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position[0] - this.radius,
								this.position[1] - this.radius + 30,
								this.position[2] - this.radius);
	this.maxCorner = vec3.fromValues(this.position[0] + this.radius,
								this.position[1] + this.radius + 30,
								this.position[2] + this.radius);
	this.center = vec3.fromValues(this.minCorner[0] + (this.maxCorner[0] - this.minCorner[0]) / 2,
							this.minCorner[1] + (this.maxCorner[1] - this.minCorner[1]) / 2,
							this.minCorner[2] + (this.maxCorner[2] - this.minCorner[2]) / 2);
}