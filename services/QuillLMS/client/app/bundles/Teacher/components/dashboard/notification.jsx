import React from 'react';

const Notification = ({ text, href }) => {
  return(
    <a style={{color: 'rgb(2, 115, 96)'}} href={href}>{text}</a>
  );
};

export default Notification;
