import React from 'react';
import beginArrow from '../../img/begin_arrow.svg';

const TitleCard = props => (
  <div className="landing-page">
    <div className="landing-page-html" dangerouslySetInnerHTML={{__html: props.data.content}}></div>
    <button className="button student-begin" onClick={props.nextQuestion}>
      Continue
      <img className="begin-arrow" src={beginArrow} />
    </button>
  </div>
)

export default TitleCard
