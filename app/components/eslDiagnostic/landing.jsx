import React from 'react';
import beginArrow from '../../img/begin_arrow.svg';

import translations from '../../libs/translations/index.js';
export default React.createClass({

  resume() {
    this.props.resumeActivity(this.props.session);
  },

  getResumeButtonText() {
    let text = translations.english['resume button text'];
    if (this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['resume button text']}`;
    }
    return text;
  },

  getBeginButtonText() {
    let text = translations.english['begin button text'];
    if (this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['begin button text']}`;
    }
    return text;
  },

  getLandingPageHTML() {
    let html = translations.english['diagnostic intro text'];
    if (this.props.language !== 'english') {
      html += `<br/>${translations[this.props.language]['diagnostic intro text']}`;
    }
    return html;
  },

  renderButton() {
    let onClickFn,
      text;
    if (this.props.session) {
      // resume session if one is passed
      onClickFn = this.resume;
      // HARDCODED
      text = <span>{this.getResumeButtonText()}</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.props.begin;
      // HARDCODED
      text = <span>{this.getBeginButtonText()}</span>;
    }
    return (
      <button className="button student-begin" onClick={onClickFn}>
        {text} <img className="begin-arrow" src={beginArrow} />
      </button>
    );
  },

  render() {
    // HARDCODED
    return (
      <div className="landing-page">
        <div dangerouslySetInnerHTML={{ __html: this.getLandingPageHTML(), }} />
        {this.renderButton()}
      </div>
    );
  },

});
