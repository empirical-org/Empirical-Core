import * as React from 'react';

const questionIconSrc = "https://assets.quill.org/images/icons/direction.svg"

const Instructions = ({ html, }) => (
  <div className="feedback-row">
    <img alt="Directions Icon" className="info" src={questionIconSrc} style={{ marginTop: 3, }} />
    <div dangerouslySetInnerHTML={{ __html: html, }} />
  </div>
);

export { Instructions };

