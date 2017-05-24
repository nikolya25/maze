var Maze = function(horizCellsNumber, vertCellsNumber, cellWidth, cellHeight) {
	this.canvas = document.getElementById('maze');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.ctx = this.canvas.getContext('2d');
	this.horizCells = horizCellsNumber;
	this.vertCells = vertCellsNumber;
	//this.generator = new MazeGenerator(this.horizCells, this.vertCells);	
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.currRectX;
	this.currRectY;
	this.currCell;
	this.game = new Game(this.horizCells, this.vertCells, this.cellWidth, this.cellHeight);

	var self = this;

	self.ctx.strokeStyle = "rgba(255, 0, 0, 1)";
	self.ctx.fillStyle = "rgba(255 , 0, 0, 0.1)";

	return {
		width: function() {
			return self.width;
		},
		
		height: function() {
			return self.height;
		},
		
		generate: function () {
			self.game.generator.generate();
		},
		
		draw: function() {
			this.drawBorders();
			this.drawMaze();
			this.drawStartAndFinish();
			self.game.createTimer(self.horizCells + self.vertCells);
		},
		
		solve: function() {
			self.ctx.fillStyle = "rgba(255 , 0, 0, 0.1)";
			document.getElementById('solve').style.display = "none";
			self.canvas.style.display = "inline-block";
			self.game.generator.solve();
			this.drawSolution();
		},
		
		backToMenu: function() {
			
		},
		
		drawBorders: function() {
			this.drawLine(self.cellWidth, 0, self.width, 0);
			this.drawLine(self.width, 0, self.width, self.height);
			this.drawLine(self.width - self.cellWidth, self.height, 0, self.height);
			this.drawLine(0, self.height, 0, 0);
		},
		
		drawSolution: function() {
			var path = self.game.generator.path;
			for(var i = 0; i < path.length; i++) {
				(function () {
					var cell = path[i];
					var x = cell.x * self.cellWidth;
					var y = cell.y * self.cellHeight;
					setTimeout(function() {
						self.ctx.fillRect(x, y, self.cellWidth, self.cellHeight);
					}, 80 * i);
				})();
			}
		},
		
		drawMaze: function() {
			var graph = self.game.generator.graph;
			var drawnEdges = [];
			var edgeAlreadyDrawn = function(cell1, cell2) {
				return _.detect(drawnEdges, function(edge) {
					return _.include(edge, cell1) && _.include(edge, cell2);
				}) != undefined;
			};

			for(var i = 0; i < graph.width; i++) {
				for(var j = 0; j < graph.height; j++) {
					var cell = graph.cells[i][j];
					var topCell = graph.getCellAt(cell.x, cell.y - 1);
					var leftCell = graph.getCellAt(cell.x - 1, cell.y);
					var rightCell = graph.getCellAt(cell.x + 1, cell.y);
					var bottomCell = graph.getCellAt(cell.x, cell.y + 1);
          
					if(!edgeAlreadyDrawn(cell, topCell) && graph.areConnected(cell, topCell)) {
						var x1 = cell.x * self.cellWidth;
						var y1 = cell.y * self.cellHeight;
						var x2 = x1 + self.cellWidth;
						var y2 = y1;
            
						this.drawLine(x1, y1, x2, y2);
						drawnEdges.push([cell, topCell]);
					}
				
					if(!edgeAlreadyDrawn(cell, leftCell) && graph.areConnected(cell, leftCell)) {
						var x2 = x1;
						var y2 = y1 + self.cellHeight;
            
						this.drawLine(x1, y1, x2, y2);
						drawnEdges.push([cell, leftCell]);
					}

					if(!edgeAlreadyDrawn(cell, rightCell) && graph.areConnected(cell, rightCell)) {
						var x1 = (cell.x * self.cellWidth) + self.cellWidth;
						var y1 = cell.y * self.cellHeight;
						var x2 = x1;
						var y2 = y1 + self.cellHeight;
            
						this.drawLine(x1, y1, x2, y2);
						drawnEdges.push([cell, rightCell]);
					}

					if(!edgeAlreadyDrawn(cell, bottomCell) && graph.areConnected(cell, bottomCell)) {
						var x1 = cell.x * self.cellWidth;
						var y1 = (cell.y * self.cellHeight) + self.cellHeight;
						var x2 = x1 + self.cellWidth;
						var y2 = y1;
            
						this.drawLine(x1, y1, x2, y2);
						drawnEdges.push([cell, bottomCell]);
					}          
				}
			}
		},

		drawStartAndFinish: function() {
			this.drawRect(2.5 , 2.5);
			self.ctx.beginPath();
			self.ctx.fillStyle = "rgba(0,255,0,1)";
			self.ctx.arc(self.width - self.cellWidth / 2, self.height - self.cellHeight / 2, 7, 0, 2 * Math.PI, false);
			self.ctx.closePath();
			self.ctx.fill();
		},
	
		drawLine: function(x1, y1, x2, y2) {
			self.ctx.beginPath();
			self.ctx.moveTo(x1, y1);
			self.ctx.lineTo(x2, y2);
			self.ctx.stroke();
		},
			
		drawRect: function(x, y) {
			self.ctx.beginPath();
			self.ctx.rect(x, y, self.cellWidth - 5, self.cellHeight - 5);
			self.currCell = self.game.generator.graph.getCellAt(x, y);
			self.ctx.closePath();
			self.ctx.fillStyle = "rgba(0,0,255,1)";
			self.ctx.fill();
		}
	}
}
