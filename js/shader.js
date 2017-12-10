
const MAX_LIGHTS = 9;
const ATTRIBS_PER_LIGHT = 11;


function Shader (vsShader, fsShader) {
    this.program = initShader(vsShader, fsShader);

    this.vertexPositionAttribute;
    this.vertexNormalAttribute;
    this.textureCoordAttribute;
    this.vertexTangentAttribute;

    this.projViewModelID;
    this.viewModelID;
    this.normalID;
    
    this.matAmbientID;
    this.matDiffuseID;
    this.matSpecularID;
    this.matShininessID;
    this.matTransparencyID;

    this.useTexturesID;
    this.textureModeID;
	this.textureID;
	this.diffuseID;
    this.woodDiffuseID;
    this.woodSpecularID;
    this.bambooDiffuseID;
    this.bambooSpecularID;
    this.maskID;
    this.treeID;
    this.foggyID;
    this.lightUniforms = new Array(MAX_LIGHTS * ATTRIBS_PER_LIGHT);
    this.lightAttribNames = [ "isActive", "type", "position", "direction",
        "color", "intensity", "constantAttenuation", "linearAttenuation", 
        "quadraticAttenuation", "spotCosCutoff", "spotExponent" ];

    this.initAttributes();
    this.getUniformLocations();

}


Shader.prototype.initAttributes = function() {
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "inPosition");
    //gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexNormalAttribute = gl.getAttribLocation(this.program, "inNormal");
   // gl.enableVertexAttribArray(this.vertexNormalAttribute);

    this.textureCoordAttribute = gl.getAttribLocation(this.program, "inTexCoord");
    //gl.enableVertexAttribArray(this.textureCoordAttribute);

    this.vertexTangentAttribute = gl.getAttribLocation(this.program, "inTangent");
}

Shader.prototype.getUniformLocations = function() {

    this.projViewModelID =  gl.getUniformLocation(this.program, "m_pvm");
    this.viewModelID = gl.getUniformLocation(this.program, "m_viewModel");
    this.normalID = gl.getUniformLocation(this.program, "m_normal");

    this.matAmbientID = gl.getUniformLocation(this.program, "mat.ambient");
    this.matDiffuseID = gl.getUniformLocation(this.program, "mat.diffuse");
    this.matSpecularID = gl.getUniformLocation(this.program, "mat.specular");
    this.matShininessID = gl.getUniformLocation(this.program, "mat.shininess");
    this.matTransparencyID = gl.getUniformLocation(this.program, "mat.transparency");
    
    this.useTexturesID = gl.getUniformLocation(this.program, "useTextures");
    this.textureModeID = gl.getUniformLocation(this.program, "textureMode");
	this.textureID = gl.getUniformLocation(this.program, "textureMap");
	this.diffuseID = gl.getUniformLocation(this.program, "matDiffuse");
    this.woodDiffuseID = gl.getUniformLocation(this.program, "woodDiffuse");
    this.woodSpecularID = gl.getUniformLocation(this.program, "woodSpecular");
    this.bambooDiffuseID = gl.getUniformLocation(this.program, "bambooDiffuse");
    this.bambooSpecularID = gl.getUniformLocation(this.program, "bambooSpecular");
    this.maskID = gl.getUniformLocation(this.program, "mask");
    this.treeID = gl.getUniformLocation(this.program, "billboardTexture");
    this.foggyID = gl.getUniformLocation(this.program, "foggy");

    this.woodNormalID = gl.getUniformLocation(this.program, "woodNormal");
    this.bambooNormalID = gl.getUniformLocation(this.program, "bambooNormal");

    var uniformName;
    for (i = 0; i < MAX_LIGHTS; i++) {
        for (j = 0; j < ATTRIBS_PER_LIGHT; j++) {
            uniformName = "lights[" + i + "]." + this.lightAttribNames[j];
            this.lightUniforms[i * ATTRIBS_PER_LIGHT + j] = gl.getUniformLocation(this.program, uniformName);
        }        

    }
}

Shader.prototype.use = function() {
     gl.useProgram(this.program);
}
Shader.prototype.unUse = function() {
    gl.useProgram(0);
}

Shader.prototype.loadFoggy = function(value) {
    gl.uniform1i(this.foggyID, value);
}
Shader.prototype.loadProjViewModelMatrix = function(matrix) {
    gl.uniformMatrix4fv(this.projViewModelID, false, matrix);
}
Shader.prototype.loadViewModelMatrix = function(matrix) {
    gl.uniformMatrix4fv(this.viewModelID, false, matrix);
}
Shader.prototype.loadNormalMatrix = function(matrix) {
    gl.uniformMatrix3fv(this.normalID, false, matrix);
}
Shader.prototype.loadMaterial = function(material) {
    gl.uniform3fv(this.matAmbientID, material.Ka);
    gl.uniform3fv(this.matDiffuseID, material.Kd);
    gl.uniform3fv(this.matSpecularID, material.Ks);
    gl.uniform1f(this.matShininessID, material.Ns);
    gl.uniform1f(this.matTransparencyID, material.d);
}
Shader.prototype.loadDirectionalLight = function(light) {
    var lightDir = [];
    multMatrixPoint(viewMatrix, light.direction, lightDir);
    var lightId = light.id;
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 1], light.type);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
    gl.uniform3fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 4], light.color);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT * 5], light.intensity);
}
Shader.prototype.subLoadDirectionalLight = function(light) {
    var lightDir = [];
    multMatrixPoint(viewMatrix, light.direction, lightDir);
    var lightId = light.id;
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
}
Shader.prototype.loadPointLight = function(light) {
    var lightPos = [];
    multMatrixPoint(viewMatrix, light.position, lightPos);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 1], light.type);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
    gl.uniform3fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 4], light.color);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 5], light.intensity);

    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 6], light.constantAttenuation);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 7], light.linearAttenuation);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 8], light.quadraticAttenuation);

}
Shader.prototype.subLoadPointLight = function(light) {
    var lightPos = [];
    multMatrixPoint(viewMatrix, light.position, lightPos);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
}
Shader.prototype.loadSpotLight = function(light) {
    var lightPos = [];
    var lightDir = [];
    multMatrixPoint(viewMatrix, light.position, lightPos);    
    multMatrixPoint(viewMatrix, light.direction, lightDir);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 1], light.type);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
    gl.uniform3fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 4], light.color);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 5], light.intensity);

    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 6], light.constantAttenuation);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 7], light.linearAttenuation);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 8], light.quadraticAttenuation);

    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 9], light.spotCosCutoff);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 10], light.spotExponent);

}
Shader.prototype.subLoadSpotLight = function(light) {
    var lightPos = [];
    var lightDir = [];
    multMatrixPoint(viewMatrix, light.position, lightPos);    
    multMatrixPoint(viewMatrix, light.direction, lightDir);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
}
Shader.prototype.enableTextures = function() {
    gl.uniform1i(this.useTexturesID, true);
}
Shader.prototype.disableTextures = function() {
    gl.uniform1i(this.useTexturesID, false);
}
Shader.prototype.loadTextureMode = function(mode) {
    gl.uniform1i(this.textureModeID, mode);
}
Shader.prototype.loadTexture = function(id) {
	gl.uniform1i(this.textureID, id);
}
Shader.prototype.loadMatDiffuse = function(color) {
	gl.uniform4fv(this.diffuseID, color);
}
Shader.prototype.loadWoodDiffuse = function(id) {
     gl.uniform1i(this.woodDiffuseID, id);
}
Shader.prototype.loadWoodSpecular = function(id) {
     gl.uniform1i(this.woodSpecularID, id);
}
Shader.prototype.loadBambooDiffuse = function(id) {
     gl.uniform1i(this.bambooDiffuseID, id);
}
Shader.prototype.loadBambooSpecular = function(id) {
     gl.uniform1i(this.bambooSpecularID, id);
}
Shader.prototype.loadMask = function(id) {
     gl.uniform1i(this.maskID, id);
}
Shader.prototype.loadTree = function(id) {
     gl.uniform1i(this.treeID, id);
}

Shader.prototype.loadWoodNormal = function(id) {
     gl.uniform1i(this.woodNormalID, id);
}
Shader.prototype.loadBambooNormal = function(id) {
     gl.uniform1i(this.bambooNormalID, id);
}

Shader.prototype.loadMatrices = function() {
    computeMatrices();
    this.loadProjViewModelMatrix(projModelViewMatrix);
    this.loadViewModelMatrix(modelViewMatrix);
    this.loadNormalMatrix(computeNormal3x3());
}


function initShader(vsShader, fsShader) {

    var vertexShader = getShader(gl, vsShader);
    var fragmentShader = getShader(gl, fsShader);
    var shaderProgram;

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    return shaderProgram;
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(shaderScript.type + '\n' + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}