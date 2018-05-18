import React from 'react';
import NavBar from './navbar/studentNavbar';

const StudentRoot = ({ children }) => {
  return (
    <div>
      <NavBar/>
      {children}
    </div>
  );
};

export default StudentRoot;
