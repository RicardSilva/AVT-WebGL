function Flare(shader) {
	this.flare_elements = 5;
	this.alphas = [1.5, 1.6, 1.8, 1.3, 1.6];
	this.sizes = [0.2, 0.3, 0.1, 0.2, 0.3];
	this.colors = [vec4.create(1,1,1,1),
				vec4.create(1,1,1,1),
				vec4.create(1,1,1,1),
				vec4.create(1,1,1,1),
				vec4.create(1,1,1,1)];
	
	//model
	this.model = new ObjModel();
	this.model.loadFromFile(this.model, "../resources/objModels/flare.txt");
	this.shader = shader;
}

Flare.prototype.draw = function() {
	
}