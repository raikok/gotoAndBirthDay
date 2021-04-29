let walls = [];
let ray;
let particle;
console.log("raa");
const s = (sketch) => {
    console.log("!!1");
    sketch.setup = () => {
        console.log("run");
        let boundaryX = window.innerWidth;
        let boundaryY = window.innerHeight;
        sketch.createCanvas(boundaryX, boundaryY);
        for (let i = 0; i < 6; i++) {
            let x1 = sketch.random(boundaryX);
            let x2 = sketch.random(boundaryX);
            let y1 = sketch.random(boundaryY);
            let y2 = sketch.random(boundaryY);
            walls[i] = new Boundary(x1, y1, x2, y2);
        }
        particle = new Particle();
        ray = new Ray(100, 200);
    };
    sketch.draw = () => {
        console.log("ajiajijf");
        sketch.background(0);
        for (let wall of walls) {
            wall.show();
        }
        particle.update(sketch.mouseX, sketch.mouseY);
        particle.show();
        particle.look();
    };
};
//# sourceMappingURL=sketch.js.map