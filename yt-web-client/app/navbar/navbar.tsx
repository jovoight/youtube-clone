'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from 'firebase/auth';

import styles from './navbar.module.css';
import Link from 'next/link';
import SignIn from './sign-in';
import { onAuthStateChangedHelper } from '../firebase/firebase';
import Upload from './upload';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user: User | null) => {
      setUser(user);
    });
    // Unsubscribe from the listener when the component is unmounted
    return () => unsubscribe();
  }, []);
  
  return (
    <nav className={styles.nav}>
      <Link href='/'>
        <Image src="/youtube-logo.svg" alt="YouTube Logo" width={90} height={20} />
      </Link>
      {user && <Upload />}
      <SignIn user={user} />
    </nav>
  );
}
export default Navbar