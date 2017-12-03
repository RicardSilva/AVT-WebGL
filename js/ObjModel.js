function ObjModel (path) {

	this.meshes = [];

}

ObjModel.prototype.loadFromFile = function(filePath) {
	var reader = new FileReader();

	reader.onload = function(e) {
		var lines = reader.result.split('\n');
		for(var line = 0; line < lines.length; line++){
	      console.log(lines[line]);
	    }
	}

	reader.readAsText(file);





}

function Material() {

	this.Ka = [];
	this.Kd = [];
	this.Ks = [];
	this.Ns = 0;
	this.d = 0;
}

function Mesh() {
	this.positions = [];
	this.normals = [];
	this.textCoords = [];
	this.indices = [];

	this.material;

	this.VertexPositionBuffer;
	this.VertexTextureCoordBuffer;
	this.VertexNormalBuffer;
	this.VertexIndexBuffer;

}

Mesh.prototype.buildBuffers = function() {
	this.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    this.VertexPositionBuffer.itemSize = 4;
    this.VertexPositionBuffer.numItems = this.positions.length;

    this.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    this.VertexNormalBuffer.itemSize = 3;
    this.VertexNormalBuffer.numItems = this.normals.length;

    this.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW);
    this.VertexTextureCoordBuffer.itemSize = 2;
    this.VertexTextureCoordBuffer.numItems = this.normals.length;
    

    this.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.VertexIndexBuffer.itemSize = 1;
    this.VertexIndexBuffer.numItems = this.indices.length;
}

Mesh.prototype.draw = function(shader) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureBuffer);
    gl.vertexAttribPointer(shader.textureCoordAttribute, this.VertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    gl.vertexAttribPointer(shader.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}