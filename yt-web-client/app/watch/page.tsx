'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
//Suspense boundary needed
const Video = () => {
  const videoPrefix = 'https://storage.googleapis.com/jv-yt-processed-vids/';
  const videoSrc = useSearchParams().get('v');
  return <video controls src={videoPrefix + videoSrc}></video>
}
const Watch = () => {
  return (
    <div>
      <h1>Watch Page</h1>
      <Suspense fallback={<div />}>
        <Video />
      </Suspense>
    </div>
  );
}
export default Watch;