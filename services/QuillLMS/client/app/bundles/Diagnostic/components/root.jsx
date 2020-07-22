import React from 'react';
import NavBar from './navbar/adminNavbar';

const Root = ({ params, children }) => {
  return (
    <div>
      <NavBar params={params} />
      {children}
    </div>
  );
};

export default Root;
