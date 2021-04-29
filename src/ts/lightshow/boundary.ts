/**
 * Floor object that is used as an end point for the ray. 
 */
export class Boundary {
  sketch: p5;
  a: p5.Vector;
  b: p5.Vector;

  constructor(sketch: p5, x1: number, y1: number, x2: number, y2: number) {
    this.sketch = sketch;
    this.a = sketch.createVector(x1, y1);
    this.b = sketch.createVector(x2, y2);
  }

  updateLocation(x1: number, x2: number, y1: number, y2: number) { // Used when resizing window
    this.a = this.sketch.createVector(x1, y1);
    this.b = this.sketch.createVector(x2, y2);
  }
}
