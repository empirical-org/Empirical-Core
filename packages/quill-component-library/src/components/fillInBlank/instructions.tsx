import React from 'react';

const questionIconSrc = 'https://assets.quill.org/images/icons/question_icon.svg'

// interface InstructionsProps {
//   html: 'string'
// }

const Instructions = (props: any) => (
  <div className="feedback-row">
    <img alt="icon" className="info" src={questionIconSrc} style={{ marginTop: 3, }} />
    <div dangerouslySetInnerHTML={{ __html: props.html, }} />
  </div>
);

export { Instructions }
