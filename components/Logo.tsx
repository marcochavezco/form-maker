import Link from 'next/link';
import React from 'react';

function Logo() {
  return (
    <Link
      href='/'
      className='font-bold text-3xl bg-gradient-to-r from-sky-600 to-teal-400 text-transparent bg-clip-text hover:cursor-pointer'
    >
      Logo
    </Link>
  );
}

export default Logo;
