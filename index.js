import express from "express"

const app = express()
import multer from 'multer';
const upload = multer(); 

app.get("/", (req, res) => {
    res.send("Hello World")
})
import FormData from "form-data"
import axios from "axios"

app.post('/compare-audio', upload.fields([
  { name: 'reference_audio', maxCount: 1 },
  { name: 'user_audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('reference_audio', req.files.reference_audio[0].buffer, {
      filename: req.files.reference_audio[0].originalname,
      contentType: 'audio/wav'
    });
    formData.append('user_audio', req.files.user_audio[0].buffer, {
      filename: req.files.user_audio[0].originalname,
      contentType: 'audio/wav'
    });

    const response = await axios.post('http://192.168.18.46:8000/compare-audio/', formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})