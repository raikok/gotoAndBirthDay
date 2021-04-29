import { Ray } from "./ray";
import p5 from "p5";

/**
 * Particle that can be moved by mouse.
 */
export class Particle {
  sketch: p5;
  pos: p5.Vector;
  rays: Array<Ray>;
  colorSelection: Array<p5.Color>;

  constructor(sketch: p5, colors: Array<p5.Color>) {
    this.sketch = sketch;
    this.pos = sketch.createVector(200, 100);
    this.rays = [];
    this.colorSelection = colors;
    for (let angle = 0; angle < 360; angle += 1) {
      // Create 360 rays for the particle.
      this.rays.push(new Ray(sketch, this.pos, sketch.radians(angle)));
    }
  }

  updateColors(colors: Array<p5.Color>) {
    this.colorSelection = colors;
  }

  update(x: number, y: number) {
    // Just copies the x and y of the mouse.
    this.pos.x = x;
    this.pos.y = y;
  }

  look(walls: Array<Ray>) {
    let i = 0;
    for (let ray of this.rays) {
      // Cast each ray (from total of 360 rays) out.
      i++;
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall); // Each ray gets casted onto each of the floors.
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
}
