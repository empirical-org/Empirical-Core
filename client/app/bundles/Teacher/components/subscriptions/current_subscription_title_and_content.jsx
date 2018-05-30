import React from 'react';

export default ({ title, content, }) => (
  <div>
    <span className="title">{title}</span>
    <span>{content}</span>
  </div>
);
