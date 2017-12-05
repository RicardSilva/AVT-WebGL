function Billboard(position, shader) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	this.isActive = true;
	
	//model
	this.model = new ObjModel();
	this.model.loadFromFile(this.model, "../resources/objModels/billboard.txt");
	this.shader = shader;
}

Billboard.prototype.draw = function(cam) {
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.scale(modelMatrix, modelMatrix, [3.5, 3.5, 3.5]);
	
	var pos = [position[0] , position[1], position[2]];
	var camPos = [cam[0] , cam[1], cam[2]];
	
	this.l3dBillboardCylindricalBegin(camPos, pos);
	
	this.shader.loadMatrices();
	
	this.shader.enableTextures();
	this.shader.loadTextureMode(1);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures[0]);
	
	this.shader.loadTree(0);
	//this.shader.loadMatDiffuse(vec4.fromValues(0, 0.2, 0, 1));
	
	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.model.meshes[i].draw(this.shader);
	}
	
	this.shader.disableTextures();
	gl.bindTexture(gl.TEXTURE_2D, 0);

	gameManager.matrices.popMatrix(modelID);
}

Billboard.prototype.mathsInnerProduct = function(v, q) {
	return v[0]*q[0] + v[1]*q[1] + v[2]*q[2]
}

Billboard.prototype.mathsCrossProduct = function(a, b) {
	var prod = [0, 0, 0];
	prod[0] = a[1]*b[2] - b[1]*a[2];
	prod[1] = a[2]*b[0] - b[2]*a[0];
	prod[2] = a[0]*b[1] - b[0]*a[1];
	
	return prod;
}

Billboard.prototype.mathsNormalize = function(v) {
	var d = (sqrt((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2])));
	v[0] = v[0] / d;
	v[1] = v[1] / d;
	v[2] = v[2] / d;
	
	return v;
}

Billboard.prototype.l3dBillboardCylindricalBegin = function(cam, worldPos) {
	var lookAt = [0, 0, 1];
	
	var objToCamProj = [0, 0, 0];
	objToCamProj[0] = cam[0] - worldPos[0];
	objToCamProj[1] = 0;
	objToCamProj[2] = cam[2] - worldPos[2];
	
	mathsNormalize(objToCamProj);
	
	var upAux = mathsCrossProduct(lookAt, objToCamProj);
	
	var angleCosine = mathsInnerProduct(lookAt, objToCamProj);
	
	if ((angleCosine < 0.99990) && (angleCosine > -0.9999))
		mat4.rotate(modelMatrix, modelMatrix, acos(angleCosine) * 180 / 3.14, upAux);
}