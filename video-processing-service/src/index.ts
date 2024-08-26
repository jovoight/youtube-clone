import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
  // Get input and output video file path from request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send('Bad Request: Missing File Path');
  }
  // Process video
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") // Convert to 360p
    .on("end", () => {
      res.status(200).send('Video Processed Successfully');
    })
    .on("error", (e) => {
      console.log(`Error Processing Video: ${e.message}`);
      res.status(500).send(`Internal Server Error: ${e.message}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});