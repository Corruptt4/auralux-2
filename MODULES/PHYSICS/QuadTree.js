export class QuadTree_Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }
    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }
    intersects(point) {
        let closestX = Math.max(this.x - this.w, Math.min(point.x, this.x + this.w));
        let closestY = Math.max(this.y - this.h, Math.min(point.y, this.y + this.h));

        let dx = point.x - closestX;
        let dy = point.y - closestY;
        let dist = dx*dx+dy*dy;
        let range = point.size*point.size;

        return dist < range;
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
    subdivide() {
        let { x, y } = this.boundary
        let hw = this.boundary.w / 2
        let hh = this.boundary.h / 2

        let nw = new QuadTree_Rect(x, y, hw, hh)
        let ne = new QuadTree_Rect(x + hw, y, hw, hh)
        let sw = new QuadTree_Rect(x + hw, y + hh, hw, hh)
        let se = new QuadTree_Rect(x, y + hh, hw, hh)
        
        this.nw = new QuadTree(nw, this.capacity)
        this.ne = new QuadTree(ne, this.capacity)
        this.sw = new QuadTree(sw, this.capacity)
        this.se = new QuadTree(se, this.capacity)
    }

    insert(point) {
        if (this.boundary.contains(point)) return 0;

        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            this.divided = true
            this.subdivide()
            if (this.nw.intersects(point)) {
                this.nw.insert(point)
            }
            if (this.ne.intersects(point)) {
                this.ne.insert(point)
            }
            if (this.sw.intersects(point)) {
                this.sw.insert(point)
            }
            if (this.se.intersects(point)) {
                this.se.insert(point)
            }
        }
    }
}