import { Ray } from "./ray";
import p5 from "p5";

/**
 * Particle that moves about on it's own.
 */
export class randomParticle {
  sketch: p5;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  rays: Array<Ray>;
  colorSelection: Array<p5.Color>;
  bounds: Array<number>;

  constructor(
    sketch: p5,
    colors: Array<p5.Color>,
    startPos: Array<number>,
    bounds: Array<number>
  ) {
    this.sketch = sketch;
    this.pos = sketch.createVector(startPos[0], startPos[1]);
    this.vel = sketch.createVector();
    this.acc = sketch.createVector();
    this.rays = [];
    this.colorSelection = colors;
    this.bounds = bounds;
    for (let angle = 0; angle < 360; angle += 1) {
      // Create 360 rays for the particle.
      this.rays.push(new Ray(sketch, this.pos, sketch.radians(angle)));
    }
  }

  updateColors(colors: Array<p5.Color>) {
    this.colorSelection = colors;
  }

  update() {
    const dir = p5.Vector.random2D().mult(0.1); // Choses random direction on each tick.
    this.acc.add(dir);
    this.move();
    this.show();
  }

  move() {
    this.vel.add(this.acc);
    // The following stops the particle from moving out of bounds. (known bug: the particle moves and stays out of bounds if window is resized)
    if (!this.checkXinBounds(this.pos.x + this.vel.x)) {
      // If the velocity would send this particle out of bounds, reverse velocy.
      this.vel.x = this.vel.x * -1;
    }
    if (!this.checkYinBounds(this.pos.y + this.vel.y)) {
      // If the velocity would send this particle out of bounds, reverse velocy.
      this.vel.y = this.vel.y * -1;
    }
    this.pos.add(this.vel);
    this.vel.limit(5);
    this.acc.mult(0);
  }

  look(floors: Array<Ray>) {
    let i = 0;
    for (let ray of this.rays) {
      // Cast each ray (from total of 360 rays) out.
      i++;
      let closest = null;
      let record = Infinity;
      for (let floor of floors) {
        const pt = ray.cast(floor); // Each ray gets casted onto each of the floors.
        if (pt) {
          // If there is an intersection point
          const d = p5.Vector.dist(this.pos, pt); // Get the distance between them
          if (d < record) {
            // And record the closest floor to the ray.
            record = d;
            closest = pt;
          }
        }
      }
      if (closest) {
        // If it was the closest floor, then cast a colorful (depending on the angle) ray out to that closest floor.
        if (i < 75) {
          this.sketch.stroke(this.colorSelection[0]);
        } else if (i < 100) {
          this.sketch.stroke(this.colorSelection[1]);
        } else if (i < 175) {
          this.sketch.stroke(this.colorSelection[2]);
        } else {
          this.sketch.stroke(this.colorSelection[3]);
        }
        this.sketch.line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  show() {
    for (let ray of this.rays) {
      ray.show();
    }
  }

  // Used in checking bounds
  checkXinBounds(x: number) {
    const x0 = this.bounds[0];
    const x1 = this.bounds[1];

    return x > x0 && x < x1;
  }

  // Used in checking bounds
  checkYinBounds(y: number) {
    const y0 = 0;
    const y1 = this.bounds[2] - 200;

    return y > y0 && y < y1;
  }
}
