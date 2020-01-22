import React from 'react';

const questionIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`

const Instructions = ({ html, }) => (
  <div className="feedback-row">
    <img alt="Directions Icon" className="info" src={questionIconSrc} style={{ marginTop: 3, }} />
    <div dangerouslySetInnerHTML={{ __html: html, }} />
  </div>
);

export { Instructions }
