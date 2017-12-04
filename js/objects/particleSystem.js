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
	
}

ParticleSystem.prototype.update = function() {
	
}