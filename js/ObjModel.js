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
	this.tangents = [];

	this.indices = [];

	this.material;

	this.VertexPositionBuffer;
	this.VertexTextureCoordBuffer;
	this.VertexNormalBuffer;
	this.VertexTangentBuffer;
	this.VertexIndexBuffer;

}

Mesh.prototype.init = function(){
	this.buildTangents();
	this.buildBuffers();
}

Mesh.prototype.buildTangents = function() {
	var vertexCount = this.positions.length / 4;
	var tan1 = [];
	var tan2 = [];

	for (var a = 0; a < vertexCount; a+=3) {

		var v1 = [this.positions[a * 4], this.positions[a * 4+1], this.positions[a * 4+2]];
		var v2 = [this.positions[a * 4+4], this.positions[a * 4+5], this.positions[a * 4+6]];
		var v3 = [this.positions[a * 4+8], this.positions[a * 4+9], this.positions[a * 4+10]];

		var w1 = [this.textCoords[a * 2], this.textCoords[a * 2 + 1]];
		var w2 = [this.textCoords[a * 2 + 2], this.textCoords[a * 2 + 3]];
		var w3 = [this.textCoords[a * 2 + 4], this.textCoords[a * 2 + 5]];


		var x1 = v2[0] - v1[0];
		var x2 = v3[0] - v1[0];
		var y1 = v2[1] - v1[1];
		var y2 = v3[1] - v1[1];
		var z1 = v2[2] - v1[2];
		var z2 = v3[2] - v1[2];

		var s1 = w2[0] - w1[0];
		var s2 = w3[0] - w1[0];
		var t1 = w2[1] - w1[1];
		var t2 = w3[1] - w1[1];

		var r = 1.0 / (s1 * t2 - s2 * t1);
		var sdir = [(t2 * x1 - t1 * x2) * r, 
					(t2 * y1 - t1 * y2) * r,
		 			(t2 * z1 - t1 * z2) * r];
		var tdir = [(s1 * x2 - s2 * x1) * r, 
					(s1 * y2 - s2 * y1) * r,
		 			(s1 * z2 - s2 * z1) * r];

		tan1.push(sdir[0]); tan1.push(sdir[1]); tan1.push(sdir[2]);
		tan1.push(sdir[0]); tan1.push(sdir[1]); tan1.push(sdir[2]);
		tan1.push(sdir[0]); tan1.push(sdir[1]); tan1.push(sdir[2]);

		tan2.push(tdir[0]); tan2.push(tdir[1]); tan2.push(tdir[2]);
		tan2.push(tdir[0]); tan2.push(tdir[1]); tan2.push(tdir[2]);
		tan2.push(tdir[0]); tan2.push(tdir[1]); tan2.push(tdir[2]);
	
	 }

	 for (var a = 0; a < vertexCount * 3; a+=3)
	 {
		 var n = [this.normals[a], this.normals[a+1], this.normals[a+2]];
		 var t = [tan1[a], tan1[a+1], tan1[a+2]];

		 // Gram-Schmidt orthogonalize
		 var tanX = t[0] - n[0] * innerProduct(n, t);
		 var tanY = t[1] - n[1] * innerProduct(n, t);
		 var tanZ = t[2] - n[2] * innerProduct(n, t);
		 var norm = Math.sqrt(tanX * tanX + tanY * tanY + tanZ * tanZ);
		 this.tangents.push(tanX / norm);
		 this.tangents.push(tanY / norm);
		 this.tangents.push(tanZ / norm);

		 // Calculate handedness
		 this.tangents.push((innerProduct(crossProduct(n, t), tan2[a]) < 0.0) ? -1.0 : 1.0);
	 }

}

Mesh.prototype.buildBuffers = function() {
	this.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    this.VertexPositionBuffer.numItems = this.positions.length / 4;

    this.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    this.VertexNormalBuffer.numItems = this.normals.length / 3;

    this.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW);
    this.VertexTextureCoordBuffer.numItems = this.textCoords.length / 2;

    this.VertexTangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);
    this.VertexTangentBuffer.numItems = this.tangents.length / 4;
    

    this.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.VertexIndexBuffer.numItems = this.indices.length;
}

Mesh.prototype.draw = function(shader) {
	gl.enableVertexAttribArray(shader.vertexPositionAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

 	
 	gl.enableVertexAttribArray(shader.textureCoordAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    
	gl.enableVertexAttribArray(shader.vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(shader.vertexTangentAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTangentBuffer);
    gl.vertexAttribPointer(shader.vertexTangentAttribute, 4, gl.FLOAT, false, 0, 0);

    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
   // gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
   
   
    
    gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
}


function ObjModel () {

	this.meshes = [];

}


ObjModel.prototype.loadFromFile = function(objModel, data)
{
	
   
	var currentMesh = new Mesh();
	var currentMaterial = new Material();
	var lines = data.split('\n');
	for(var counter = 0; counter < lines.length; counter++){
     	var line = lines[counter];
      	var tokens = line.split(' ');
      	if(tokens[0].trim() == "newmesh") {
      		currentMesh = new Mesh();
      	}
     	else if (tokens[0].trim() == "p") {
	      	currentMesh.positions.push(Number(tokens[1]));
	      	currentMesh.positions.push(Number(tokens[2]));
	      	currentMesh.positions.push(Number(tokens[3]));
	      	currentMesh.positions.push(Number(tokens[4]));
      	}
	    else if (tokens[0].trim() == "n") {
	      	currentMesh.normals.push(Number(tokens[1]));
	      	currentMesh.normals.push(Number(tokens[2]));
	      	currentMesh.normals.push(Number(tokens[3]));
	    }
	    else if (tokens[0].trim() == "t") {
	      	currentMesh.textCoords.push(Number(tokens[1]));				      	
	      	currentMesh.textCoords.push(Number(tokens[2]));
	    }
	    else if (tokens[0].trim() == "i") {
	      	currentMesh.indices.push(Number(tokens[1]));
	    }
	    else if (tokens[0].trim() == "endmesh") {
	    	currentMesh.init();
	    	objModel.meshes.push(currentMesh);
	    }
	    else if(tokens[0].trim() == "newmaterial") {
	    	currentMaterial = new Material();
	    }
	    else if(tokens[0].trim() == "ka") {
	    	var ka = [];

	      	ka.push(Number(tokens[1]));
	      	ka.push(Number(tokens[2]));
	      	ka.push(Number(tokens[3]));

	    	currentMaterial.Ka = ka;
	    }
	    else if(tokens[0].trim() == "kd") {
	    	var kd = [];
	      	kd.push(Number(tokens[1]));
	      	kd.push(Number(tokens[2]));
	      	kd.push(Number(tokens[3]));
	    	currentMaterial.Kd = kd;
	    }
	    else if(tokens[0].trim() == "ks") {
	    	var ks = [];
	      	ks.push(Number(tokens[1]));
	      	ks.push(Number(tokens[2]));
	      	ks.push(Number(tokens[3]));
	    	currentMaterial.Ks = ks;
	    }
	    else if(tokens[0].trim() == "ns") {
	    	currentMaterial.Ns = Number(tokens[1]);
	    }
	    else if(tokens[0].trim() == "d") {
	    	currentMaterial.d = Number(tokens[1]);
	    }
	    else if(tokens[0].trim() == "endmaterial") {
	    	currentMesh.material = currentMaterial;
	    }

			    
    }
}




