const TRACK_WIDTH = 1400;
const TRACK_HEIGHT = 1000;
const HALF_TRACK_WIDTH = 700;
const HALF_TRACK_HEIGHT = 500;

function Track(position, shader) {
	this.position = position;

	this.cheerios = [];
	this.butters = [];	
	this.oranges = [];

	this.borders = [];
	this.lamps = [];

	this.startingPosition = vec3.create();
	
	this.orangeCounter = 0;
	this.orangeSpeed = 125;
	this.orangeStartingSpeed = 125;
	
	//model
	this.model = models.track;
	this.shader = shader;

	this.borders.push(new Border([HALF_TRACK_WIDTH + 50, 0, 0], 20.0, TRACK_HEIGHT + 50));
	this.borders.push(new Border([-HALF_TRACK_WIDTH - 50, 0, 0], 20.0, TRACK_HEIGHT + 50));
	this.borders.push(new Border([0, 0, HALF_TRACK_HEIGHT + 50], TRACK_WIDTH + 50, 20.0));
	this.borders.push(new Border([0, 0, -HALF_TRACK_HEIGHT - 50], TRACK_WIDTH + 50, 20.0));

	this.directionalLight = new DirectionalLight([-1, -1, 0, 0], [1, 1, 1], 0.5, this.shader);
	
	this.billboard = new Billboard([0, -10, 0], this.shader);
	
	this.finishLine;
}

Track.prototype.loadFromFile = function(track, file) {
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
            	var x = 0;
				var z = 100;
				var c = 0;
            	var data = rawFile.responseText;
            	while (x < 140 && z > 0) {
		
					
					if (data[c] == 0) {
						// do nothing
					}
					else if (data[c] == 1) {
						//new cheerio
						track.cheerios.push(new Cheerio(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 2) {
						//new candle
						track.lamps.push(new Lamp(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 3) {
						//new butter
						track.butters.push(new Butter(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 4) {
						track.startingPosition = vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500));
					}
					x++;
					c++;
					if (x == 140) {
						x = 0;
						c++;
						c++;
						z--;
				}
	}
			    

            }
        }
    }
    rawFile.send(null);
}

Track.prototype.getStartingPosition = function() {
	return this.startingPosition;
}

Track.prototype.createFinishingLine = function() {
	var linePos = [this.startingPosition[0]+45, this.startingPosition[1], this.startingPosition[2]+15];
	this.finishLine = new FinishLine(linePos, 20, 50, this.shader);
}

Track.prototype.draw = function(cam) {
	gameManager.matrices.pushMatrix(modelID);
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.shader.loadMatrices();
	
	//load textures
	this.shader.enableTextures();
	this.shader.loadTextureMode(0);
	
	
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, textures[7]);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, textures[8]);
	gl.activeTexture(gl.TEXTURE9);
	gl.bindTexture(gl.TEXTURE_2D, textures[9]);
	gl.activeTexture(gl.TEXTURE10);
	gl.bindTexture(gl.TEXTURE_2D, textures[10]);
	gl.activeTexture(gl.TEXTURE11);
	gl.bindTexture(gl.TEXTURE_2D, textures[11]);
	
	this.shader.loadWoodDiffuse(7);
	this.shader.loadWoodSpecular(8);
	this.shader.loadBambooDiffuse(9);
	this.shader.loadBambooSpecular(10);
	this.shader.loadMask(11);

	var arrayLength = this.model.meshes.length;
	for (var i = 0; i < arrayLength; i++) {
		this.shader.loadMaterial(this.model.meshes[i].material);
		this.model.meshes[i].draw(this.shader);
	}

	this.shader.disableTextures();
	gl.bindTexture(gl.TEXTURE_2D, null);

	this.shader.loadMaterial(this.cheerios[0].model.meshes[0].material);
	for (cheerio of this.cheerios)
		cheerio.draw();
	for (butter of this.butters)
		butter.draw();
	for (orange of this.oranges) {
		orange.draw();
	}
	for (lamp of this.lamps) {
		lamp.draw();
	}
	for (border of this.borders) {
		border.draw();
	}

	this.finishLine.draw();
	this.billboard.draw(cam);
	
	gameManager.matrices.popMatrix(modelID);
}

Track.prototype.drawLights = function() {
	this.directionalLight.draw();
	for (lamp of this.lamps)
		lamp.drawLights();
}

Track.prototype.update = function(timeStep) {
	for (cheerio of this.cheerios) {
		cheerio.update(timeStep);
	}
	for (butter of this.butters) {
		butter.update(timeStep);
	}
	
	for (i = 0; i < this.oranges.length; i++){
		var orange = this.oranges[i];
		orange.update(timeStep);
		if(orange.outOfBounds()) {
			this.oranges.splice(i, 1);
			this.orangeCounter--;
		}
	}
}

Track.prototype.restart = function(track, file) {
	this.cheerios.length = 0;
	this.butters.length = 0;
	this.oranges.length = 0;
	this.orangeCounter = 0;
	this.orangeStartingSpeed = 125;

	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
            	var x = 0;
				var z = 100;
				var c = 0;
            	var data = rawFile.responseText;
            	while (x < 140 && z > 0) {
		
					
					if (data[c] == 0) {
						// do nothing
					}
					else if (data[c] == 1) {
						//new cheerio
						track.cheerios.push(new Cheerio(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 2) {
						//new candle
						track.lamps.push(new Lamp(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 3) {
						//new butter
						track.butters.push(new Butter(vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500)), track.shader));
					}
					else if (data[c] == 4) {
						track.startingPosition = vec3.fromValues((x * 10 - 700), 0, -(z * 10 - 500));
					}
					x++;
					c++;
					if (x == 140) {
						x = 0;
						c++;
						c++;
						z--;
				}
	}
			    

            }
        }
    }
    rawFile.send(null);
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
	
	if (this.orangeCounter < 3) {
		randomNumber = Math.random() * trackPerimeter;	// number in the range of 1 to track_perimeter
		
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
		angle = -Math.asin(z / (Math.sqrt(x * x + z * z)));	
		angle = angle * 180.0 / 3.14;	// convert from rads to degrees
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
		
		angle = angle - 40 + Math.random() * 80;	// randomize angle

		speed = Math.random() * 20 + this.orangeStartingSpeed;	

		// compute rotation axle angle
		axleAngle = angle + 90;	// axle is perpendicular to direction of movement
		axleAngle = axleAngle % 360;

		var cosAngle = Math.cos(axleAngle * 3.14 / 180);	// convert from degrees to rads
		var sinAngle = Math.sin(axleAngle * 3.14 / 180);
		
		this.oranges.push(new Orange(vec3.fromValues(x, 0, z), vec3.fromValues(speed, 0, speed), 
			angle, vec3.fromValues(cosAngle, 0, -sinAngle), this.shader));
		//this.oranges[this.oranges.length].isActive = true;
		this.orangeCounter++;
	}
}

Track.prototype.increaseOrangeSpeed = function() {
	this.orangeStartingSpeed += 125;
	for (orange of this.oranges){
		orange.increaseSpeed();
	}
}

Track.prototype.toogleDirectionalLight = function() {
	if (this.directionalLight.isActive) {
		this.directionalLight.isActive = false;
	}
	else {
		this.directionalLight.isActive = true;
	}
}

Track.prototype.tooglePointLights = function() {
	for (lamp of this.lamps)
		lamp.toggleLight();
}