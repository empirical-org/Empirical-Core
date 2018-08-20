import React from 'react';

const Notification = ({ text, user }) => {
  return(
    <p>{`${text} by ${user}`}</p>
  );
};

export default Notification;
