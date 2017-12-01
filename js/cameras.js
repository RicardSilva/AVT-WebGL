function Camera (near, far) {
	this.eye = vec3.create();
	this.target = vec3.create();
	this.up = vec3.create();

	this.near = near;
	this.far = far;
}

Camera.prototype.setEye = function(eye) { vec3.copy(this.eye, eye); }
Camera.prototype.setTarget = function(target) { vec3.copy(this.target, target); }
Camera.prototype.setUp = function(up) { vec3.copy(this.up, up); }

Camera.prototype.computeView = function() {
	mat4.identity(viewMatrix);
	mat4.lookAt(viewMatrix, this.eye, this.target, this.up);
}

Camera.prototype.computeCarCameraPosition = function(position, orientation) {
	var x = position[0]; // aim for the car's center of rotation
	var y = position[1];
	var z = position[2];

	copy(this.target, vec3.fromValues(x,y,z));

	x = x - (60 * cos(orientation * 3.14 / 180));
	y = y + 25;
	z = z - (60 * -sin(orientation * 3.14 / 180));

	copy(this.eye, vec3.fromValues(x,y,z));


}
Camera.prototype.computeCockpitCameraPosition = function(position, orientation) {

	var x = position[0] - (4.5 * cos(orientation * 3.14 / 180)); // camera inside car
	var y = position[1] + 10;
	var z = position[2] - (4.5 * -sin(orientation * 3.14 / 180));

	copy(this.eye, vec3.fromValues(x,y,z));

	x = x + (50 * cos(orientation * 3.14 / 180));
	y = y;
	z = z + (50 * -sin(orientation * 3.14 / 180));

	copy(this.target, vec3.fromValues(x,y,z));
}
Camera.prototype.computeBackCameraPosition = function(position, orientation) {
	
	var x = position[0] - (4.5 * cos(orientation * 3.14 / 180)); // camera inside car
	var y = position[1] + 10;
	var z = position[2] - (4.5 * -sin(orientation * 3.14 / 180));

	copy(this.eye, vec3.fromValues(x,y,z));

	x = x - (50 * cos(orientation * 3.14 / 180));
	y = y - 9;
	z = z - (50 * -sin(orientation * 3.14 / 180));

	copy(this.target, vec3.fromValues(x,y,z));
}

function convertWorldToScreen(worldPosition) {
	var coords = vec4.fromValues(worldPosition[0],
								 worldPosition[1],
								 worldPosition[2],
								 1.0);
	
	multMatrixPoint(VIEW, coords, coords);
	multMatrixPoint(PROJECTION, coords, coords);

	if (coords[3] <= 0)
		return vec2.fromValues(-1, -1);

	var x = (coords[0] / coords[3] + 1) / 2.0;
	var y = 1 - ((coords[1] / coords[3] + 1) / 2.0);


	return vec2.fromValues(x, y);



}
OrthoCamera.prototype = Object.create(Camera.prototype);
function OrthoCamera(right, left, bottom, top, near, far) {
	Camera.call(this, near, far);
	this.right  = right;
	this.left   = left;

	this.bottom = bottom;
	this.top    = top;

	this.near   = near;
	this.far    = far;
}
OrthoCamera.prototype.computeProjection = function() {
	mat4.identity(projectionMatrix);
	mat4.ortho(projectionMatrix, this.right, this.left, this.bottom, this.top, this.near, this.far);
}


PerspectiveCamera.prototype = Object.create(Camera.prototype);
function PerspectiveCamera(fov, ratio, near, far, position, direction) {
	Camera.call(this, near, far);
	this.fov       = fov;
	this.ratio     = ratio;

	this.near      = near;
	this.far       = far;

	this.position  = position;
	this.direction = direction;

	this.camX      = 0;
	this.camY      = 0;
	this.camZ      = 0;
}


PerspectiveCamera.prototype.computeProjection = function() {
	mat4.identity(projectionMatrix);
	mat4.perspective(projectionMatrix, this.fov, this.ratio, this.near, this.far);
}

