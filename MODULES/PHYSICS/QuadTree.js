export class QuadTree_Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }
}

export class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary
        this.capacity = capacity
        this.points = []
        this.divided = false;
        this.collisions = []
    }
}