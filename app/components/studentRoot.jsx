import React from 'react';
import NavBar from './navbar/studentNavbar';
import SocketProvider from './socketProvider';

const StudentRoot = ({ children }) => {
  return (
    <SocketProvider>
      <div>
        <NavBar/>
        {children}
      </div>
    </SocketProvider>
  );
};

export default StudentRoot;
