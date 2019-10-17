import React from 'react';

const Notification = ({ text, href, }) => {
  const textSpan = <span>{text}</span>;
  return href ? (<a href={href} style={{ color: 'rgb(2, 115, 96)', }}>{textSpan}</a>) : (textSpan);
};

export default Notification;
