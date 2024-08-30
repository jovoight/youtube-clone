import express from "express";
import { deleteProcessed, deleteRaw, downloadRawVid, processVid, setupDirs, uploadProcessedVid } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirs();
const app = express();
app.use(express.json());

app.post('/process-vid', async (req, res) => {
  // Get bucket and file names from Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid Message Payload.');
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send('Bad Request: Missing Filename.');
  }
  const inputFile = data.name; // Format of <UID>-<DATE>.<EXT>
  const outputFile = `processed-${inputFile}`;
  const videoId = inputFile.split('.')[0];
  const videoIsNew = await isVideoNew(videoId);
  if (!videoIsNew) {
    return res.status(400).send('Bad Request: Video Already Processing or Processed.');
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing',
    });
  }
  // Download raw video from cloud storage
  await downloadRawVid(inputFile);
  // Process the video
  try {
    await processVid(inputFile, outputFile);
  } catch (e) {
    await Promise.all([
      deleteRaw(inputFile),
      deleteProcessed(outputFile)
    ]);
    console.error(e);
    return res.status(500).send('Internal Server Error: Video Processing Failed.');
  }
  // Upload the processed video to cloud storage
  await uploadProcessedVid(outputFile);
  await setVideo(videoId, {
    status: 'processed',
    filename: outputFile
  });
  await Promise.all([
    deleteRaw(inputFile),
    deleteProcessed(outputFile)
  ]);
  return res.status(200).send('Processing Finished Successfully.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});