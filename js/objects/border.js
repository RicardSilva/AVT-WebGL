function Border(position, width, length) {
	this.position = position;
	
	this.width = width;
	this.length = length;
	
	//hitbox
	this.minCorner;
	this.maxCorner;
	this.center;
	
	this.updateHitbox();
}

Border.prototype.draw = function() {}

Border.prototype.update = function() {}



Border.prototype.updateHitbox = function() {
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