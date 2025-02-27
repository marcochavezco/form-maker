import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col w-full flex-grow mx-auto'>{children}</div>
  );
}

export default Layout;
