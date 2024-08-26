import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
// Create a new Storage instance
const storage = new Storage();
// Define the bucket names
const rawBucketName = 'jv-yt-raw-vids';
const processedBucketName = 'jv-yt-processed-vids';
// Define the paths to the local directories
const rawDir = './raw-vids';
const processedDir = './processed-vids';
// Create local directories for raw and processed videos
export const setupDirs = () => {
  ensureDirExists(rawDir);
  ensureDirExists(processedDir);
}
/** 
 * @param rawVidName name of file to convert from {@link rawDir}
 * @param processedVidName name of file to convert to {@link processedDir}
 * @returns promise resolves when video processed
*/
export const processVid = (rawVidName: string, processedVidName: string) => {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${rawDir}/${rawVidName}`)
      .outputOptions("-vf", "scale=-1:360") // Convert to 360p
      .on("end", () => {
        console.log('Video Processed Successfully');
        resolve();
      })
      .on("error", (e) => {
        console.log(`Error Processing Video: ${e.message}`);
        reject(e);
      })
      .save(`${processedDir}/${processedVidName}`);
  });
}
/**
 * @param fileName name of file to download from
 * {@link rawBucketName} into {@link rawDir}
 * @returns promise resolves when file downloaded
 */
export const downloadRawVid = async (fileName: string) => {
  await storage.bucket(rawBucketName)
    .file(fileName)
    .download({ destination: `${rawDir}/${fileName}` });
  console.log(`gs://${rawBucketName}/${fileName} downloaded to ${rawDir}/${fileName}`);
}
/**
 * @param fileName name of file to upload from
 * {@link processedDir} into {@link processedBucketName}
 * @returns promise resolves when file downloaded
 */
export const uploadProcessedVid = async (fileName: string) => {
  const bucket = storage.bucket(processedBucketName);
  await bucket.upload(`${processedDir}/${fileName}`, {
    destination: fileName
  });
  console.log(`${processedDir}/${fileName} uploaded to gs://${processedBucketName}/${fileName}`);
  await bucket.file(fileName).makePublic();
}
/**
 * @param fileName name of file to delete from
 * {@link rawDir}
 * @returns promise resolves when file deleted
 */
export const deleteRaw = async (fileName: string) => {
  return deleteFile(`${rawDir}/${fileName}`);
}
/**
 * @param fileName name of file to delete from
 * {@link rawDir}
 * @returns promise resolves when file deleted
 */
export const deleteProcessed = async (fileName: string) => {
  return deleteFile(`${rawDir}/${fileName}`);
}
/**
 * @param filePath path of file to delete
 * @returns promise resolves when file deleted
 */
export const deleteFile = async (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (e) => {
        if (e) {
          console.log(`Failed to delete file at ${filePath}`, e);
          reject(e);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}, skipping deletion.`);
      resolve();
    }
  });
}
/**
 * Ensure a directory exists, if not create it
 * @param {string} dirPath path of directory to create
 */
export const ensureDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // enable creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}