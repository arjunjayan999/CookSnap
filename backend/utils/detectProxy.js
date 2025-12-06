const axios = require("axios");
const FormData = require("form-data");

const DETECTOR_URL = process.env.DETECTOR_URL || "http://localhost:8000";

async function proxyDetect(file) {
  const form = new FormData();
  form.append("image", file.buffer, {
    filename: file.originalname || "upload.jpg",
    contentType: file.mimetype || "application/octet-stream",
  });

  const headers = form.getHeaders();
  try {
    const resp = await axios.post(`${process.env.DETECTOR_URL}/detect`, form, {
      headers,
      timeout: 20000,
    });
    return resp;
  } catch (err) {
    console.error("Error proxying to detector:", err.message);

    return { data: { detections: [] } };
  }
}

module.exports = { proxyDetect };
