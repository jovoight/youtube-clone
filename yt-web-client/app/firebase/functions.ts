import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

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