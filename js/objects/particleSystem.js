function ParticleSystem(shader) {
	this.max_particles = 500;
	
	this.particles = [];
	
	for (var i = 0; i < this.max_particles; i++) {
		this.particles.push(new Particle());
	}
	
	//model
	this.model = models.particle;
	this.shader = shader;
}

ParticleSystem.prototype.draw = function() {
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textures[1]);
	
	gl.disable(gl.DEPTH_TEST); 
	gl.disable(gl.CULL_FACE);
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	
	
	this.shader.loadTextureMode(1);
	this.shader.loadTexture(1);
	this.shader.loadMatDiffuse(this.particles[0].color);
	var partPosition;
	for (var i = 0; i < this.max_particles; i++){	
		gameManager.matrices.pushMatrix(modelID);
		
		partPosition = [this.particles[i].x, this.particles[i].y, this.particles[i].z];
		mat4.translate(modelMatrix, modelMatrix, partPosition);
		this.shader.loadMatrices();

	
		this.model.meshes[0].draw(this.shader);
		this.model.meshes[1].draw(this.shader);
		this.model.meshes[2].draw(this.shader);
		
			
		gameManager.matrices.popMatrix(modelID);
	}
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	//shader->unUse();
}

ParticleSystem.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;	// convert ms to seconds

	for (var i = 0; i < this.max_particles; i++){
		//this.particles[i].x += (timeStep*this.particles[i].vx);
		this.particles[i].y += (timeStep*this.particles[i].vy);
		//this.particles[i].z += (timeStep*this.particles[i].vz);
		//this.particles[i].vx += (timeStep*this.particles[i].ax);
		this.particles[i].vy += (timeStep*this.particles[i].ay);
		//this.particles[i].vz += (timeStep*this.particles[i].az);
		if (this.particles[i].y <= -1)
			this.particles[i].reset();
	}
}