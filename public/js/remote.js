$(document).ready(function () {
  // Simulasi loading video
  setTimeout(function () {
    $("#loadingOverlay").addClass("hidden");
    // Di implementasi nyata, ini akan menjadi stream video dari drone
    $("#video").html(
      '<source src="https://assets.codepen.io/2362/city-drone.mp4" type="video/mp4">'
    );
  }, 2000);

  // --- Fungsi Full Screen yang Kompatibel ---
  $("#fullscreenToggleBtn, #fullscreenBtn").click(function () {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  // Handler untuk perangkat mobile, sembunyikan overlay rotate saat dalam landscape
  function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
      $("#rotateOverlay").removeClass("hidden");
    } else {
      $("#rotateOverlay").addClass("hidden");
    }
  }

  $(window).on("resize load", checkOrientation);

  // --- Fungsi untuk Mengubah Warna Status Bar ---
  function updateStatusBar(rc, ping, gps) {
    // RC
    let rcColorClass = "";
    if (rc >= 80) {
      rcColorClass = "green";
    } else if (rc >= 50) {
      rcColorClass = "yellow";
    } else if (rc >= 10) {
      rcColorClass = "red";
    } else {
      $("#rcSignal").text("RC: DIED");
      rcColorClass = "red";
    }
    if (rc >= 10) {
      $("#rcSignal").text("RC: " + rc + "%");
    }
    $("#rcStatusItem").removeClass("green yellow red").addClass(rcColorClass);

    // Ping
    let pingColorClass = "";
    if (ping <= 60) {
      pingColorClass = "green";
    } else if (ping <= 130) {
      pingColorClass = "yellow";
    } else {
      pingColorClass = "red";
    }
    $("#pingStatus").text("Ping: " + ping + "ms");
    $("#pingStatusItem")
      .removeClass("green yellow red")
      .addClass(pingColorClass);

    // GPS
    let gpsColorClass = "";
    if (gps >= 8) {
      gpsColorClass = "green";
    } else if (gps >= 4) {
      gpsColorClass = "yellow";
    } else {
      gpsColorClass = "red";
    }
    $("#gpsStatus").text("GPS: " + gps + "/10");
    $("#gpsStatusItem").removeClass("green yellow red").addClass(gpsColorClass);
  }

  // --- Fungsi untuk Mengubah Bar Level ---
  function updateLevelBar(value, maxValue, elementId) {
    const fillElement = $(`#${elementId}`);
    const percentage = (value / maxValue) * 100;
    fillElement.css("width", percentage + "%");

    let color = "var(--success-color)";
    if (percentage < 50 && percentage >= 20) {
      color = "var(--warning-color)";
    } else if (percentage < 20) {
      color = "var(--danger-color)";
    }
    fillElement.css("background-color", color);
  }

  // Simulasi perubahan status secara berkala
  setInterval(function () {
    // Data dummy
    const battery = Math.max(10, Math.floor(Math.random() * 100) - 2);
    const altitude = Math.floor(Math.random() * 200);
    const speed = Math.floor(Math.random() * 50);
    const distance = Math.floor(Math.random() * 500);
    const rcSignal = Math.floor(Math.random() * 100);
    const ping = Math.floor(Math.random() * 150) + 10;
    const gps = Math.floor(Math.random() * 10) + 1;
    const lat = -6.175392 + (Math.random() * 0.005 - 0.0025);
    const lon = 106.827153 + (Math.random() * 0.005 - 0.0025);

    // Update status bar
    updateStatusBar(rcSignal, ping, gps);

    // Update status display dengan bar level
    $("#batteryValue").text(battery + "%");
    updateLevelBar(battery, 100, "batteryLevel");

    $("#altitudeValue").text(altitude + "m");
    updateLevelBar(altitude, 200, "altitudeLevel");

    $("#speedValue").text(speed + "km/j");
    updateLevelBar(speed, 50, "speedLevel");

    $("#distanceValue").text(distance + "m");
    updateLevelBar(distance, 500, "distanceLevel");

    // Update koordinat di header panel
    $("#latValue").text(lat.toFixed(6));
    $("#lonValue").text(lon.toFixed(6));
    $("#altValue").text(altitude + "m");
  }, 3000);

  // --- Kontrol Kamera ---
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

  // --- Fungsi Minimize / Maximize Panel ---
  $(".minimize-btn").on("click", function () {
    const targetId = $(this).data("target");
    const panel = $(targetId);
    const panelBody = panel.find(".panel-body");

    // Toggle kelas hidden pada panel body
    panelBody.toggleClass("hidden");

    // Toggle kelas minimized pada panel utama
    panel.toggleClass("minimized");

    // Ubah ikon tombol
    const icon = $(this).find("i");
    if (panel.hasClass("minimized")) {
      icon.removeClass("fa-minus").addClass("fa-plus");
    } else {
      icon.removeClass("fa-plus").addClass("fa-minus");
    }
  });

  // Variabel global untuk menyimpan koordinat
  let waypointCoords = { latitude: null, longitude: null };
  let rthCoords = { latitude: null, longitude: null };

  // Fungsi kontrol drone
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
      alert("Koordinat RTH belum diatur! Silakan atur di menu pengaturan.");
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
      alert(
        "Mode Waypoint diaktifkan, tetapi koordinat waypoint belum diatur! Silakan atur di menu pengaturan."
      );
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

  // Handler untuk settingsBtn
  $("#settingsBtn").click(function () {
    $("#settingsModal").modal("show");
  });

  // Handler untuk submit pengaturan koordinat
  $("#settingsForm").on("submit", function (e) {
    e.preventDefault();
    const waypointLat = $("#waypointLat").val();
    const waypointLon = $("#waypointLon").val();
    const rthLat = $("#rthLat").val();
    const rthLon = $("#rthLon").val();

    if (
      waypointLat &&
      waypointLon &&
      !isNaN(waypointLat) &&
      !isNaN(waypointLon)
    ) {
      waypointCoords.latitude = parseFloat(waypointLat);
      waypointCoords.longitude = parseFloat(waypointLon);
      alert(
        `Koordinat Waypoint diatur: Lat ${waypointCoords.latitude}, Lon ${waypointCoords.longitude}`
      );
    } else if (waypointLat || waypointLon) {
      alert("Masukkan koordinat Waypoint yang valid (Latitude dan Longitude)!");
      return;
    }

    if (rthLat && rthLon && !isNaN(rthLat) && !isNaN(rthLon)) {
      rthCoords.latitude = parseFloat(rthLat);
      rthCoords.longitude = parseFloat(rthLon);
      alert(
        `Koordinat RTH diatur: Lat ${rthCoords.latitude}, Lon ${rthCoords.longitude}`
      );
    } else if (rthLat || rthLon) {
      alert("Masukkan koordinat RTH yang valid (Latitude dan Longitude)!");
      return;
    }

    $("#settingsModal").modal("hide");
  });

  // === Kontrol Joystick (multi-touch + bounce effect) ===
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

    // Mouse events
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

    // Touch events
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

  // Cegah pinch zoom (khusus iOS Safari & Android)
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());
  document.addEventListener("gestureend", (e) => e.preventDefault());
});
