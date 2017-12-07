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
	/*var screenWidth = glutGet(GLUT_WINDOW_WIDTH);
	var screenHeight = glutGet(GLUT_WINDOW_HEIGHT);*/
	
	//var sunCoords = camera.convertWorldToScreenSpace(sunPosition);
	
	gameManager.matrices.pushMatrix(projectID);
	//loadIdentity(projectID);
	gameManager.matrices.pushMatrix(viewID);
	//loadIdentity(viewID);
	
	if (sunCoords[0] < 0 || sunCoords[0] > 1 || sunCoords[1] < 0 || sunCoords[1] > 1) {
		gameManager.matrices.popMatrix(projectID);
		gameManager.matrices.popMatrix(viewID);
		return;
	}
	
	/*shader->use();
	glDisable(GL_DEPTH_TEST);
	glDisable(GL_CULL_FACE);*/
	
	var center = vec2.fromValues(0.5, 0.5);
	//loadIdentity(viewID);
	var maxFlareDist = Math.sqrt(center[0] * center[0] + center[1] * center[1]);
	var flareDist = Math.sqrt((sunCoords[0] - center[0]) * (sunCoords[0] - center[0])
	                      + (sunCoords[1] - center[1]) * (sunCoords[1] - center[1]));

	var distanceScale = (maxFlareDist - flareDist) / maxFlareDist;

	var dx = center[0] + (center[0] - sunCoords[0]);
	var dy = center[1] + (center[1] - sunCoords[1]);
	
	var elementDist = 0;
	var px = 0;
	var py = 0;
	var width = 0;
	var height = 0;

	for (var i = 0; i < this.flare_elements; i++) {
		elementDist =- 6 + i * 3;
		px = (1 - elementDist) * sunCoords.x + elementDist * dx;
		py = (1 - elementDist) * sunCoords.y + elementDist * dy;
	
		width = this.sizes[i] * distanceScale;

		if (width > 5)
			width = 5; 

		//height = width *glutGet(GLUT_WINDOW_WIDTH) / glutGet(GLUT_WINDOW_HEIGHT);
	
		alpha = this.alphas[i] * distanceScale;

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, textures[i+2]);

		this.shader.loadTextureMode(2);
		this.shader.loadTexture(i+2);
		var color = vec4.fromValues(colors[i][0], colors[i][1], colors[i][2], alpha);
		this.shader.loadMatDiffuse(color);
	
		gameManager.matrices.pushMatrix(modelID);
		
		mat4.translate(modelMatrix, modelMatrix, [width, height, 1]);
		mat4.scale(modelMatrix, modelMatrix, [-px, py, 1]);
		this.shader.loadMatrices();

		var arrayLength = this.model.meshes.length;
		for (var i = 0; i < arrayLength; i++) {
			this.model.meshes[i].draw(this.shader);
		}

		gameManager.matrices.popMatrix(modelID);
	}
	
	gameManager.matrices.popMatrix(projectID);
	gameManager.matrices.popMatrix(viewID);
	/*glEnable(GL_DEPTH_TEST);
	glEnable(GL_CULL_FACE);
	glCullFace(GL_BACK);*/
	//shader->unUse();
}