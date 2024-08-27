import Image from 'next/image';

import styles from './navbar.module.css';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <Link href='/'>
        <Image src="/youtube-logo.svg" alt="YouTube Logo" width={90} height={20} />
      </Link>
    </nav>
  );
}
export default Navbar