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

const droneId = "drone-1";

// === Fungsi update UI telemetry ===
function renderTelemetry(data) {
  if (data.battery)
    telemetryData.battery.querySelector("div:last-child").textContent =
      data.battery + "%";

  if (data.altitude)
    telemetryData.altitude.querySelector("div:last-child").textContent =
      data.altitude + " m";

  if (data.speed)
    telemetryData.speed.querySelector("div:last-child").textContent =
      data.speed + " km/j";

  if (data.distance)
    telemetryData.distance.querySelector("div:last-child").textContent =
      data.distance + " m";

  if (data.latitude)
    telemetryData.latitude.querySelector("div:last-child").textContent = Number(
      data.latitude
    ).toFixed(6);

  if (data.longitude)
    telemetryData.longitude.querySelector("div:last-child").textContent =
      Number(data.longitude).toFixed(6);

  if (data.gpsAltitude)
    telemetryData.gpsAltitude.querySelector("div:last-child").textContent =
      data.gpsAltitude + " m";
}

// === MQTT Client ===
function initMQTT() {
  const host = "ws://192.168.18.9:9001"; // alamat WebSocket broker
  const client = mqtt.connect(host);

  client.on("connect", () => {
    console.log("✅ MQTT Connected");
    client.subscribe(`drone/${droneId}/telemetry`);
  });

  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📥 MQTT Data:", data);
      renderTelemetry(data);
    } catch (err) {
      console.error("Gagal parse MQTT:", err);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT Error:", err);
  });
}

// === Video Stream dengan HLS ===
function startVideoStream() {
  const hlsUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // ganti dengan stream drone

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video
        .play()
        .catch((err) =>
          console.warn("Autoplay diblokir, butuh interaksi user:", err)
        );
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = hlsUrl;
    video.addEventListener("loadedmetadata", function () {
      video
        .play()
        .catch((err) =>
          console.warn("Autoplay diblokir, butuh interaksi user:", err)
        );
    });
  } else {
    // fallback ke mp4 lokal
    video.src = "https://www.w3schools.com/html/mov_bbb.mp4";
    video.play();
  }
}

// === Event Listeners ===
document.addEventListener("DOMContentLoaded", () => {
  startVideoStream();
  initMQTT(); // realtime telemetry
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
