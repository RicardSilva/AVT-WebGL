function Lamp(position, shader) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	
	this.inercia = 370;
	
	this.light = new PointLight([this.position[0], this.position[1] + 35,
					 this.position[2], 1], [0.5, 0.5, 0.3], 0.8, shader);
	
	this.width = 7.8;
	this.height = 37;
	this.length = 7.8;

	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = models.lamp;
	this.shader = shader;

	this.updateHitbox();
}


Lamp.prototype.draw = function() {
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	
	this.shader.loadMatrices();

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial(this.model.meshes[i].material);
		this.model.meshes[i].draw(this.shader);
	}

	gameManager.matrices.popMatrix(modelID);
}

Lamp.prototype.drawLights = function() {
	this.light.draw();
}

Lamp.prototype.update = function(timeStep) {}


Lamp.prototype.toggleLight = function() {
	if (this.light.isActive) {
		this.light.isActive = false;
	}
	else {
		this.light.isActive = true;
	}
}


Lamp.prototype.updateHitbox = function() {
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