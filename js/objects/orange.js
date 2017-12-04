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
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.rotate(modelMatrix, modelMatrix, this.rotationAngle, [this.rotationAngle.x, this.rotationAngle.y, this.rotationAngle.z]);
	
	this.shader.loadMatrices();

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial[this.model.meshes[i].material];
		this.model.meshes[i].draw(this.shader);
	}

	gameManager.matrices.popMatrix(modelID);
}

Orange.prototype.update = function(timestep) {
	timeStep = timeStep / 1000;
	
	var speedX = this.speed.x;
	var speedZ = this.speed.z;
	
	var cosAngle = cos(this.angle * 3.14 / 180);
	var sinAngle = sin(this.angle * 3.14 / 180);

	var posX = this.position.x;
	var posZ = this.position.z;
	
	// update position
	this.position.x = posX + speedX * cosAngle * timeStep;
	this.position.z = posZ + speedZ * -sinAngle * timeStep;
	
	// update rotation angle
	this.rotationAngle = this.rotationAngle + speed[0] * 0.04;
	this.rotationAngle = this.rotationAngle % 360;
	
	this.updateHitbox();
}

Orange.prototype.increaseSpeed = function() {
	this.speed.x += 20;
	this.speed.z += 20;

	if (this.speed.x > 400)
		this.speed.x = 400;
	if (this.speed.z > 400)
		this.speed.z = 400;
}

Orange.prototype.updateCenter = function() {
	this.center = vec3.fromValues(this.minCorner.x + (this.maxCorner.x - this.minCorner.x) / 2,
							this.minCorner.y + (this.maxCorner.y - this.minCorner.y) / 2,
							this.minCorner.z + (this.maxCorner.z - this.minCorner.z) / 2);
}

Orange.prototype.updateHitbox = function() {
	this.minCorner = vec3.fromValues(this.position.x - this.radius,
								this.position.y - this.radius + 30,
								this.position.z - this.radius);
	this.maxCorner = vec3.fromValues(this.position.x + this.radius,
								this.position.y + this.radius + 30,
								this.position.z + this.radius);
}