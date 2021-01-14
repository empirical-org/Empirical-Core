import React from 'react';

import { Cue, CueExplanation } from '../../../Shared/index'
const arrow = `${process.env.CDN_URL}/images/icons/pointing-arrow.svg`;

export default class Cues extends React.Component {
  getJoiningWordsText = () => {
    let text
    const { customText, question } = this.props;
    if (question.cues && question.cuesLabel) {
      return question.cuesLabel
    } else if (customText) {
      text = customText;
    } else if (question.cues && question.cues.length === 1) {
      text = 'joining word'
      return text;
    } else {
      text = 'joining words';
      return text;
    }
  };

  renderExplanation = () => {
    const text = this.getJoiningWordsText()
    return (
      <CueExplanation text={text} />
    );
  };

  renderCues = () => {
    const { displayArrowAndText, question } = this.props;
    let arrowPicture, text
    if (displayArrowAndText) {
      arrowPicture = question.cuesLabel !== ' ' ? <img alt="Arrow Icon" src={arrow} /> : null
      text = this.renderExplanation()
    } else {
      arrowPicture = <span />
      text = <span />
    }
    if  (question.cues && question.cues.length > 0 && question.cues[0] !== '') {
      const cueDivs = question.cues.map((cue, i) => <Cue cue={cue} key={`${i}${cue}`} />)
      return (
        <div className="cues">
          {cueDivs}
          {arrowPicture}
          {text}
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderCues()}</div>;
  }
}
