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
    this.VertexPositionBuffer.numItems = this.positions.length / 4;

    this.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    this.VertexNormalBuffer.numItems = this.normals.length / 3;

    this.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW);
    this.VertexTextureCoordBuffer.numItems = this.textCoords.length / 2;
    

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
   
   
    
    //gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
}


function ObjModel () {

	this.meshes = [];

}

ObjModel.prototype.loadFromFile = function(filePath) {
	var reader = new FileReader();
	var currentMesh;
	var currentMaterial;
	reader.onload = function(e) {
		var lines = reader.result.split('\n');
		for(var counter = 0; counter < lines.length; counter++){
	     	var line = lines[counter];
	      	var tokens = line.split(" ");
	      	alert(token);
	      	if(tokens[0] == "newmesh") {
	      		currentMesh = new Mesh();
	      	}
	     	else if (tokens[0] == "p") {
		      	var position = [];
		      	position.push(Number(tokens[1]));
		      	position.push(Number(tokens[2]));
		      	position.push(Number(tokens[3]));
		      	position.push(Number(tokens[4]));
		      	currentMesh.positions.push(position);
	      	}
		    else if (tokens[0] == "n") {
		    	var normal = [];
		      	normal.push(Number(tokens[1]));
		      	normal.push(Number(tokens[2]));
		      	normal.push(Number(tokens[3]));
		      	currentMesh.normals.push(normal);
		    }
		    else if (tokens[0] == "t") {
		      	var texC = [];
		      	texC.push(Number(tokens[1]));
		      	texC.push(Number(tokens[2]));
		      	currentMesh.textCoords.push(texC);
		    }
		    else if (tokens[0] == "i") {
		      	currentMesh.indices.push(Number(tokens[1]));
		    }
		    else if (tokens[0] == "endmesh") {
		    	this.meshes.push(currentMesh);
		    }
		    else if(tokens[0] == "newmaterial") {
		    	currentMaterial = new Material();
		    }
		    else if(tokens[0] == "ka") {
		    	var ka = [];
		      	ka.push(Number(tokens[1]));
		      	ka.push(Number(tokens[2]));
		      	ka.push(Number(tokens[3]));
		    	currentMaterial.Ka = ka;
		    }
		    else if(tokens[0] == "kd") {
		    	var kd = [];
		      	kd.push(Number(tokens[1]));
		      	kd.push(Number(tokens[2]));
		      	kd.push(Number(tokens[3]));
		    	currentMaterial.Kd = kd;
		    }
		    else if(tokens[0] == "ks") {
		    	var ks = [];
		      	ks.push(Number(tokens[1]));
		      	ks.push(Number(tokens[2]));
		      	ks.push(Number(tokens[3]));
		    	currentMaterial.Ks = ks;
		    }
		    else if(tokens[0] == "ns") {
		    	currentMaterial.Ns = Number(tokens[1]);
		    }
		    else if(tokens[0] == "d") {
		    	currentMaterial.d = Number(tokens[1]);
		    }
		    else if(tokens[0] == "endmaterial") {
		    	currentMesh.material = currentMaterial;
		    }

	    }
	}
	alert(filePath);
	reader.readAsText(filePath);
}

ObjModel.prototype.readTextFile = function(objModel, file)
{
	
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
            	var currentMesh = new Mesh();
				var currentMaterial = new Material();
				var lines = rawFile.responseText.split('\n');
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
				    	currentMesh.buildBuffers();
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
        }
    }
    rawFile.send(null);
}




