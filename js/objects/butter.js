function Butter(position) {
	this.position = position;
	this.speed = [0, 0, 0];
	this.angle = 0;
	this.isActive = true;
	
	this.inercia = 350;
	
	this.width = 18;
	this.height = 20;
	this.length = 40;
	
	this.updateHitbox();
}

Butter.prototype.draw = function() {
	
}

Butter.prototype.update = function() {
	
}

Butter.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.width / 2;
    this.yMin = this.position[1] - this.height / 2;
	this.zMin = this.position[2] - this.length / 2;
	this.xMax = this.position[0] + this.width / 2;
    this.yMax = this.position[1] + this.height / 2;
	this.zMax = this.position[2] + this.length / 2;
}