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
  orbitalPositions = [];

  const totalElements = orbitElements.length;

  for (let i = 0; i < totalElements; i++) {
    // Calcular el ángulo para este elemento, comenzando desde arriba (-90 grados o -PI/2)
    const angle = (i / totalElements) * 2 * Math.PI - Math.PI / 2;

    // Calcular coordenadas X e Y basadas en ese ángulo
    const x = Math.cos(angle) * radius + center - 60;
    const y = Math.sin(angle) * radius + center - 60;

    orbitalPositions.push({ x, y });

    // Inicializar las imágenes una sola vez, asegurando una distribución uniforme
    const img = orbitElements[i].querySelector("img");
    const imgIndex = i % images.length;
    img.src = images[imgIndex];

    // Add click event to each orbit element
    orbitElements[i].addEventListener("click", function () {
      // Calculate which image is at this position
      const clickedImageIndex = imgIndex;

      // If this image is already centered, do nothing
      if (clickedImageIndex === currentIndex) {
        return;
      }

      // Calculate the shortest path to rotate to this image (clockwise or counterclockwise)
      let stepsToMove;
      if (clickedImageIndex > currentIndex) {
        const clockwiseSteps = clickedImageIndex - currentIndex;
        const counterClockwiseSteps =
          currentIndex + images.length - clickedImageIndex;
        stepsToMove =
          clockwiseSteps <= counterClockwiseSteps
            ? clockwiseSteps
            : -counterClockwiseSteps;
      } else {
        const counterClockwiseSteps = currentIndex - clickedImageIndex;
        const clockwiseSteps = clickedImageIndex + images.length - currentIndex;
        stepsToMove =
          clockwiseSteps <= counterClockwiseSteps
            ? clockwiseSteps
            : -counterClockwiseSteps;
      }

      // Rotate in the appropriate direction the required number of steps
      const direction = stepsToMove > 0 ? 1 : -1;
      const steps = Math.abs(stepsToMove);

      // Apply the rotation steps one by one with a delay between each
      for (let j = 0; j < steps; j++) {
        setTimeout(() => {
          rotate(direction);
        }, j * 300); // 300ms delay between each step
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
    orbitElements[i].style.transform = `translate(${pos.x}px, ${pos.y}px)`;

    // Las imágenes mantienen su posición vertical
    img.style.transform = `rotate(${-rotationAngle}deg)`;

    // Calculate which image should be shown at this orbital position
    // This ensures images are evenly distributed and synchronized with rotation
    const imageOffset =
      Math.floor(rotationAngle / (360 / images.length)) % images.length;
    const imgIndex =
      (((i + imageOffset) % images.length) + images.length) % images.length;
    img.src = images[imgIndex];
  }

  // Actualizar la imagen central
  centerImage.src = images[currentIndex];
}

function rotate(direction) {
  // Start fade out animation for center image
  const centerImageContainer = document.getElementById("centerImage");
  centerImageContainer.classList.add("fade-out");

  // Calculate how much we should rotate based on the number of images, not orbital elements
  // This ensures we rotate to show each image instead of skipping
  const angleStep = ((2 * Math.PI) / images.length) * direction;
  rotationAngle += angleStep * (180 / Math.PI); // Convertir radianes a grados

  // Actualizar el índice actual y asegurar que siempre esté dentro del rango válido
  if (direction > 0) {
    currentIndex = (currentIndex + 1) % images.length;
  } else {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  // Aplicar las transformaciones de rotación
  orbitPath.style.transform = `rotate(${rotationAngle}deg)`;
  orbitContainer.style.transform = `rotate(${rotationAngle}deg)`;

  // Update all orbit images
  renderOrbitImages();

  // After the rotation has started, update the center image with fade in
  setTimeout(() => {
    centerImage.src = images[currentIndex];
    centerImageContainer.classList.remove("fade-out");
    centerImageContainer.classList.add("fade-in");

    // Remove the fade-in class after animation completes
    setTimeout(() => {
      centerImageContainer.classList.remove("fade-in");
    }, 400);
  }, 200);
}

// Auto rotation variables
let isAnimating = false;
let rotationSpeed = 800; // milliseconds between rotations (slower to allow for smoother transitions)
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

  // Simple click handlers for mobile y desktop
  prevBtn.addEventListener("click", () => {
    if (!isAnimating) {
      rotate(-1);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!isAnimating) {
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

    // Only rotate if enough time has passed to complete previous rotation
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
