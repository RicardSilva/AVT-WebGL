function ParticleSystem(shader) {
	this.max_particles = 1000;
	
	this.particles = [];
	
	for (var i = 0; i < this.max_particles; i++) {
			this.particles.push(new Particle());
	}
	
	//model
	this.model = new ObjModel();
	this.model.loadFromFile(this.model, "../resources/objModels/particle.txt");
	this.shader = shader;
}

ParticleSystem.prototype.draw = function() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures[1]);
	
	/*glDisable(GL_DEPTH_TEST); 
	glDisable(GL_CULL_FACE);*/
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	
	//shader->use();
	this.shader.loadTextureMode(1);
	this.shader.loadTexture(1);
	//shader->loadMatDiffuse(particles[0].color);
	
	for (var i = 0; i < this.max_particles; i++){	
		gameManager.matrices.pushMatrix(modelID);
		
		var partPosition = [this.particles[i].x, this.particles[i].y, this.particles[i].z];
		mat4.translate(modelMatrix, modelMatrix, partPosition);
		this.shader.loadMatrices();

		var arrayLength = this.model.meshes.length;
		for (var i = 0; i < arrayLength; i++) {
			this.model.meshes[i].draw(this.shader);
		}
			
		gameManager.matrices.popMatrix(modelID);
	}
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	/*glEnable(GL_DEPTH_TEST);
	glEnable(GL_CULL_FACE);*/
	gl.bindTexture(gl.TEXTURE_2D, 0);
	//shader->unUse();
}

ParticleSystem.prototype.update = function(timeStep) {
	timeStep = timeStep / 1000;	// convert ms to seconds

	for (var i = 0; i < this.max_particles; i++){
		this.particles[i].x += (timeStep*this.particles[i].vx);
		this.particles[i].y += (timeStep*this.particles[i].vy);
		this.particles[i].z += (timeStep*this.particles[i].vz);
		this.particles[i].vx += (timeStep*this.particles[i].ax);
		this.particles[i].vy += (timeStep*this.particles[i].ay);
		this.particles[i].vz += (timeStep*this.particles[i].az);
		if (this.particles[i].y <= -1)
			this.particles[i].reset();
	}
}