import React from 'react';
import icon from '../../img/question_icon.svg';

const instructions = props => (
  <div className="feedback-row">
    <img className="info" src={icon} alt="icon" style={{ marginTop: 3, }} />
    <div dangerouslySetInnerHTML={{ __html: props.html, }} />
  </div>
);

export default instructions;
