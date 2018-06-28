import React from 'react';

const questionIconSrc = 'https://assets.quill.org/images/icons/question_icon.svg'

// interface InstructionsProps {
//   html: 'string'
// }

const Instructions = (props: any) => (
  <div className="feedback-row">
    <img className="info" src={questionIconSrc} alt="icon" style={{ marginTop: 3, }} />
    <div dangerouslySetInnerHTML={{ __html: props.html, }} />
  </div>
);

export { Instructions }
