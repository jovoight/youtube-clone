import express from "express";
import { deleteProcessed, deleteRaw, downloadRawVid, processVid, setupDirs, uploadProcessedVid } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

export const processVideoFromMessage = async (message: any) => {
  // Create local directories if they do not exist
  setupDirs();
  // Get bucket and file names from Cloud Pub/Sub message
  let data;
  try {
    const rawData = Buffer.from(message.data, 'base64').toString('utf8');
    data = JSON.parse(rawData);
    if (!data.name) {
      console.log('Invalid Message Payload.');
      return;
    }
  } catch (e) {
    console.log('Invalid Message Payload:', e);
    return;
  }
  const inputFile = data.name; // Format of <UID>-<DATE>.<EXT>
  const outputFile = `processed-${inputFile}`;
  const videoId = inputFile.split('.')[0];
  const videoIsNew = await isVideoNew(videoId);
  if (!videoIsNew) {
    console.log('Video Already Processed or Being Processed.');
    return;
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
    await setVideo(videoId, {
      status: undefined
    });
    console.log('Video Processing Failed.');
    return;
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
  console.log('Video Processing Complete.');
  return;
}