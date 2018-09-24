import React from 'react';

const Notification = ({ text, href, }) => {
  const textSpan = <span>{text}</span>;
  return href ? (<a style={{ color: 'rgb(2, 115, 96)', }} href={href}>{textSpan}</a>) : (textSpan);
};

export default Notification;
