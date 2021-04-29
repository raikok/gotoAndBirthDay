import p5 from "p5";
import { Boundary } from "../../js/lightshow/boundary";
import { randomParticle } from "../../js/lightshow/randomParticle";

/**
 * P5 canvas of a particle that is automatically (randomly) moved around the canvas borders
 * Also includes floors that have colorful rays cast onto them.
 * Colors of rays change on mouse click.
 */
export class automaticLasers {
  side: String; // which side the canvas is placed on
  toggle: boolean;

  constructor(toggle: boolean, side: String) {
    this.toggle = toggle;
    this.side = side;
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
    let particle: randomParticle;

    sketch.setup = () => {
      const renderer = sketch.createCanvas(windowX, windowY);
      renderer.parent("canvases");

      // The following coordinates are used when placing the particles
      // for the first time and keeping them in their bounds when moving about.
      let startX: number; // left x-coordinate of the canvas (border).
      let finishX: number; // right x-coordinate of the movable area (border).

      // placement of automated particle's floors (aka platforms where the particle is casting rays)
      for (let i = 0; i < 4; i++) {
        let xPos;
        if (this.side === "left") {
          const wholeLength = windowX / 3;
          xPos = (i + 1) * (wholeLength / 4) - wholeLength / 5;
        } else {
          const wholeLength = windowX / 3;
          xPos =
            (i + 1) * (wholeLength / 4) - wholeLength / 5 + wholeLength * 2;
        }
        if (i === 0) {
          startX = Math.floor(xPos);
        }
        let x1 = Math.floor(xPos);
        if (i === 3) {
          finishX = Math.floor(xPos) + Math.floor(windowX / 12);
        }
        let x2 = Math.floor(xPos) + Math.floor(windowX / 12); // length of platform
        let y1 = windowY - 70;
        let y2 = windowY - 50; // displacement for fun and giggles

        floors[i] = new Boundary(sketch, x1, y1, x2, y2);
      }
      particle = new randomParticle(
        sketch,
        generateColors(),
        [startX + 150, 300],
        [startX, finishX, windowY]
      );
    };

    sketch.draw = () => {
      if (this.toggle) {
        // laser show is toggled
        sketch.clear();
        particle.update(); // randomParticle moves about on it's own, this is the function that makes it move.
        particle.show();
        particle.look(floors); // cast rays from particle onto floors
      } else {
        // laser show is not toggled
        sketch.clear();
      }
    };

    // Rerender canvas size on window resize. Also replaces the floors.
    const setSize = () => {
      windowX = window.innerWidth;
      windowY = window.innerHeight;

      sketch.resizeCanvas(windowX, windowY);

      for (let i = 0; i < floors.length; i++) {
        // recalculate laser bases
        let xPos;
        if (this.side === "left") {
          const centerLength = windowX / 3;
          xPos = (i + 1) * (centerLength / 4) - centerLength / 5; // left side gets placed in the beginning
        } else {
          const centerLength = windowX / 3;
          xPos =
            (i + 1) * (centerLength / 4) - centerLength / 5 + centerLength * 2; // right side gets placed in the end
        }
        let x1 = Math.floor(xPos);
        let x2 = Math.floor(xPos) + Math.floor(windowX / 12); // length of platform
        let y1 = windowY - 70;
        let y2 = windowY - 50; // displacement for fun and giggles
        floors[i].updateLocation(x1, x2, y1, y2);
      }
    };

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
      particle.updateColors(generateColors());
    });

    window.addEventListener("resize", setSize);
  };
}
