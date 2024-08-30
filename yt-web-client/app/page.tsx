import Link from "next/link";
import Image from "next/image";
import { getVideos } from "./firebase/functions";
import styles from "./page.module.css";

const Home = async () => {
  const videos = await getVideos();
  return (
    <main className={styles.main}>
      {videos.map((video) => (
        <Link key={video.id} href={`/watch?v=${video.filename}`}>
          <Image 
            src={'/thumbnail.png'} 
            alt='video' 
            width={120} 
            height={80}
            className={styles.thumbnail}
          />
        </Link>
      ))}    
    </main>
  );
}
export default Home;
export const revalidate = 0;