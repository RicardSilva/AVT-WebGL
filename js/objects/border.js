function Border(position, width, length) {
	this.position = position;
	this.speed = speed;
	this.angle = 0;
	
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
	this.minCorner = vec3.fromValues(this.position.x - this.width / 2,
								this.position.y - this.height / 2,
								this.position.z - this.length / 2);
	this.maxCorner = vec3.fromValues(this.position.x + this.width / 2,
								this.position.y + this.height / 2,
								this.position.z + this.length / 2);
	this.center = vec3.fromValues(this.minCorner.x + (this.maxCorner.x - this.minCorner.x) / 2,
							this.minCorner.y + (this.maxCorner.y - this.minCorner.y) / 2,
							this.minCorner.z + (this.maxCorner.z - this.minCorner.z) / 2);
}