import * as React from 'react';
import { Cue, CueExplanation } from 'quill-component-library/dist/componentLibrary'
const arrow = `${process.env.CDN_URL}/images/icons/pointing-arrow.svg`;
import translations from '../../libs/translations/index.js';
import { ENGLISH } from '../../modules/translation/languagePageInfo';
import Question from '../../interfaces/Question.ts';

interface CuesProps {
  customText: string,
  diagnosticID: string,
  displayArrowAndText: boolean,
  question: Question,
  language: string,
  translate(key: any, opts?: any): any
}

export class Cues extends React.Component<CuesProps> {

  getJoiningWordsText = () => {
    const { diagnosticID, question, language, translate } = this.props;

    if(language && diagnosticID !== 'ell') {
      return this.translateCueLabel(question, translate);
    } else if (question.cues && question.cuesLabel) {
      return question.cuesLabel
    } else if (question.cues && question.cues.length === 1) {
      let text = translations.english['joining word cues single'];
      if (language && language !== ENGLISH) {
        text += ` / ${translations[language]['joining word cues single']}`;
      }
      return text;
    } else {
      let text = translations.english['joining word cues multiple'];
      if (language && language !== ENGLISH) {
        text += ` / ${translations[language]['joining word cues multiple']}`;
      }
      return text;
    }
  }

  translateCueLabel = (question: Question, translate: CuesProps["translate"] ) => {
    const { cues, cuesLabel } = question;
    if (cues && cuesLabel) {
      const text = `cues^${cuesLabel}`;
      return translate(text);
    } else {
      return translate('cues^joining word');
    }
  }

  handleCustomText = () => {
    const { customText, diagnosticID, language, question, translate } = this.props;
    if (language && diagnosticID !== 'ell') {
      return this.translateCueLabel(question, translate);
    } else {
      return customText;
    }
  }

  renderExplanation = () => {
    const { customText, } = this.props;
    const text = customText ? this.handleCustomText() : this.getJoiningWordsText();
    return (
      <CueExplanation text={text} />
    );
  }

  render() {
    const { displayArrowAndText, question, } = this.props;
    const { cues, cuesLabel } = question;
    let arrowPicture: any, text: any;
    if (displayArrowAndText) {
      arrowPicture = cuesLabel !== ' ' ? <img alt="Arrow Icon" src={arrow} /> : null
      text = this.renderExplanation()
    } else {
      arrowPicture = <span />
      text = <span />
    }
    if (cues && cues.length > 0 && cues[0] !== '') {
      const cueDivs = cues.map((cue: string, i: number) => <Cue cue={cue} key={`${i}${cue}`} />)
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
}

export default Cues;
