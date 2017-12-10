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

	this.target = vec3.fromValues(x,y,z);

	x = x - (60 * Math.cos(orientation * 3.14 / 180));
	y = y + 25;
	z = z - (60 * -Math.sin(orientation * 3.14 / 180));

	this.eye = vec3.fromValues(x,y,z);


}
Camera.prototype.computeCockpitCameraPosition = function(position, orientation) {

	var x = position[0] - (4.5 * Math.cos(orientation * 3.14 / 180)); // camera inside car
	var y = position[1] + 10;
	var z = position[2] - (4.5 * -Math.sin(orientation * 3.14 / 180));

	this.eye = vec3.fromValues(x,y,z);

	x = x + (50 * Math.cos(orientation * 3.14 / 180));
	y = y;
	z = z + (50 * -Math.sin(orientation * 3.14 / 180));

	this.target = vec3.fromValues(x,y,z);
}
Camera.prototype.computeBackCameraPosition = function(position, orientation) {
	
	var x = position[0] - (4.5 * Math.cos(orientation * 3.14 / 180)); // camera inside car
	var y = position[1] + 10;
	var z = position[2] - (4.5 * -Math.sin(orientation * 3.14 / 180));

	this.eye = vec3.fromValues(x,y,z);

	x = x - (50 * Math.cos(orientation * 3.14 / 180));
	y = y - 9;
	z = z - (50 * -Math.sin(orientation * 3.14 / 180));

	this.target = vec3.fromValues(x,y,z);
}

function convertWorldToScreen(worldPosition) {
	var coords = vec4.fromValues(worldPosition[0],
								 worldPosition[1],
								 worldPosition[2],
								 1.0);
	var coords2 = vec4.create();
	var coords3 = vec4.create();
	multMatrixPoint(viewMatrix, coords, coords2);
	multMatrixPoint(projectionMatrix, coords2, coords3);
	

	if (coords3[3] <= 0) {
		return null;
	}

	var x = (coords3[0] / coords3[3] + 1) / 2.0;
	var y = 1 - ((coords3[1] / coords3[3] + 1) / 2.0);


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
	mat4.ortho(projectionMatrix,  this.left,this.right* gl.canvas.clientWidth / gl.canvas.clientHeight, this.bottom, this.top, this.near, this.far);
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
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	mat4.perspective(projectionMatrix, this.fov, aspect, this.near, this.far);
}


StereoCamera.prototype = Object.create(Camera.prototype);
function StereoCamera(fov, ratio, near, far, focal, aperture) {
	Camera.call(this, near, far);
	this.fov       = fov;
	this.ratio     = ratio; 


	this.focal = focal; 
	this.aperture = aperture; 

	this.eyeSep = 0.2;
	this.delta = 0.5 * this.eyeSep * near / focal;
	this.hdiv2 = near * Math.tan(aperture/2);

	this.top = this.hdiv2;
	this.bottom = -this.hdiv2;



}
StereoCamera.prototype.computeLeftView = function() {
	mat4.identity(viewMatrix);
	var direction = vec3.create();
	direction[0] = this.target[0] - this.eye[0];
	direction[1] = this.target[1] - this.eye[1];
	direction[2] = this.target[2] - this.eye[2];

	this.rightVec = crossProduct(direction, this.up);
	this.vEye = [this.rightVec[0] * this.eyeSep / 2.0, 
				this.rightVec[1] * this.eyeSep / 2.0, 
				this.rightVec[2] * this.eyeSep / 2.0];

	mat4.lookAt(viewMatrix, [this.eye[0] - this.vEye[0],
							this.eye[1] - this.vEye[1],
							this.eye[2] - this.vEye[2]],
							[this.eye[0] - this.vEye[0] + direction[0],
							 this.eye[1] - this.vEye[1] + direction[1], 
							 this.eye[2] - this.vEye[2] + direction[2]],
							this.up);
}
StereoCamera.prototype.computeRightView = function() {
	mat4.identity(viewMatrix);

	var direction = vec3.create();
	direction[0] = this.target[0] - this.eye[0];
	direction[1] = this.target[1] - this.eye[1];
	direction[2] = this.target[2] - this.eye[2];

	this.rightVec = crossProduct(direction, this.up);
	this.vEye = [this.rightVec[0] * this.eyeSep / 2.0,
				 this.rightVec[1] * this.eyeSep / 2.0, 
				 this.rightVec[2] * this.eyeSep / 2.0];

	mat4.lookAt(viewMatrix, [this.eye[0] + this.vEye[0],
							this.eye[1] + this.vEye[1],
							this.eye[2] + this.vEye[2]],
							[this.eye[0] + this.vEye[0] + direction[0],
							 this.eye[1] + this.vEye[1] + direction[1],
							 this.eye[2] + this.vEye[2] + direction[2]],
							this.up);





}
StereoCamera.prototype.computeLeftProjection = function() {
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var left = -aspect * this.hdiv2 + this.delta;
	var right = aspect * this.hdiv2 + this.delta;

	mat4.frustum(projectionMatrix, left, right, this.bottom, this.top, this.near, this.far);
}
StereoCamera.prototype.computeRightProjection = function() {
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var left = -aspect * this.hdiv2 - this.delta;
	var right = aspect * this.hdiv2 - this.delta;

	mat4.frustum(projectionMatrix, left, right, this.bottom, this.top, this.near, this.far);
}
