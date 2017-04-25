import React from 'react';
import arrow from '../../img/arrow_icon.svg';

export default React.createClass({
  // HARDCODED
  renderExplanation() {
    let text;
    if (this.props.customText) {
      text = this.props.customText;
    } else if (this.props.getQuestion().cues && this.props.getQuestion().cues.length === 1) {
      text = this.props.esl ? 'joining word | palabras sumarias' : 'joining word';
    } else {
      text = this.props.esl ? 'joining words | palabras sumarias' : 'joining words';
    }
    return (
      <div className="cue-explanation" key="explanation">
        {text}
      </div>
    );
  },

  renderCues() {
    if (this.props.getQuestion().cues && this.props.getQuestion().cues.length > 0 && this.props.getQuestion().cues[0] !== '') {
      const cueDivs = this.props.getQuestion().cues.map(cue => (
        <div key={cue} className="cue">
          {cue}
        </div>
        ));
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
