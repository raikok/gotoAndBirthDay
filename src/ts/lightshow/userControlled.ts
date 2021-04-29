import p5 from "p5";
import { Boundary } from "../../js/lightshow/boundary";
import { Particle } from "../../js/lightshow/particle";

/**
 * P5 canvas of a particle that can be controlled by the user by moving their mouse around
 * the screen. Also includes floors that have colorful rays cast onto them.
 * Colors of rays change on mouse click.
 */
export class userControlledLasers {
  toggle: boolean;

  constructor(toggle: boolean) {
    this.toggle = toggle;
  }

  getP5() {
    return new p5(this.s);
  }

  setToggle() {
    this.toggle = !this.toggle;
  }

  s = (sketch: p5) => {
    let floors = [];
    let windowX = window.innerWidth;
    let windowY = window.innerHeight;
    let particle: Particle;

    sketch.setup = () => {
      const renderer = sketch.createCanvas(windowX, windowY);
      renderer.parent("canvases"); // renders in canvases div

      // placement of user controlled particle's floors (aka platforms where the particle is casting rays)
      for (let i = 0; i < 4; i++) {
        const centerLength = windowX / 3;
        const xPos =
          (i + 1) * (centerLength / 4) - centerLength / 5 + centerLength;
        let x1 = Math.floor(xPos);
        let x2 = Math.floor(xPos) + Math.floor(windowX / 12); // length of platform
        let y1 = windowY - 50;
        let y2 = windowY - 70; // displacement for fun and giggles

        floors[i] = new Boundary(sketch, x1, y1, x2, y2);
      }
      particle = new Particle(sketch, generateColors());
    };

    sketch.draw = () => {
      if (this.toggle) {
        // laser show is toggled
        sketch.clear();
        particle.update(sketch.mouseX, sketch.mouseY); // userControlled particle follows mouse.
        particle.show();
        particle.look(floors); // cast rays from particle
      } else {
        // laser show is not toggled
        sketch.clear();
      }
    };

    // Rerender canvas size on window resize. Also replaces the floors.
    function setSize() {
      windowX = window.innerWidth;
      windowY = window.innerHeight;

      sketch.resizeCanvas(windowX, windowY);

      for (let i = 0; i < floors.length; i++) {
        // recalculate laser floors (aka platforms where the particle is casting rays).
        const centerLength = windowX / 3;
        const xPos =
          (i + 1) * (centerLength / 4) - centerLength / 5 + centerLength;
        let x1 = Math.floor(xPos);
        let x2 = Math.floor(xPos) + Math.floor(windowX / 12); // length of platform
        let y1 = windowY - 50;
        let y2 = windowY - 70; // displacement for fun and giggles
        floors[i].updateLocation(x1, x2, y1, y2);
      }
    }

    function generateColors() {
      const output = [];
      while (output.length < 4) {
        const r = sketch.random(0, 255);
        const g = sketch.random(0, 255);
        const b = sketch.random(0, 255);
        output.push(sketch.color(r, g, b));
      }
      return output;
    }

    window.addEventListener("mousedown", (e) => {
      particle = new Particle(sketch, generateColors());
    });

    window.addEventListener("resize", setSize);
  };
}
