import * as React from 'react';
import { Cue, CueExplanation } from '../../../Shared/index';
import { Question } from '../../interfaces/Question';
import { ENGLISH } from '../../modules/translation/languagePageInfo';
const arrow = `${process.env.CDN_URL}/images/icons/pointing-arrow.svg`;

interface CuesProps {
  diagnosticID: string,
  displayArrowAndText: boolean,
  question: Question,
  language: string,
  translate(key: any, opts?: any): any
}

export class Cues extends React.Component<CuesProps> {

  getJoiningWordsText = () => {
    const { question, language, translate } = this.props;

    if(language && language !== ENGLISH) {
      return this.translateCueLabel(question, translate);
    } else if (question.cues && question.cuesLabel) {
      return question.cuesLabel
    } else if (question.cues && question.cues.length === 1) {
      return 'joining word';
    } else {
      return 'joining words';
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

  renderExplanation = () => {
    const text = this.getJoiningWordsText();
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
