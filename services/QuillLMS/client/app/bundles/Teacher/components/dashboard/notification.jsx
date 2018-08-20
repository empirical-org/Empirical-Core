import React from 'react';

const Notification = ({ text, href }) => {
  return(
    <a href={href}>{text}</a>
  );
};

export default Notification;
