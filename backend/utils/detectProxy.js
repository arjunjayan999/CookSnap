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
    const resp = await axios.post(`${DETECTOR_URL}/detect`, form, {
      headers,
      timeout: 20000,
    });
    return resp;
  } catch (err) {
    console.error("Detector offline, returning mock data:", err.message);
    // your mock detections
    const mockDetections = [
      {
        label: "eggplant",
        confidence: 0.8043,
        bbox: { x: 304.4, y: 85.88, w: 111.59, h: 329.15 },
      },
      {
        label: "eggplant",
        confidence: 0.7879,
        bbox: { x: 59.63, y: 193.45, w: 296.05, h: 196.1 },
      },
      {
        label: "eggplant",
        confidence: 0.3452,
        bbox: { x: 38.16, y: 0.74, w: 336.68, h: 162.85 },
      },
      {
        label: "banana",
        confidence: 0.2888,
        bbox: { x: 0, y: 49.01, w: 129.6, h: 167.85 },
      },
      {
        label: "chilli_pepper",
        confidence: 0.285,
        bbox: { x: 0.03, y: 280, w: 149.54, h: 136 },
      },
    ];

    return {
      mock: true,
      error: "DETECTOR_OFFLINE",
      message: "Detector service is not running. Returning mock detections.",
      detections: mockDetections,
    };
  }
}

module.exports = { proxyDetect };
