if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/pwa/sw.js")
      .then((reg) => console.log("SW registered ➜ scope:", reg.scope))
      .catch((err) => console.warn("SW failed:", err));
  });
}
// .register("/public/pwa/sw.js")
