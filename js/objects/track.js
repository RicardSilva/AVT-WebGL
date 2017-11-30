function Track(position) {
	this.position = position;
	this.speed = [0, 0, 0];
	this.angle = 0;
	this.isActive = true;
	
	this.startingPosition = [0, 0, 0] ;
	this.orangeCounter = 0;
	this.orangeSpeed = 125;
	
	this.createObjects();
}

Track.prototype.createObjects = function() {
	this.cheerios = [];
	//this.cheerios.push(/*new Spotlight()*/);
	this.butters = [];
	//this.butters.push(/*new Spotlight()*/);
	this.oranges = [];
	//this.oranges.push(/*new Spotlight()*/);
}

Track.prototype.draw = function() {
	
}

Track.prototype.drawLights = function() {
	
}

Track.prototype.update = function() {
	
}

Track.prototype.restart = function() {
	
}

Track.prototype.attemptToSpawnOrange = function() {
	
}

Track.prototype.increaseOrangeSpeed = function() {
	
}

Track.prototype.toogleDirectionalLight = function() {
	
}

Track.prototype.tooglePointLights = function() {
	
}