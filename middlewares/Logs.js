const Log = (setup = "semua") => {
  // Normalisasi setup ke huruf besar
  const allowedMethod = setup.toUpperCase();

  return (req, res, next) => {
    const method = req.method.toUpperCase();

    // Filter sesuai setup
    if (allowedMethod !== "SEMUA" && method !== allowedMethod) {
      return next(); // Lewati logging jika tidak sesuai
    }

    const hostname = req.hostname;
    const protocol = req.protocol;
    const path = req.path;

    let ipClient =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress;

    // Hilangkan "::ffff:" jika ada
    if (ipClient?.includes("::ffff:")) {
      ipClient = ipClient.replace("::ffff:", "");
    }

    // Format waktu lokal Indonesia
    const currentDate = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZoneName: "short",
    };
    const formattedDateTime = currentDate.toLocaleString("id-ID", options);

    const request = {
      path,
      ipClient,
      hostname,
      protocol,
      method,
      dateTime: formattedDateTime,
    };

    console.log("LOG REQUEST", request);
    req.log = request;

    next();
  };
};

module.exports = Log;
