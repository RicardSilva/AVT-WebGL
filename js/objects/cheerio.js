function Cheerio(position) {
	this.position = position;
	this.speed = [0, 0, 0];
	this.angle = 0;
	this.isActive = true;

	this.inercia = 320;
	
	this.width = 15;
	this.height = 4.5;
	this.length = 15;
	
	this.updateCenter();
	
	this.updateHitbox();
}

Cheerio.prototype.draw = function() {
	
}

Cheerio.prototype.update = function() {
	
}

Cheerio.prototype.updateCenter = function() {
	this.center = [xMin + (xMax - xMin) / 2, yMin + (yMax - yMin) / 2, zMin + (zMax - zMin) / 2];
}

Cheerio.prototype.updateHitbox = function() {
	this.xMin = this.position[0] - this.width / 2;
    this.yMin = this.position[1] - this.height / 2;
	this.zMin = this.position[2] - this.length / 2;
	this.xMax = this.position[0] + this.width / 2;
    this.yMax = this.position[1] + this.height / 2;
	this.zMax = this.position[2] + this.length / 2;
}