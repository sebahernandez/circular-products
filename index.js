const images = [
  "./images/img_01.png",
  "./images/img_02.png",
  "./images/img_03.png",
  "./images/img_04.png",
  "./images/img_05.png",
  "./images/img_06.png",
];

let currentIndex = 0;
const orbitElements = [
  document.getElementById("img1"),
  document.getElementById("img2"),
  document.getElementById("img3"),
  document.getElementById("img4"),
  document.getElementById("img5"),
  document.getElementById("img6"),
  document.getElementById("img7"),
  document.getElementById("img8"),
  document.getElementById("img9"),
];

const centerImage = document.querySelector("#centerImage img");
const orbitPath = document.querySelector(".orbit-path");
const orbitContainer = document.getElementById("orbitContainer");
const radius = 300; // Radio más grande para mayor distancia
const center = 350; // Centro ajustado al nuevo tamaño del contenedor
let rotationAngle = 0;

// Initialize positions for orbit elements
let orbitalPositions = [];

function initOrbitalPositions() {
  // Calculate the initial positions of orbit elements

  // Calculate the initial positions of orbit elements
  orbitalPositions = [];
  for (let i = 0; i < orbitElements.length; i++) {
    // Distribute elements evenly around the full circle (360 degrees or 2π radians)
    const angle = (i / orbitElements.length) * 2 * Math.PI;
    const x = Math.cos(angle) * radius + center - 60; // Ajustado para el nuevo tamaño (120px/2)
    const y = Math.sin(angle) * radius + center - 60;

    orbitalPositions.push({ x, y });

    // Forzar reflow para aplicar los cambios sin transición
    void orbitElements[i].offsetWidth;

    // Add click event to each orbit element
    orbitElements[i].addEventListener("click", function () {
      // Calculate how many steps to rotate to bring this element to the center
      const steps = i === 0 ? 0 : orbitElements.length - i;

      // Rotate that many steps
      for (let j = 0; j < steps; j++) {
        rotate(1);
      }
    });
  }
}

function renderOrbitImages() {
  // Ensure positions are initialized
  if (orbitalPositions.length === 0) {
    initOrbitalPositions();
  }

  for (let i = 0; i < orbitElements.length; i++) {
    // Get position from array
    const pos = orbitalPositions[i];

    // Position elements on their circular path and rotate them
    const img = orbitElements[i].querySelector("img");
    orbitElements[
      i
    ].style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${rotationAngle}deg)`;

    // Keep the images upright while the container rotates
    img.style.transform = `rotate(${-rotationAngle}deg)`;

    // Calculate image index for infinite rotation in both directions
    let relativeIndex = currentIndex + i;
    let imgIndex =
      ((relativeIndex % images.length) + images.length) % images.length;

    // Update image source
    img.src = images[imgIndex];
  }

  // Update center image with infinite rotation support
  let centerImgIndex =
    ((currentIndex % images.length) + images.length) % images.length;
  centerImage.src = images[centerImgIndex];
}

function rotate(direction) {
  // Update current index for infinite rotation
  currentIndex += direction;

  // Calculate rotation angle increment for smooth animation
  const angleIncrement = direction * (360 / orbitElements.length);
  rotationAngle += angleIncrement;

  // Keep rotationAngle in a reasonable range
  if (Math.abs(rotationAngle) > 3600) {
    rotationAngle = rotationAngle % 360;
  }

  // Apply smooth rotation transform to orbit elements
  orbitPath.style.transform = `rotate(${rotationAngle}deg)`;
  orbitContainer.style.transform = `rotate(${rotationAngle}deg)`;

  renderOrbitImages();
}

// Auto rotation variables
let isAnimating = false;
let rotationSpeed = 300; // milliseconds between rotations (slower, more pausado)
let isButtonHeld = false;
let rotationDirection = 0;
let animationFrameId = null;
let lastRotationTime = 0;

// Setup button event listeners for continuous rotation
function setupButtonListeners() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Previous button - rotate left
  prevBtn.addEventListener("mousedown", () => {
    isButtonHeld = true;
    rotationDirection = -1;
    rotate(rotationDirection);
    startAutoRotation();
  });

  // Next button - rotate right
  nextBtn.addEventListener("mousedown", () => {
    isButtonHeld = true;
    rotationDirection = 1;
    rotate(rotationDirection);
    startAutoRotation();
  });

  // Stop auto-rotation when button is released
  document.addEventListener("mouseup", () => {
    stopAutoRotation();
  });

  // Ensure rotation stops if mouse leaves the window
  document.addEventListener("mouseleave", () => {
    stopAutoRotation();
  });

  // Simple click handlers for mobile
  prevBtn.addEventListener("click", () => {
    if (!isButtonHeld) {
      rotate(-1);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!isButtonHeld) {
      rotate(1);
    }
  });

  // Touch support for mobile
  prevBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isButtonHeld = true;
    rotationDirection = -1;
    rotate(rotationDirection);
    startAutoRotation();
  });

  nextBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isButtonHeld = true;
    rotationDirection = 1;
    rotate(rotationDirection);
    startAutoRotation();
  });

  document.addEventListener("touchend", () => {
    if (isButtonHeld) {
      isButtonHeld = false;
      stopAutoRotation();
    }
  });

  // Keyboard support for arrow keys
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      rotate(-1);
    } else if (e.key === "ArrowRight") {
      rotate(1);
    }
  });
}

// Start auto rotation based on the current direction
function startAutoRotation() {
  if (isAnimating) return;

  isAnimating = true;
  lastRotationTime = performance.now();

  function smoothRotation(timestamp) {
    if (!isButtonHeld) {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
      return;
    }

    if (timestamp - lastRotationTime >= rotationSpeed) {
      rotate(rotationDirection);
      lastRotationTime = timestamp;
    }

    animationFrameId = requestAnimationFrame(smoothRotation);
  }

  animationFrameId = requestAnimationFrame(smoothRotation);
}

// Stop auto rotation
function stopAutoRotation() {
  isButtonHeld = false;
  isAnimating = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Initialize the orbital positions
initOrbitalPositions();
// Setup button listeners for continuous rotation
setupButtonListeners();
// Initial render of images
renderOrbitImages();
