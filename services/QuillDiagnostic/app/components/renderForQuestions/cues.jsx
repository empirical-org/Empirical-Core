import React from 'react';
import { Cue, CueExplanation } from 'quill-component-library/dist/componentLibrary'
const arrow = `${process.env.QUILL_CDN_URL}/images/icons/pointing-arrow.svg`;
import translations from '../../libs/translations/index.js';
import { english } from '../../../public/locales/languagePageInfo';

export default class Cues extends React.Component {

  getJoiningWordsText = () => {
    const { diagnosticID, getQuestion, language, translate } = this.props;
    const question = getQuestion();

    if(language && diagnosticID !== 'ell') {
      return this.translateCueLabel(question, translate);
    } else if (question.cues && question.cuesLabel) {
      return question.cuesLabel
    } else if (question.cues && question.cues.length === 1) {
      let text = translations.english['joining word cues single'];
      if (language && language !== english) {
        text += ` / ${translations[language]['joining word cues single']}`;
      }
      return text;
    } else {
      let text = translations.english['joining word cues multiple'];
      if (language && language !== english) {
        text += ` / ${translations[language]['joining word cues multiple']}`;
      }
      return text;
    }
  }

  translateCueLabel = (question, translate) => {
    if (question.cues && question.cuesLabel) {
      const text = `cues^${question.cuesLabel}`;
      return translate(text);
    } else {
      return translate('cues^joining word');
    }
  }

  handleCustomText = () => {
    const { customText, diagnosticID, language, getQuestion, translate } = this.props;
    const question = getQuestion();
    if (language && diagnosticID !== 'ell') {
      return this.translateCueLabel(question, translate);
    } else {
      return customText;
    }
  }

  renderExplanation() {
    const { customText, } = this.props;
    const text = customText ? this.handleCustomText() : this.getJoiningWordsText();
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
