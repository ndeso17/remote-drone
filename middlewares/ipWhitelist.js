const allowedIPs = ["127.0.0.1", "::1"]; // Tambah IP kamu jika perlu

const ipWhitelist = (req, res, next) => {
  const ipClient = req.ip || req.connection.remoteAddress;
  if (allowedIPs.includes(ipClient)) {
    return next();
  }

  console.warn(`🚫 Akses ditolak ke ${req.originalUrl} dari IP ${ipClient}`);
  return res.redirect("/"); // arahkan ke home
};

module.exports = ipWhitelist;
