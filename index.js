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

    // Inicializar las imágenes una sola vez, asegurando que se repitan cíclicamente
    const img = orbitElements[i].querySelector("img");
    const imgIndex = ((i % images.length) + images.length) % images.length;
    img.src = images[imgIndex];

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
    orbitElements[i].style.transform = `translate(${pos.x}px, ${pos.y}px)`;

    // Las imágenes mantienen su posición vertical
    img.style.transform = `rotate(${-rotationAngle}deg)`;
  }

  // Actualizar la imagen central - currentIndex ya está normalizado
  centerImage.src = images[currentIndex];
}

function rotate(direction) {
  // Actualizar el índice actual y asegurar que siempre esté dentro del rango válido
  if (direction > 0) {
    currentIndex = (currentIndex + 1) % images.length;
  } else {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  // Calculamos cuántos grados debemos rotar para llegar a la siguiente posición
  const angleStep = ((2 * Math.PI) / orbitElements.length) * direction;
  rotationAngle += angleStep * (180 / Math.PI); // Convertir radianes a grados

  // Aplicar las transformaciones de rotación
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
