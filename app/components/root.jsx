import React from 'react';
import NavBar from './navbar/navbar';

const Root = ({ params, children }) => {
  return (
    <div>
      <NavBar params={params}/>
      {children}
    </div>
  );
};

export default Root;
