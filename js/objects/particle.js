function Particle(shader) {
	var randomNumber = Math.random() * 1500 + 1;
	var randomNumber2 = Math.random() * 25 + 1;
	var randomNumber3 = Math.random() * 1100 + 1;
	var randomNumber4 = Math.random() * 70 + 50;
	
	this.x = -700 + randomNumber;
	this.y = 50 + randomNumber2;
	this.z = -500 + randomNumber3;
	
	this.vx = 0;
	this.vy = -randomNumber4;
	this.vz = 0;
	
	this.ax = 0; /* simular um pouco de vento */
	this.ay = -10; /* simular a aceleração da gravidade */
	this.az = 0;

	this.color = vec4.create(0.5, 0.7, 0.8, 1.0);
}

Particle.prototype.reset = function() {
	//var randomNumber = Math.random() * 1500 + 1;
	var randomNumber2 = Math.random() * 25 + 1;
	//var randomNumber3 = Math.random() * 1100 + 1;
	//var randomNumber4 = Math.random() * 70 + 50;
	
	//this.x = -700 + randomNumber;
	this.y = 50 + randomNumber2;
	//this.z = -500 + randomNumber3;
	
	this.vx = 0;
	//this.vy = -randomNumber4;
	this.vz = 0;
	
	this.ax = 0; /* simular um pouco de vento */
	this.ay = -10; /* simular a aceleração da gravidade */
	this.az = 0;
}