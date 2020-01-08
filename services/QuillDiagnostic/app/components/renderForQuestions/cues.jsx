import React from 'react';
import { Cue, CueExplanation } from 'quill-component-library/dist/componentLibrary'
const arrow = `${process.env.QUILL_CDN_URL}/images/icons/pointing-arrow.svg`;
import translations from '../../libs/translations/index.js';

export default class Cues extends React.Component {

  getJoiningWordsText() {
    const { getQuestion, language, } = this.props
    if (getQuestion().cues && getQuestion().cuesLabel) {
      return getQuestion().cuesLabel
    } else if (getQuestion().cues && getQuestion().cues.length === 1) {
      let text = translations.english['joining word cues single'];
      if (language && language !== 'english') {
        text += ` / ${translations[language]['joining word cues single']}`;
      }
      return text;
    } else {
      let text = translations.english['joining word cues multiple'];
      if (language && language !== 'english') {
        text += ` / ${translations[language]['joining word cues multiple']}`;
      }
      return text;
    }
  }

  renderExplanation() {
    const { customText, } = this.props
    const text = customText ? customText : this.getJoiningWordsText();
    return (
      <CueExplanation text={text} />
    );
  }

  renderCues() {
    const { displayArrowAndText, getQuestion, } = this.props
    let arrowPicture, text
    if (displayArrowAndText) {
      arrowPicture = getQuestion().cuesLabel !== ' ' ? <img alt="Arrow Icon" src={arrow} /> : null
      text = this.renderExplanation()
    } else {
      arrowPicture = <span />
      text = <span />
    }
    if (getQuestion().cues && getQuestion().cues.length > 0 && getQuestion().cues[0] !== '') {
      const cueDivs = getQuestion().cues.map((cue, i) => <Cue cue={cue} key={`${i}${cue}`} />)
      return (
        <div className="cues">
          {cueDivs}
          {arrowPicture}
          {text}
        </div>
      );
    } else {
      return <span />
    }
  }

  render() {
    return <div>{this.renderCues()}</div>;
  }

}
