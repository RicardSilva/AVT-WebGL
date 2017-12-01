function Track(position) {
	this.position = position;
	this.speed = vec3.create(0, 0, 0);
	this.angle = 0;
	this.isActive = true;
	
	this.startingPosition = vec3.create(0, 0, 0);
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
	this.lamps = [];
	//this.lamps.push(/*new Spotlight()*/);
	this.borders = [];
	//this.borders.push(/*new Spotlight()*/);
}

Track.prototype.draw = function() {
	
}

Track.prototype.drawLights = function() {
	
}

Track.prototype.update = function(timeStep) {
	for (cheerio of this.cheerios) {
		if (cheerio.isActive)
			cheerio.update(timeStep);
	}
	for (butter of this.butters) {
		if (butter.isActive)
			butter.update(timeStep);
	}
	for (orange of this.oranges) {
		if (orange.isActive)
			orange.update(timeStep);
	}
}

Track.prototype.restart = function() {
	
}

Track.prototype.attemptToSpawnOrange = function() {
	
}

Track.prototype.increaseOrangeSpeed = function() {
	
}

Track.prototype.removeOrange = function(i) {
	this.oranges.splice(1, 1);
	this.orangeCounter--;
}

Track.prototype.toogleDirectionalLight = function() {
	
}

Track.prototype.tooglePointLights = function() {
	
}