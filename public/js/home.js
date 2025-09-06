const video = document.getElementById("video");
const themeToggle = document.getElementById("theme-toggle");
const telemetryData = {
  battery: document.getElementById("battery-data"),
  altitude: document.getElementById("altitude-data"),
  speed: document.getElementById("speed-data"),
  distance: document.getElementById("distance-data"),
  latitude: document.getElementById("latitude-data"),
  longitude: document.getElementById("longitude-data"),
  gpsAltitude: document.getElementById("gps-altitude-data"),
};
const photoBtn = document.getElementById("photoBtn");
const videoBtn = document.getElementById("videoBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");

// Simulasi Video Stream
function startVideoStream() {
  // Menggunakan URL video placeholder
  video.src = "https://assets.codepen.io/2362/city-drone.mp4";
  video.play();
}

// Fungsi untuk mengupdate data telemetri secara berkala
function updateTelemetry() {
  const battery = Math.floor(Math.random() * 100) + 1;
  const altitude = Math.floor(Math.random() * 200) + 10;
  const speed = Math.floor(Math.random() * 50) + 5;
  const distance = Math.floor(Math.random() * 500) + 20;
  const latitude = -6.175392 + (Math.random() * 0.005 - 0.0025);
  const longitude = 106.827153 + (Math.random() * 0.005 - 0.0025);
  const gpsAltitude = Math.floor(Math.random() * 150) + 5;

  telemetryData.battery.querySelector(
    "div:last-child"
  ).textContent = `${battery}%`;
  telemetryData.altitude.querySelector(
    "div:last-child"
  ).textContent = `${altitude} m`;
  telemetryData.speed.querySelector(
    "div:last-child"
  ).textContent = `${speed} km/j`;
  telemetryData.distance.querySelector(
    "div:last-child"
  ).textContent = `${distance} m`;
  telemetryData.latitude.querySelector(
    "div:last-child"
  ).textContent = `${latitude.toFixed(6)}`;
  telemetryData.longitude.querySelector(
    "div:last-child"
  ).textContent = `${longitude.toFixed(6)}`;
  telemetryData.gpsAltitude.querySelector(
    "div:last-child"
  ).textContent = `${gpsAltitude} m`;

  // Atur warna latar belakang berdasarkan nilai
  telemetryData.battery.style.backgroundColor = getStatusColor(battery, 50, 20);
  telemetryData.altitude.style.backgroundColor = getStatusColor(
    altitude,
    100,
    50
  );
  telemetryData.speed.style.backgroundColor = getStatusColor(speed, 30, 15);
  telemetryData.distance.style.backgroundColor = getStatusColor(
    distance,
    400,
    100
  );
}

function getStatusColor(value, high, low) {
  if (value > high) return "var(--success-color)";
  if (value > low) return "var(--warning-color)";
  return "var(--danger-color)";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  startVideoStream();
  setInterval(updateTelemetry, 3000);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

photoBtn.addEventListener("click", () => {
  alert("Perintah ambil foto dikirim!");
});

videoBtn.addEventListener("click", () => {
  alert("Perintah rekam video dikirim!");
});

zoomInBtn.addEventListener("click", () => {
  alert("Perintah zoom in dikirim!");
});

zoomOutBtn.addEventListener("click", () => {
  alert("Perintah zoom out dikirim!");
});
