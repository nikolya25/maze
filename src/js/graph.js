var Graph = function(width, height) {
	this.width = width;
	this.height = height;
	this.cells = [];
	this.removedEdges = [];
	this.topCell;
	this.rightCell;
	this.bottomCell;
	this.leftCell;
	var self = this;

	this.getCellAt = function (x, y) {
		if(x >= this.width || y >= this.height || x < 0 || y < 0) {
			return null;
		}
		if(!this.cells[x]) {
			return null;
		}
		return this.cells[x][y];
	};

	this.getCellDistance = function (cell1, cell2) {
		var xDist = Math.abs(cell1.x - cell2.x);
		var yDist = Math.abs(cell1.y - cell2.y);
		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	},

  // Returns true if there is an edge between cell1 and cell2
	this.areConnected = function(cell1, cell2) {
		if(!cell1 || !cell2) {
			return false;
		}
		if(Math.abs(cell1.x - cell2.x) > 1 || Math.abs(cell1.y - cell2.y) > 1) {
			return false;
		}
		var removedEdge = _.detect(this.removedEdges, function(edge) {
			return _.include(edge, cell1) && _.include(edge, cell2);
		});
		return removedEdge == undefined;
	};

	this.cellUnvisitedNeighbors = function(cell) {
		return _.select(this.cellConnectedNeighbors(cell), function(c) {
			return !c.visited;
		});
	};

  // Returns all neighbors of this cell that ARE separated by an edge (maze line)
	this.cellConnectedNeighbors = function(cell) {
		return _.select(this.cellNeighbors(cell), function(c) {
			return self.areConnected(cell, c);
		});
	};

  // Returns all neighbors of this cell that are NOT separated by an edge
  // This means there is a maze path between both cells.
	this.cellDisconnectedNeighbors = function (cell) {
		return _.reject(this.cellNeighbors(cell), function(c) {
			return self.areConnected(cell, c);
		});
	}

  // Returns all neighbors of this cell, regardless if they are connected or not.
	this.cellNeighbors = function (cell) {
		this.neighbors = [];
		self.topCell = this.getCellAt(cell.x, cell.y - 1);
		self.rightCell = this.getCellAt(cell.x + 1, cell.y);
		self.bottomCell = this.getCellAt(cell.x, cell.y + 1);
		self.leftCell = this.getCellAt(cell.x - 1, cell.y);

		if(cell.y > 0 && self.topCell) {
			self.neighbors.push(self.topCell);
		}
		if(cell.x < this.width && self.rightCell) {
			self.neighbors.push(self.rightCell);
		}
		if(cell.y < this.height && self.bottomCell) {
			self.neighbors.push(self.bottomCell);
		}
		if(cell.x > 0 && self.leftCell) {
			self.neighbors.push(self.leftCell);
		}
		return self.neighbors;
	}

	this.removeEdgeBetween = function(cell1, cell2) {
		this.removedEdges.push([cell1, cell2]);
	};

	for(var i = 0; i < this.width; i++) {
		this.cells.push([]);
		row = this.cells[i];

		for(var j = 0; j < this.height; j++) {
			var cell = new Cell(i, j, this);
			row.push(cell);
		}
	}
};