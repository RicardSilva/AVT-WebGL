
const MAX_LIGHTS = 9;
const ATTRIBS_PER_LIGHT = 11;


function Shader (vsShader, fsShader) {
    this.program = initShader(vsShader, fsShader);

    this.vertexPositionAttribute;
    this.vertexNormalAttribute;
    this.textureCoordAttribute;

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


Shader.prototype.initAttributes() {
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "inPosition");
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexNormalAttribute = gl.getAttribLocation(this.program, "inNormal");
    gl.enableVertexAttribArray(this.vertexNormalAttribute);

    this.textureCoordAttribute = gl.getAttribLocation(this.program, "inTexCoord");
    gl.enableVertexAttribArray(this.textureCoordAttribute);
}

Shader.prototype.getUniformLocations() {

    this.projViewModelID =  gl.getUniformLocation(this.program, "m_pvm");
    this.viewModelID = gl.getUniformLocation(this.program, "m_viewModel");
    this.normalID = gl.getUniformLocation(this.program, "m_normal");

    this.matAmbientID = gl.getUniformLocation(this.program, "mat.ambient");
    this.matDiffuseID = gl.getUniformLocation(this.program, "mat.diffuse");
    this.matSpecularID = gl.getUniformLocation(this.program, "mat.specular");
    this.matShininessID = gl.getUniformLocation(this.program, "mat.shininess");
    this.matTransparencyID = gl.getUniformLocation(this.program, "mat.transparency");
    
    this. useTexturesID = gl.getUniformLocation(this.program, "useTextures");
    this. textureModeID = gl.getUniformLocation(this.program, "textureMode");
    this. woodDiffuseID = gl.getUniformLocation(this.program, "woodDiffuse");
    this.woodSpecularID = gl.getUniformLocation(this.program, "woodSpecular");
    this. bambooDiffuseID = gl.getUniformLocation(this.program, "bambooDiffuse");
    this. bambooSpecularID = gl.getUniformLocation(this.program, "bambooSpecular");
    this. maskID = gl.getUniformLocation(this.program, "mask");
    this. treeID = gl.getUniformLocation(this.program, "billboardTexture");
    this. foggyID = gl.getUniformLocation(this.program, "foggy");

    var uniformName;
    for (i = 0; i < MAX_LIGHTS; i++) {
        for (j = 0; j < ATTRIBS_PER_LIGHT; j++) {
            uniformName = "lights[" + i + "]." + lightAttribNames[j];
            lightUniforms[i * ATTRIBS_PER_LIGHT + j] = gl.getUniformLocation(this.program, uniformName);
        }        

    }
}

Shader.prototype.use() {
     gl.useProgram(this.program);
}
Shader.prototype.unUse() {
    gl.useProgram(0);
}


Shader.prototype.loadFoggy(value) {
   gl.uniform1i(this.foggyID, value);
}
Shader.prototype.loadProjViewModelMatrix(matrix) {
    gl.uniformMatrix4fv(this.projViewModelID, false, matrix);
}
Shader.prototype.loadViewModelMatrix(matrix) {
    gl.uniformMatrix4fv(this.viewModelID, false, matrix);
}
Shader.prototype.loadNormalMatrix(matrix) {
    gl.uniformMatrix3fv(this.normalID, false, matrix);
}
Shader.prototype.loadMaterial(material) {
    gl.uniform3fv(this.matAmbientID, material.Ka);
    gl.uniform3fv(this.matDiffuseID, material.Kd);
    gl.uniform3fv(this.matSpecularID, material.Ks);
    gl.uniform1f(this.matShininessID, material.Ns);
    gl.uniform1f(this.matTransparencyID, material.d);
}
Shader.prototype.loadDirectionalLight(light) {
    var lightDir;
    multMatrixPoint(VIEW, light.direction, lightDir);
    var lightId = light.id;
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 1], light.type);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
    gl.uniform3fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 4], light.color);
    gl.uniform1f(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT * 5], light.intensity);
}
Shader.prototype.subLoadDirectionalLight(light) {
    var lightDir;
    multMatrixPoint(VIEW, light.direction, lightDir);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniformslightId * ATTRIBS_PER_LIGHT + 3], lightDir);
}
Shader.prototype.loadPointLight(light) {
    var lightPos;
    multMatrixPoint(VIEW, light.position, lightPos);
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
Shader.prototype.subLoadPointLight(light) {
    var lightPos;
    multMatrixPoint(VIEW, light.position, lightPos);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
}
Shader.prototype.loadSpotLight(light) {
    var lightPos;
    var lightDir;
    multMatrixPoint(VIEW, light.position, lightPos);    
    multMatrixPoint(VIEW, light.direction, lightDir);
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
Shader.prototype.subLoadSpotLight(light) {
    var lightPos;
    var lightDir;
    multMatrixPoint(VIEW, light.position, lightPos);    
    multMatrixPoint(VIEW, light.direction, lightDir);
    var lightId = light.id;

    gl.uniform1i(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 0], light.isActive);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 2], lightPos);
    gl.uniform4fv(this.lightUniforms[lightId * ATTRIBS_PER_LIGHT + 3], lightDir);
}
Shader.prototype.enableTextures() {
    gl.uniform1i(this.useTexturesID, true);
}
Shader.prototype.disableTextures() {
    gl.uniform1i(this.useTexturesID, false);
}
Shader.prototype.loadTextureMode(mode) {
     gl.uniform1i(this.textureModeID, mode);
}
Shader.prototype.loadWoodDiffuse(id) {
     gl.uniform1i(this.woodDiffuseID, id);
}
Shader.prototype.loadWoodSpecular(id) {
     gl.uniform1i(this.woodSpecularID, id);
}
Shader.prototype.loadBambooDiffuse(id) {
     gl.uniform1i(this.bambooDiffuseID, id);
}
Shader.prototype.loadBambooSpecular(id) {
     gl.uniform1i(this.bambooSpecularID, id);
}
Shader.prototype.loadMask(id) {
     gl.uniform1i(this.maskID, id);
}
Shader.prototype.loadTree(id) {
     gl.uniform1i(this.treeID, id);
}

Shader.prototype.loadMatrices() {
    computeMatrices();
    this.loadProjViewModelMatrix(projModelViewMatrix);
    this.loadViewModelMatrix(modelViewMatrix);
    this.loadNormalMatrix(computeNormal3x3());
}


function initShader(vsShader, fsShader) {

    // var vertexShader = getShader(gl, "shader-vs");
    //var fragmentShader = getShader(gl, "shader-fs");

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
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}