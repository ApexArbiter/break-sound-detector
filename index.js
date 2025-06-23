import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

const app = express();
const upload = multer();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post(
  "/compare-audio",
  upload.fields([
    { name: "reference_audio", maxCount: 1 },
    { name: "user_audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.reference_audio || !req.files.user_audio) {
        return res
          .status(400)
          .json({
            error: "Both reference_audio and user_audio files are required",
          });
      }

      const formData = new FormData();
      formData.append("reference_audio", req.files.reference_audio[0].buffer, {
        filename: req.files.reference_audio[0].originalname,
        contentType: "audio/wav",
      });
      formData.append("user_audio", req.files.user_audio[0].buffer, {
        filename: req.files.user_audio[0].originalname,
        contentType: "audio/wav",
      });

      // Make sure this URL is accessible from the internet
      const response = await axios.post(
        "http://192.168.18.46:8000/compare-audio/",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 25000, // 25 seconds timeout (Vercel has 30s limit)
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Export the app for Vercel
export default app;
