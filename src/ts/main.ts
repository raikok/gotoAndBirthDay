import gsap from "gsap";

import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { userControlledLasers } from "./lightshow/userControlled";
import { automaticLasers } from "./lightshow/automaticLasers";
gsap.registerPlugin(DrawSVGPlugin);


window.addEventListener('touchmove', function() {}) // prevent touch devices from scrolling


const textFireworkArray = Array.from(
  // Fireworks that make up the congratulations phrase "Palju onne synnipaevaks!".
  document.getElementsByClassName("fireworkText")
);
const otherFireworkArray = Array.from(
  // Fireworks that fire after showing the congratulations (the loop).
  document.getElementsByClassName("firework")
);
const masks = Array.from(document.getElementsByClassName("mask")); // Masks that hide the congratulations.
document.addEventListener("click", fireRocket);

const mainTimeline = gsap
  .timeline()
  .from("#background_buildings", { y: +150, duration: 2 })
  .from("#foreground_buildings", { y: +100, duration: 2, stagger: 1 }, "-=1.5")
  .add(animateText())
  .addLabel("showButton")
  .add(showButton(), "showButton")
  .addLabel("looping")
  .add(loopFireworks(), "-=2")
  .add(animateSignature());

/*

  Timeline functions

*/

function loopFireworks() {
  const timeline = gsap.timeline({ repeat: -1 });
  timeline.data = "loopFireworks";

  timeline.eventCallback("onRepeat", () => { // When a loop has completed, check if toggle value has changed.
    if (toggle) {
      // If the laser show has activated, pause the fireworks show.
      timeline.pause();
    }
  });

  for (let firework of otherFireworkArray) {
    let fireworkAndShadowArray: Array<Object>;
    if (firework) {
      fireworkAndShadowArray = Array.from(firework.children);
    }
    if (fireworkAndShadowArray) {
      timeline.add(
        animateFirework(
          fireworkAndShadowArray[0], // the sparkles
          fireworkAndShadowArray[1], // the shadow
          fireworkAndShadowArray[2] // the tracer
        ),
        "<" + (Math.random() * 2 - 1) // random timing on each page refresh
      );
    }
  }

  return timeline;
}

function animateText() {
  // Draws the congratulations
  const timelineTextAndFireworks = gsap.timeline({ delay: 0 });

  for (let mask of masks) {
    // hide the masks in the beggining of main timeline.
    gsap.set("#" + mask.id, { scale: 0 });
  }

  const tracer = document.getElementById("tracer1");
  timelineTextAndFireworks.add(createTracer(tracer), 0);

  let i = 0; // Used when selecting the appropriate firework of the mask that is being removed.
  //Also for checking if it is the first loop (placing tracer).
  for (let mask of masks) {
    let fireworkAndShadowArray: Array<Object>;
    if (textFireworkArray[i]) {
      fireworkAndShadowArray = Array.from(textFireworkArray[i].children); // get firework and shadow
    }
    if (fireworkAndShadowArray) {
      let delay: number;
      i === 0 ? (delay = 0.5) : (delay = 0);
      timelineTextAndFireworks
        .add(
          animateTextFirework(
            fireworkAndShadowArray[0], // the sparkles
            fireworkAndShadowArray[1] // the shadow
          ),
          "<" + delay
        )
        .to(
          "#" + mask.id,
          { duration: 0.2, scale: 1, stagger: 0.5, transformOrigin: "center" }, // enlarging masks makes the underlying letters appear
          "<0.2"
        );
    }
    i++;
  }
  return timelineTextAndFireworks;
}
/**
 * Main function for animating a tracer (rocket) flying up and the
 * rocket (firework) exploding leaving
 * behind a shadow that dissipates as well.
 * @param firework DOM firework object
 * @param shadow DOM shadow object
 * @param tracer DOM tracer object
 * @returns Timeline of firework and tracer animating.
 */
function animateFirework(
  firework: object,
  shadow: object,
  tracer: object
): TimelineLite {
  const timeline = gsap.timeline();

  timeline
    .add(createTracer(tracer), 0)
    .add(animateTextFirework(firework, shadow), 0.5);

  return timeline;
}

/**
 * Animates a tracer flying up (or a rocket, whatever).
 * @param tracer DOM tracer object.
 * @returns Timeline of a tracer
 */
function createTracer(tracer: object): TimelineLite {
  const timeline = gsap.timeline();

  timeline
    .from(tracer, { y: 800, duration: 0.4, ease: "power4.out" }, 0)
    .to(tracer, { opacity: 1, duration: 0.1 }, 0)
    .to(tracer, { opacity: 0.4, duration: 0.2 }, 0.1)
    .to(tracer, { opacity: 0, duration: 0.1 }, 0.3);

  return timeline;
}

/**
 * Animates just the sparkles and the shadow behind of the firework.
 * @param firework DOM firework object
 * @param shadow DOM shadow object
 * @returns Timeline of the firework animating.
 */
function animateTextFirework(firework: object, shadow: object): TimelineLite {
  const timeline = gsap.timeline();

  timeline
    .to(firework, {
      backgroundPosition: "-9216px 0px", // png manipulation
      ease: "steps(18)",
      duration: 1.2,
    })

    // Opacity control for firework (starts hidden and fades out).
    .to(firework, { opacity: 1 }, 0)
    .to(firework, { opacity: 0.8, duration: 0.5 }, 0)
    .to(firework, { opacity: 0, duration: 0.7 }, 0.5)

    .to(
      shadow,
      {
        scale: 2.5,
        ease: "power4.out",
        duration: 1.5,
      },
      0
    )

    // Opacity control for shadow (same as firework).
    .to(shadow, { opacity: 1 }, 0)
    .to(shadow, { opacity: 0.8, duration: 0.4 }, 0)
    .to(shadow, { opacity: 0, duration: 1 }, 0.7)

    .to("#background_buildings", { fill: "#1A1818" }, 0.0) // background buildings get lit up
    .to("#background_buildings", { duration: 0.8, fill: "#141313" }, 0.1) // and go back to normal
    .to("#lit_up_background", { opacity: 1 }, 0)
    .to("#lit_up_background", { duration: 0.1, opacity: 0.4 }, 0.1)
    .to("#lit_up_background", { duration: 0.5, opacity: 0 }, 0.2);

  return timeline;
}

/**
 * Creates the signature with the phrase "Soovib Raiko Kittus".
 * @returns Timeline of signature animating.
 */
function animateSignature() {
  const timeline = gsap.timeline();

  // Only thing done here is basically drawing svg path from 0% to 100%;
  timeline
    .fromTo(
      "#soovib",
      { drawSVG: "0% 0%" },
      { duration: 4, drawSVG: "100% 0%", ease: "power1.in" }
    )
    .fromTo(
      "#i-tapp-1",
      { drawSVG: "0% 0%" },
      { duration: 0.5, drawSVG: "100% 0%" }
    )
    .fromTo("#raiko", { drawSVG: "0% 0%" }, { duration: 3, drawSVG: "100% 0%" })
    .fromTo(
      "#i-tapp-2",
      { drawSVG: "0% 0%" },
      { duration: 0.2, drawSVG: "100% 0%" }
    )
    .fromTo(
      "#kittus",
      { drawSVG: "0% 0%" },
      { duration: 3, drawSVG: "100% 0%" }
    )
    .fromTo(
      "#tt-kriips",
      { drawSVG: "0% 0%" },
      { duration: 0.5, drawSVG: "100% 0%", ease: "power4.out" }
    )
    .fromTo(
      "#i-tapp-3",
      { drawSVG: "0% 0%" },
      { duration: 0.2, drawSVG: "100% 0%" }
    );

  return timeline;
}

/**
 * Listens to the keypress event. When event is fired, then a firework is created at
 * the cursor location.
 * @param event keypress event.
 */
function fireRocket(event: MouseEvent) {
  let fireworkObject: HTMLDivElement;
  /*
        Example firework in DOM:
          <div class="firework" id="fire10">
            <div class="big blue" id="blue10"></div>
            <div class="shadow blue" id="shadow10"></div>
            <div class="tracer" id="tracer10"></div>
          </div>
  */
  if (!isOnButton() && !toggle) {
    // Don't let user fire fireworks when he is hovering the toggle button or in the laser show mode.

    /*
      The following code creates an HTML element just like the one in the example below.

      Example firework in DOM:
        <div class="firework" id="fire10">
          <div class="big blue" id="blue10"></div>
          <div class="shadow blue" id="shadow10"></div>
          <div class="tracer" id="tracer10"></div>
        </div>
    */

    const newFireworkIndex = createFireworkIndex(); // parent div
    fireworkObject = document.createElement("div");
    fireworkObject.classList.add("firework");
    fireworkObject.id = "fire" + newFireworkIndex;
    fireworkObject.style.position = "absolute";
    // displacement so the firework shows up exactly at the mouse click
    fireworkObject.style.left = event.clientX - 250 + "px";
    fireworkObject.style.top = event.clientY + 23 + "px";

    const colors = ["yellow", "red", "blue", "green", "white", "colorful"]; // all the possible colors (these are classNames), if adding more colors, change this array.
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const sparkles = document.createElement("div"); // animation frames div
    sparkles.classList.add("big", randomColor);
    sparkles.id = randomColor + newFireworkIndex;

    const shadow = document.createElement("div"); // shadow div
    shadow.classList.add("shadow", randomColor);
    shadow.id = "shadow" + newFireworkIndex;

    const tracer = document.createElement("div"); // beggining tracer div
    tracer.classList.add("tracer");
    tracer.id = "tracer" + newFireworkIndex;

    // Appending everything to the parent DOM.
    fireworkObject.appendChild(sparkles);
    fireworkObject.appendChild(shadow);
    fireworkObject.appendChild(tracer);
    document.getElementById("firedRockets").appendChild(fireworkObject);

    animateFirework(sparkles, shadow, tracer).eventCallback(
      "onComplete",
      removeFirework
    ); // animate and remove from element from DOM if done so not to overclutter everything
  }

  function removeFirework() {
    document.getElementById("firedRockets").removeChild(fireworkObject);
  }

  function createFireworkIndex() {
    const array = document.getElementsByClassName("firework");
    return parseInt(array[array.length - 1].id.substring(4)) + 1; // gets class 'firework' last element's id (it's index) and increments by one.
  }

  function isOnButton() {
    var rect = document.getElementById("laser-btn").getBoundingClientRect();
    var x = event.clientX;
    if (x < rect.left || x >= rect.right) return false;
    var y = event.clientY;
    if (y < rect.top || y >= rect.bottom) return false;
    return true;
  }
}

/*

  Button handling

  */

let toggle = false;

const button = document.getElementById("laser-btn");

button.onclick = () => {
  button.classList.toggle("active");
  toggle = !toggle;
  updateToggles();
  if (!toggle) {
    // Used for resuming the looping animation. The pausing is done in loopFirework() function.
    mainTimeline.resume();
    for (let timeline of mainTimeline.getChildren(false, false, true)) {
      if (timeline.data === "loopFireworks") {
        timeline.resume();
      }
    }
  }
};

function showButton() {
  // Fade in button.
  return gsap.to("#laser-btn", { opacity: 1, duration: 3, ease: "power4.out" });
}

/*

  p5 Handling (Laser show)

*/

let userControlled = new userControlledLasers(toggle);
userControlled.getP5();

let automatic1 = new automaticLasers(toggle, "left");
automatic1.getP5();

let automatic2 = new automaticLasers(toggle, "right");
automatic2.getP5();

function updateToggles() {
  userControlled.setToggle();
  automatic1.setToggle();
  automatic2.setToggle();
}

/*window.addEventListener("resize", scaleFireworks);
function scaleFireworks() {
  const scale = window.devicePixelRatio;

  for (let element of document.getElementsByClassName("firework")) {
    const constant = 1;
    const size = (constant / scale);
    const resize = "scale(" + size + "," + size + ")";
    console.log(element.getAttribute("transform"));
    element.setAttribute("transform", resize);
    console.log(element.id);
    console.log(document.getElementById(element.id).getAttribute("tranform"));
  }
}
Wanted to implement zoom-out on chrome zoom in... didn't work.
*/