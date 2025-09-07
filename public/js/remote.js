$(document).ready(function () {
  // === VIDEO STREAM FIX + HLS SUPPORT ===
  const videoElement = document.getElementById("video");

  setTimeout(function () {
    $("#loadingOverlay").addClass("hidden");

    // URL HLS (ganti sesuai stream drone)
    const hlsUrl =
      "https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoElement.play().catch((err) => {
          console.warn("Autoplay blocked, user must interact:", err);
        });
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = hlsUrl;
      videoElement.addEventListener("loadedmetadata", function () {
        videoElement.play().catch((err) => {
          console.warn("Autoplay blocked, user must interact:", err);
        });
      });
    } else {
      videoElement.innerHTML =
        '<source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">';
      videoElement.load();
      videoElement.play().catch((err) => {
        console.warn("Autoplay blocked, user must interact:", err);
      });
    }
  }, 2000);

  // === FULLSCREEN TOGGLE ===
  $("#fullscreenToggleBtn, #fullscreenBtn").click(function () {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  });

  // === ORIENTATION CHECK ===
  function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
      $("#rotateOverlay").removeClass("hidden");
    } else {
      $("#rotateOverlay").addClass("hidden");
    }
  }
  $(window).on("resize load", checkOrientation);

  // === STATUS BAR FUNCTION ===
  function updateStatusBar(rc, ping, gps) {
    let rcColorClass = rc >= 80 ? "green" : rc >= 50 ? "yellow" : "red";
    $("#rcSignal").text(rc >= 10 ? `RC: ${rc}%` : "RC: DIED");
    $("#rcStatusItem").removeClass("green yellow red").addClass(rcColorClass);

    let pingColorClass = ping <= 60 ? "green" : ping <= 130 ? "yellow" : "red";
    $("#pingStatus").text("Ping: " + ping + "ms");
    $("#pingStatusItem")
      .removeClass("green yellow red")
      .addClass(pingColorClass);

    let gpsColorClass = gps >= 8 ? "green" : gps >= 4 ? "yellow" : "red";
    $("#gpsStatus").text("GPS: " + gps + "/10");
    $("#gpsStatusItem").removeClass("green yellow red").addClass(gpsColorClass);
  }

  // === BAR LEVEL FUNCTION ===
  function updateLevelBar(value, maxValue, elementId) {
    const fillElement = $(`#${elementId}`);
    const percentage = (value / maxValue) * 100;
    fillElement.css("width", percentage + "%");

    let color = "var(--success-color)";
    if (percentage < 50 && percentage >= 20) color = "var(--warning-color)";
    else if (percentage < 20) color = "var(--danger-color)";
    fillElement.css("background-color", color);
  }

  // === MQTT SUBSCRIBE UNTUK TELEMETRI ===
  const client = mqtt.connect("ws://192.168.18.9:9001"); // WebSocket broker

  client.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");
    client.subscribe("drone/telemetry");
  });

  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📥 Telemetry:", data);

      // Update status bar
      updateStatusBar(data.rcSignal, data.ping, 7); // GPS dummy

      // Update bar level
      $("#batteryValue").text(data.battery + "%");
      updateLevelBar(data.battery, 100, "batteryLevel");

      $("#altitudeValue").text(data.altitude + "m");
      updateLevelBar(data.altitude, 200, "altitudeLevel");

      $("#speedValue").text(data.speed + "km/j");
      updateLevelBar(data.speed, 50, "speedLevel");

      $("#distanceValue").text(data.distance + "m");
      updateLevelBar(data.distance, 500, "distanceLevel");

      // Update koordinat
      $("#latValue").text(data.latitude.toFixed(6));
      $("#lonValue").text(data.longitude.toFixed(6));
      $("#altValue").text(data.altitude + "m");
    } catch (err) {
      console.error("❌ Failed to parse telemetry:", err);
    }
  });

  // === KONTROL KAMERA ===
  let currentZoom = 1;

  $("#tiltControl").on("input", function () {
    $("#tiltValue").text($(this).val() + "°");
    console.log("Mengatur kemiringan kamera ke " + $(this).val() + "°");
  });

  $("#photoModeBtn").click(function () {
    alert("Mode Kamera: Foto");
  });

  $("#videoModeBtn").click(function () {
    alert("Mode Kamera: Video");
  });

  $("#zoomInBtn").click(function () {
    currentZoom = Math.min(3, currentZoom + 0.1);
    $("#video").css("transform", `scale(${currentZoom})`);
    console.log("Zoom In: " + currentZoom.toFixed(1));
  });

  $("#zoomOutBtn").click(function () {
    currentZoom = Math.max(1, currentZoom - 0.1);
    $("#video").css("transform", `scale(${currentZoom})`);
    console.log("Zoom Out: " + currentZoom.toFixed(1));
  });

  // === PANEL MINIMIZE / MAXIMIZE ===
  $(".minimize-btn").on("click", function () {
    const targetId = $(this).data("target");
    const panel = $(targetId);
    const panelBody = panel.find(".panel-body");

    panelBody.toggleClass("hidden");
    panel.toggleClass("minimized");

    const icon = $(this).find("i");
    if (panel.hasClass("minimized")) {
      icon.removeClass("fa-minus").addClass("fa-plus");
    } else {
      icon.removeClass("fa-plus").addClass("fa-minus");
    }
  });

  // === FLIGHT CONTROL ===
  let waypointCoords = { latitude: null, longitude: null };
  let rthCoords = { latitude: null, longitude: null };

  window.takeOff = function () {
    alert("Perintah Take Off dikirim!");
  };

  window.land = function () {
    alert("Perintah Land dikirim!");
  };

  window.returnHome = function () {
    if (rthCoords.latitude && rthCoords.longitude) {
      alert(
        `Perintah Return to Home dikirim ke koordinat: Lat ${rthCoords.latitude}, Lon ${rthCoords.longitude}!`
      );
    } else {
      alert("Koordinat RTH belum diatur!");
    }
  };

  window.emergencyStop = function () {
    if (confirm("Yakin melakukan Emergency Stop? Drone akan jatuh!")) {
      alert("Perintah Emergency Stop dikirim!");
    }
  };

  window.setFlightMode = function (button, mode) {
    $(".mode-btn").removeClass("active");
    $(button).addClass("active");
    $("#flightMode").text("Mode: " + getModeName(mode));
    if (
      mode === "waypoint" &&
      (!waypointCoords.latitude || !waypointCoords.longitude)
    ) {
      alert("Mode Waypoint diaktifkan, koordinat belum diatur!");
    } else {
      alert("Mode penerbangan diubah ke: " + getModeName(mode));
    }
  };

  function getModeName(mode) {
    const modes = {
      manual: "Manual",
      altitude: "Altitude Hold",
      gps: "GPS Hold",
      waypoint: "Waypoint",
    };
    return modes[mode] || mode;
  }

  // === SETTINGS MODAL ===
  $("#settingsBtn").click(function () {
    $("#settingsModal").modal("show");
  });

  $("#settingsForm").on("submit", function (e) {
    e.preventDefault();
    const waypointLat = $("#waypointLat").val();
    const waypointLon = $("#waypointLon").val();
    const rthLat = $("#rthLat").val();
    const rthLon = $("#rthLon").val();

    if (waypointLat && waypointLon) {
      waypointCoords.latitude = parseFloat(waypointLat);
      waypointCoords.longitude = parseFloat(waypointLon);
      alert(
        `Koordinat Waypoint diatur: Lat ${waypointCoords.latitude}, Lon ${waypointCoords.longitude}`
      );
    }

    if (rthLat && rthLon) {
      rthCoords.latitude = parseFloat(rthLat);
      rthCoords.longitude = parseFloat(rthLon);
      alert(
        `Koordinat RTH diatur: Lat ${rthCoords.latitude}, Lon ${rthCoords.longitude}`
      );
    }

    $("#settingsModal").modal("hide");
  });

  // === JOYSTICK CONTROL ===
  const joystickValues = {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  };

  $(".joystick").each(function (index) {
    const $joystick = $(this);
    const $handle = $joystick.find(".joystick-handle");
    const radius = $joystick.width() / 2;
    const handleRadius = $handle.width() / 2;
    const center = { x: radius, y: radius };

    let active = false;
    let touchId = null;
    const side = index === 0 ? "left" : "right";

    function setHandle(x, y) {
      $handle.removeClass("returning");

      const dx = x - center.x;
      const dy = y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > radius - handleRadius) {
        const angle = Math.atan2(dy, dx);
        x = center.x + Math.cos(angle) * (radius - handleRadius);
        y = center.y + Math.sin(angle) * (radius - handleRadius);
      }

      $handle.css({
        left: x - handleRadius + "px",
        top: y - handleRadius + "px",
      });

      const normX = (x - center.x) / (radius - handleRadius);
      const normY = (y - center.y) / (radius - handleRadius);
      joystickValues[side] = { x: normX, y: normY };

      console.log(`Joystick ${side}:`, normX.toFixed(2), normY.toFixed(2));
    }

    function resetHandle() {
      $handle.addClass("returning");
      $handle.css({
        left: center.x - handleRadius + "px",
        top: center.y - handleRadius + "px",
      });
      joystickValues[side] = { x: 0, y: 0 };

      setTimeout(() => {
        $handle.removeClass("returning");
      }, 300);
    }

    $joystick.on("mousedown", function (e) {
      active = true;
      e.preventDefault();
      setHandle(e.offsetX, e.offsetY);
    });

    $(document).on("mousemove", function (e) {
      if (active) {
        e.preventDefault();
        const offset = $joystick.offset();
        setHandle(e.pageX - offset.left, e.pageY - offset.top);
      }
    });

    $(document).on("mouseup", function () {
      if (active) {
        active = false;
        resetHandle();
      }
    });

    $joystick.on("touchstart", function (e) {
      e.preventDefault();
      if (!active) {
        const touch = e.originalEvent.changedTouches[0];
        touchId = touch.identifier;
        active = true;
        const offset = $joystick.offset();
        setHandle(touch.pageX - offset.left, touch.pageY - offset.top);
      }
    });

    $joystick.on("touchmove", function (e) {
      e.preventDefault();
      if (active && touchId !== null) {
        const touches = e.originalEvent.touches;
        for (let i = 0; i < touches.length; i++) {
          if (touches[i].identifier === touchId) {
            const offset = $joystick.offset();
            setHandle(
              touches[i].pageX - offset.left,
              touches[i].pageY - offset.top
            );
            break;
          }
        }
      }
    });

    $joystick.on("touchend touchcancel", function (e) {
      e.preventDefault();
      if (active && touchId !== null) {
        const changedTouches = e.originalEvent.changedTouches;
        for (let i = 0; i < changedTouches.length; i++) {
          if (changedTouches[i].identifier === touchId) {
            active = false;
            touchId = null;
            resetHandle();
            break;
          }
        }
      }
    });

    resetHandle();
  });

  // === PREVENT PINCH ZOOM ===
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());
  document.addEventListener("gestureend", (e) => e.preventDefault());
});
