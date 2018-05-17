import React from 'react';
import NavBar from './navbar/navbar';
import SocketProvider from './socketProvider';

const Root = ({ params, children }) => {
  return (
    <SocketProvider>
      <div>
        <NavBar params={params}/>
        {children}
      </div>
    </SocketProvider>
  );
};

export default Root;
