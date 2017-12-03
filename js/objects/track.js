function Track(position) {
	this.position = position;
	this.speed = vec3.fromValues(0, 0, 0);
	this.angle = 0;
	this.isActive = true;
	
	this.startingPosition = vec3.fromValues(0, 0, 0);
	this.orangeCounter = 0;
	this.orangeSpeed = 125;
	this.orangeStartingSpeed = 125;
	
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
	var track_width = 1400
	var track_height = 1000
	var trackPerimeter = 2 * (track_width + 50) + 2 *(track_height + 50);
	var x = -track_width / 2- 50; // bottom left corner
	var z = -track_height / 2 - 50;
	
	var randomNumber = 0;
	
	var angle = 0;
	var axleAngle = 0;
	
	if (this.orangeCounter < 3) { //TODO rand lib
		randomNumber = rand() % trackPerimeter + 1;	// number in the range of 1 to track_perimeter
		
		// COMPUTES RANDOM POSITION using perimeter
		if (randomNumber < 1500) {
			x = x + randomNumber;
		}
		else if (randomNumber < 2600) {
			x = x + 1500;
			z = z + randomNumber - 1500;
		}
		else if (randomNumber < 4100) {
			x = x + 4100 - (randomNumber);
			z = z + 1100;
		}
		else if (randomNumber <= 5200) {
			z = z + 5200 - (randomNumber);
		}
		
		// SELECT RANDOM ANGLE 
		angle = -asin(z / (sqrt(x * x + z * z)));	// normalize y coordinate
		angle = radToDeg(angle);	// convert from rads to degrees

								// computes angle from spawn point to origin (0, 0)
		if (x >= 0 && z < 0) {	// first quadrant
			angle = 180 + angle;
		}
		else if (x < 0 && z < 0) {	// second quadrant
			angle = 360 - angle;
		}
		else if (x < 0 && z >= 0) {	// third quadrant
			angle = -angle;
		}
		else {	// forth quadrant
			angle = 180 + angle;
		}
		
		angle = angle + rand() % 80 - 40;	// randomize angle

		speed = rand() % 20 + this.orangeStartingSpeed;	

		// compute rotation axle angle
		axleAngle = angle + 90;	// axle is perpendicular to direction of movement
		axleAngle = axleAngle % 360;

		var cosAngle = cos(degToRad(axleAngle));	// convert from degrees to rads
		var sinAngle = sin(degToRad(axleAngle));

		this.oranges.push(new Orange(vec3.fromValues(x, 0, z), vec3.fromValues(speed, 0, speed), angle, vec3.fromValues(cosAngle, 0, -sinAngle)));
		this.oranges[this.oranges.length].isActive = true;
		this.orangeCounter++;
	}
}

Track.prototype.increaseOrangeSpeed = function() {
	this.orangeStartingSpeed += 125;
	for (orange of this.oranges){
		orange.increaseSpeed();
	}
}

Track.prototype.removeOrange = function(i) {
	this.oranges.splice(1, 1);
	this.orangeCounter--;
}

Track.prototype.toogleDirectionalLight = function() {
	
}

Track.prototype.tooglePointLights = function() {
	
}