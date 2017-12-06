var lightCounter = 0;
var lightType = { DIRECTIONAL: 0, 
				POINT: 1,
				SPOT: 2 
};

function Light(shader) {
	this.shader = shader;
	this.id = lightCounter++;
	this.isActive = true;
	this.type;

	this.position;
	this.direction;
	this.color;
	this.intensity;

	this.constantAttenuation;
	this.linearAttenuation;
	this.quadraticAttenuation;

	this.spotCosCutoff;
	this.spotExponent;
}

DirectionalLight.prototype = Object.create(Light.prototype);
function DirectionalLight(direction, color, intensity, shader) {
	Light.call(this, shader);

	this.type = lightType.DIRECTIONAL;
	this.direction = direction;
	this.color = color;
	this.intensity = intensity;
	this.shader.use();
	this.shader.loadDirectionalLight(this);

}
DirectionalLight.prototype.draw = function() {
	this.shader.subLoadDirectionalLight(this);
}

PointLight.prototype = Object.create(Light.prototype);
function PointLight(position, color, intensity, shader) {
	Light.call(this, shader);

	this.type = lightType.POINT;
	this.position = position;
	this.color = color;
	this.intensity = intensity;

	this.constantAttenuation = 0.5;
	this.linearAttenuation = 0.001;
	this.quadraticAttenuation = 0.00001;

	this.shader.use();
	this.shader.loadPointLight(this);

}
PointLight.prototype.draw = function() {
	this.shader.subLoadPointLight(this);
}

SpotLight.prototype = Object.create(Light.prototype);
function SpotLight(position, direction, color, intensity, shader) {
	Light.call(this, shader);

	this.type = lightType.SPOT;
	this.position = position;
	this.direction = direction
	this.color = color;
	this.intensity = intensity;

	this.constantAttenuation = 0.5;
	this.linearAttenuation = 0.001;
	this.quadraticAttenuation = 0.0001;
	this.spotCosCutoff = 0.9;
	this.spotExponent = 4;
	this.isActive = false;

	this.shader.use();
	this.shader.loadSpotLight(this);

}
SpotLight.prototype.draw = function() {
	this.shader.subLoadSpotLight(this);
}