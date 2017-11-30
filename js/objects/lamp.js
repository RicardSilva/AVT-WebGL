function Lamp(position) {
	this.position = position;
	this.speed = speed;
	this.angle = 0;
	this.isActive = true;
	
	this.inercia = 370;
	
	this.createLight();
	
	this.width = 7.8;
	this.height = 37;
	this.length = 7.8;
	
	this.updateHitbox();
}

Lamp.prototype.createLight = function() {
	//this.light = [];
	//this.light.push(/*new Pointlight()*/);
}

Lamp.prototype.draw = function() {
	
}

Lamp.prototype.drawLight = function() {
	
}

Lamp.prototype.update = function() {
	
}

Lamp.prototype.updateLight = function() {
	
}

Lamp.prototype.toggleLight = function() {
	
}

Lamp.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.width / 2;
    this.yMin = this.position[1] - this.height / 2;
	this.zMin = this.position[2] - this.length / 2;
	this.xMax = this.position[0] + this.width / 2;
    this.yMax = this.position[1] + this.height / 2;
	this.zMax = this.position[2] + this.length / 2;
}