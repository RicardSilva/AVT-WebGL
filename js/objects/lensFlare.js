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
	this.model = models.flare;
	this.shader = shader;
}

Flare.prototype.draw = function(sunPosition) {
	
	var sunCoords = convertWorldToScreen(sunPosition);

	gameManager.matrices.pushMatrix(projectionID);
    mat4.identity(projectionMatrix);
	gameManager.matrices.pushMatrix(viewID);	
	mat4.identity(viewMatrix);

	if (sunCoords == null) {
		gameManager.matrices.popMatrix(projectionID);
		gameManager.matrices.popMatrix(viewID);
		return;
	}
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);

	
	var center = vec2.fromValues(0.5, 0.5);

	var maxFlareDist = Math.sqrt(center[0] * center[0] + center[1] * center[1]);
	var flareDist = Math.sqrt((sunCoords[0] - center[0]) * (sunCoords[0] - center[0])
	                      + (sunCoords[1] - center[1]) * (sunCoords[1] - center[1]));

	var distanceScale = (maxFlareDist - flareDist) / maxFlareDist;

	var dx = center[0] + (center[0] - sunCoords[0]);
	var dy = center[1] + (center[1] - sunCoords[1]);

	var elementDist;
	var px, py;
	var width, height;
	var alpha;
	for (var i = 0; i < this.flare_elements; i++) {
		elementDist =- 6 + i * 3.0;
		px = (1 - elementDist) * sunCoords[0] + elementDist * dx;
		py = (1 - elementDist) * sunCoords[1] + elementDist * dy;
	
		width = this.sizes[i] * distanceScale;

		if (width > 5)
			width = 5; 

		height = width * gl.canvas.clientWidth / gl.canvas.clientHeight;
	
		alpha = this.alphas[i] * distanceScale;

		gl.activeTexture(gl.TEXTURE2 + i);
		gl.bindTexture(gl.TEXTURE_2D, textures[2 + i]);

		this.shader.enableTextures();
		this.shader.loadTextureMode(5);
		this.shader.loadTree(2+i);
		var color = this.colors[i];
		color.w = alpha;
		//this.shader.loadMatDiffuse(color);
	
		gameManager.matrices.pushMatrix(modelID);
		
		mat4.scale(modelMatrix, modelMatrix, [width, height, 1]);
		mat4.translate(modelMatrix, modelMatrix, [-px, py, 1]);
		this.shader.loadMatrices();

		this.model.meshes[0].draw(this.shader);

		gameManager.matrices.popMatrix(modelID);
	}
	this.shader.disableTextures();
	gl.bindTexture(gl.TEXTURE_2D, null);
	gameManager.matrices.popMatrix(viewID);
	gameManager.matrices.popMatrix(projectionID);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
}