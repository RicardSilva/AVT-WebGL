function FinishLine(position, width, length, shader) {
	this.position = position;
	
	this.width = width;
	this.length = length;
	
	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	//model
	this.model = models.finishline;
	this.shader = shader;
	
	this.updateHitbox();
}

FinishLine.prototype.draw = function() {
	gameManager.matrices.pushMatrix(modelID);
	//loadIdentity(MODEL);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	//glDisable(GL_DEPTH_TEST);

	this.shader.loadMatrices();

	this.shader.enableTextures();
	this.shader.loadTextureMode(2);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures[12]);

	this.shader.loadTree(1);
	this.shader.loadMatDiffuse(vec4.fromValues(1, 1, 1, 1));
	
	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.model.meshes[i].draw(this.shader);
	}

	this.shader.disableTextures();
	gl.bindTexture(gl.TEXTURE_2D, null);

	//glEnable(GL_DEPTH_TEST);

	gameManager.matrices.popMatrix(modelID);
}

FinishLine.prototype.updateHitbox = function() {
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