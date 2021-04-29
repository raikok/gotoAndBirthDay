import p5 from "p5";
import { Boundary } from "../../js/lightshow/boundary";

/**
 * Ray that gets casted from particle to the floor.
 * Used for checking intersection points and drawing the ray.
 */
export class Ray {
  sketch: p5;
  pos: p5.Vector;
  dir: p5.Vector;

  constructor(sketch: p5, pos: p5.Vector, angle: any) {
    this.sketch = sketch;
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  show() {
    this.sketch.stroke(255);
    this.sketch.push();
    this.sketch.translate(this.pos.x, this.pos.y);
    this.sketch.line(0, 0, this.dir.x * 10, this.dir.y * 10);
    this.sketch.pop();
  }
  /**
   * Function for looking for an intersection point between the ray object and boundary object.
   * @param floor where the ray is being casted to.
   * @returns Point of intersection if exists, null otherwise.
   */
  cast(floor: Boundary) {
    const x1 = floor.a.x;
    const y1 = floor.a.y;
    const x2 = floor.b.x;
    const y2 = floor.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = this.sketch.createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  }
}
