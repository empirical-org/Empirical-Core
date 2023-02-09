import React from 'react';

import { Cue, CueExplanation } from '../../../Shared/index';
const arrow = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/pointing-arrow.svg`;

export default class Cues extends React.Component {

  getJoiningWordsText = () => {
    const { customText, question, } = this.props
    if (question.cues && question.cuesLabel) { return question.cuesLabel }
    if (customText) { return customText }
    if (question.cues && question.cues.length === 1) { return 'joining word' }
    return 'joining words'
  }

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
