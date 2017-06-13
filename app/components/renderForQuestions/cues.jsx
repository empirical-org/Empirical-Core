import React from 'react';
import Cue from './cue.jsx'
import CueExplanation from './cueExplanation.jsx'
import arrow from '../../img/arrow_icon.svg';
import translations from '../../libs/translations/index.js';

export default React.createClass({

  getJoiningWordsText() {
    if (this.props.getQuestion().cues && this.props.getQuestion().cues.length === 1) {
      let text = translations.english['joining word cues single'];
      if (this.props.language && this.props.language !== 'english') {
        text += ` / ${translations[this.props.language]['joining word cues single']}`;
      }
      return text;
    } else {
      let text = translations.english['joining word cues multiple'];
      if (this.props.language && this.props.language !== 'english') {
        text += ` / ${translations[this.props.language]['joining word cues multiple']}`;
      }
      return text;
    }
  },

  renderExplanation() {
    let text;
    if (this.props.customText) {
      text = this.props.customText;
    } else {
      text = this.getJoiningWordsText();
    }
    return (
      <CueExplanation text={text} />
    );
  },

  renderCues() {
    if (this.props.getQuestion().cues && this.props.getQuestion().cues.length > 0 && this.props.getQuestion().cues[0] !== '') {
      const cueDivs = this.props.getQuestion().cues.map(cue => <Cue key={cue} cue={cue} />)
      return (
        <div className="cues">
          {cueDivs}
          <img src={arrow} />
          {this.renderExplanation()}
        </div>
      );
    }
  },

  render() {
    return <div>{this.renderCues()}</div>;
  },

});
