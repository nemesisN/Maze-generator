var cols, rows;
var w = 20;
var grid = [];
var current;
var stack = [];
var canvasWidth = 600;  // Default canvas width
var canvasHeight = 600; // Default canvas height

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    resetMaze();
}

function draw() {
    background(147, 211, 174);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.visited = true;
    current.highlight();
    var next = current.checkNeighbors();
    if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}

function resetMaze() {
    grid = [];
    stack = [];
    cols = floor(width / w);
    rows = floor(height / w);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var cell = new Cell(j, i);
            grid.push(cell);
        }
    }
    current = grid[0];
    loop(); // Restart the draw loop
}

function setMazeSize(size) {
    w = size;
    resetMaze();
}

function setCanvasSize(width, height) {
    canvasWidth = width;
    canvasHeight = height;
    resizeCanvas(canvasWidth, canvasHeight);
    resetMaze();
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        var neighbors = [];
        var top = grid[index(i, j - 1)];
        var right = grid[index(i + 1, j)];
        var bottom = grid[index(i, j + 1)];
        var left = grid[index(i - 1, j)];
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        if (neighbors.length > 0) {
            var r = floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    this.highlight = function () {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(46, 186, 165);
        rect(x, y, w, w);
    }

    this.show = function () {
        var x = this.i * w;
        var y = this.j * w;
        stroke(255);
        if (this.walls[0]) {
            line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            line(x + w, y + w, x, y + w);
        }
        if (this.walls[3]) {
            line(x, y + w, x, y);
        }
        if (this.visited) {
            noStroke();
            fill(43, 186, 165);
            rect(x, y, w, w);
        }
    }
}

function removeWalls(a, b) {
    var x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    var y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}
