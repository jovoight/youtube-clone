import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

export const uploadVideo = async (file: File) => {
  // Any type because the response is not typed
  const response: any = await generateUploadUrl({ fileExtension: file.name.split('.').pop() })
  // Upload file via signed URL
  const uploadResult = await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
  return uploadResult;
}

export const getVideos = async () => {
  const response: any = await getVideosFunction();
  return response.data as Video[];
}