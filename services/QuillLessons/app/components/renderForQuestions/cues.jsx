import React from 'react';
import {
  Cue,
  CueExplanation
} from 'quill-component-library/dist/componentLibrary'
import arrow from 'https://assets.quill.org/images/icons/arrow_icon.svg';

export default React.createClass({

  getJoiningWordsText() {
    let text
    if (this.props.getQuestion().cues && this.props.getQuestion().cuesLabel) {
      return this.props.getQuestion().cuesLabel
    } else if (this.props.getQuestion().cues && this.props.getQuestion().cues.length === 1) {
      text = 'joining word'
      return text;
    } else {
      text = 'joining words';
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
    let arrowPicture, text
    if (this.props.displayArrowAndText) {
      arrowPicture = <img src={arrow} />
      text = this.renderExplanation()
    } else {
      arrowPicture = <span></span>
      text = <span></span>
    }
    //const arrow = this.props.displayArrowAndText ? (<div><img src={arrow} /> {this.renderExplanation()}</div>) : <span></span>
    if  (this.props.getQuestion().cues && this.props.getQuestion().cues.length > 0 && this.props.getQuestion().cues[0] !== '') {
      const cueDivs = this.props.getQuestion().cues.map((cue, i) => <Cue key={`${i}${cue}`} cue={cue} />)
      return (
        <div className="cues">
          {cueDivs}
          {arrowPicture}
          {text}
        </div>
      );
    }
  },

  render() {
    return <div>{this.renderCues()}</div>;
  },

});
