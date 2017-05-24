var Game = function(horizCellsNumber, vertCellsNumber, cellWidth, cellHeight) {
	this.canvas = document.getElementById('maze');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.ctx = this.canvas.getContext('2d');
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.horizCells = horizCellsNumber;
	this.vertCells = vertCellsNumber;
	this.oldRectX = 2.5;
	this.oldRectY = 2.5;
	this.currRectX = 2.5;
	this.currRectY = 2.5;
	this.keyboardState = [];
	this.collision = 0;
	this.generator = new MazeGenerator(this.horizCells, this.vertCells)
	this.timer;
	
	var self = this; 
			
	this.drawRectangle = function(x, y) {
		this.makeClear(self.oldRectX - 1.5, self.oldRectY - 1.5, self.cellWidth - 3, self.cellHeight - 3, "#eeeeee");
		self.ctx.beginPath();
		self.currRectX = x;
		self.currRectY = y;
		self.ctx.rect(x, y, self.cellWidth - 5, self.cellHeight - 5);
		self.ctx.closePath();
		self.ctx.fillStyle = "blue";
		self.ctx.fill();
	}
	
	this.makeClear = function(x, y, w, h, color) {
		self.ctx.beginPath();
		self.ctx.rect(x, y, w, h);
		self.ctx.closePath();
		self.ctx.fillStyle = color;
		self.ctx.fill();
	}
	
	this.keyUp = function(e){
		self.keyboardState[e.keyCode] = false;
		if (this.isAnyKeyPressed())
			e.preventDefault();
	}
	
	this.keyDown = function(e){
		self.keyboardState[e.keyCode] = true;
		if (this.isAnyKeyPressed())
			e.preventDefault();
	}
	
	this.checkCollision = function(cRX, cRY, cW, cH) {
		this.imgd = self.ctx.getImageData(cRX, cRY, cW, cH);
		this.pix = self.imgd.data;
		for (var i = 0; i < self.pix.length; i += 4) {
			if (self.pix[i] === 255 ) { // red
				self.collision = 1;
				break;
			} else {
				self.collision = 0;
			}
		}
	}
	
	this.moveRect = function(){
		if (self.keyboardState[37] || self.keyboardState[65]) {//left or a
			if (self.currRectX - (self.cellWidth) >= 0 ){
				this.checkCollision(self.currRectX - 2.5, self.currRectY, self.cellWidth - 2.5, self.cellHeight - 5);
				if (self.collision == 0){
					self.oldRectX = self.currRectX;
					self.oldRectY = self.currRectY;
					self.currRectX -= self.cellWidth;
					this.makeClear(self.oldRectX - 1.5, self.oldRectY - 1.5, self.cellWidth - 3, self.cellHeight - 3, "#eeeeee");
					this.drawRectangle(self.currRectX, self.currRectY);
				}
			}
		}
		if (self.keyboardState[38] || self.keyboardState[87]) {//up or w 
			if (self.currRectY - (self.cellHeight) >= 0){
				this.checkCollision(self.currRectX, self.currRectY - 2.5, self.cellWidth - 5, self.cellHeight - 2.5);
				if (self.collision == 0){
					self.oldRectX = self.currRectX;
					self.oldRectY = self.currRectY;
					self.currRectY -= self.cellHeight;
					this.makeClear(self.oldRectX - 1.5, self.oldRectY - 1.5, self.cellWidth - 3, self.cellHeight - 3, "#eeeeee");
					this.drawRectangle(self.currRectX, self.currRectY);
				}
			}
		}
		if (self.keyboardState[39] || self.keyboardState[68]) {//right or d
			if (self.currRectX + (self.cellWidth) < self.width){
				this.checkCollision(self.currRectX, self.currRectY, self.cellWidth - 2.5, self.cellHeight - 5);
				if (self.collision == 0){
					self.oldRectX = self.currRectX;
					self.oldRectY = self.currRectY;
					self.currRectX += self.cellWidth;
					this.makeClear(self.oldRectX - 1.5, self.oldRectY - 1.5, self.cellWidth - 3, self.cellHeight - 3, "#eeeeee");
					this.drawRectangle(self.currRectX, self.currRectY);
				}
			}
		}
		if (self.keyboardState[40] || self.keyboardState[83]) {//down or s
			if (self.currRectY + (self.cellHeight) < self.height){
				this.checkCollision(self.currRectX, self.currRectY, self.cellWidth - 5, self.cellHeight - 2.5);
				if (self.collision == 0){
					self.oldRectX = self.currRectX;
					self.oldRectY = self.currRectY;
					self.currRectY += self.cellHeight;
					this.makeClear(self.oldRectX - 1.5, self.oldRectY - 1.5, self.cellWidth - 3, self.cellHeight - 3, "#eeeeee");
					this.drawRectangle(self.currRectX, self.currRectY);
				}
			}
		}
		if (self.currRectX - 2.5 === self.width - self.cellWidth && self.currRectY - 2.5 === self.height - self.cellHeight) {
			self.canvas.remove();
			clearInterval(self.timer);
			document.body.style.backgroundImage = "url('src/img/congrats.gif')";
			document.getElementById('congratulations').style.display = "block";
			document.getElementById('congratulations').style.backgroundColor = "transparent";
			document.getElementById('congratulations').style.font = "50px Kunstler Script";
			document.getElementById('congratulations').style.color = "white";
			document.getElementById('congratulations').style.margins = "auto";
			document.getElementById('congratulations').style.paddings = "70 0";
			document.getElementById('congratulations').style.textAlign = "center";
			document.getElementById('timer').style.display = "none";
			document.getElementById('again').style.display = "inline-block";
		}
	}
	
	this.isAnyKeyPressed = function(){
		if (self.keyboardState[37] || self.keyboardState[38] || 
		self.keyboardState[39] || self.keyboardState[40] ||
		self.keyboardState[65] || self.keyboardState[68] || 
		self.keyboardState[83] || self.keyboardState[87])
			return true;
		else
			return false;
	}

	this.createTimer = function(seconds) {
		self.timer = setInterval(function () {	
			document.getElementById('timer').style.display = "block";
			document.getElementById('timer').style.backgroundColor = "transparent";
			document.getElementById('timer').style.font = "20px Arial";
			document.getElementById('timer').style.margins = "auto";
			document.getElementById('timer').style.paddings = "10px";
			document.getElementById('timer').style.color = "green";
			
			var minutes = Math.floor(seconds / 60);
			var secondsToShow = (seconds - minutes * 60).toString();
			
			if (secondsToShow.length === 1) {
				secondsToShow = "0" + secondsToShow; // if the number of seconds is '5' for example, make sure that it is shown as '05'
			}
			
			document.getElementById('timer').innerHTML = minutes.toString() + ":" + secondsToShow;
	
			if (seconds <= 0) {
				document.getElementById('maze').style.display = "none";	
				//self.canvas.remove();
				clearInterval(self.timer);
				document.getElementById('timer').innerHTML = "Time is out";	
				document.getElementById('solve').style.display = "inline-block";
				document.getElementById('again').style.display = "inline-block";
			}
			document.getElementById('timer').style.font = "20px Arial"
			if (seconds <= 10 && seconds > 5) {
				document.getElementById('timer').style.color = "orange";
			} else if (seconds <= 5) {
				document.getElementById('timer').style.color = "red";
			}
			seconds--;
		}, 1000);
	}
	
	document.addEventListener("keydown", this.keyDown.bind(this), false);
	document.addEventListener("keyup", this.keyUp.bind(this), false);
	window.setInterval(this.moveRect.bind(this), 100);
	
}

//drawRectangle(425, 3); // { 425, 3 } is the position of the blue rectangle on the canvas
 // add this at the bottom of your script