import React from 'react';
import beginArrow from '../../img/begin_arrow.svg';

import ResumeOrBeginButton from '../shared/resumeOrBeginButton.jsx'

import translations from '../../libs/translations/index.js';
export default React.createClass({

  resume() {
    this.props.resumeActivity(this.props.session);
  },

  getResumeButtonText() {
    let text = translations.english['resume button text'];
    if (this.props.language && this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['resume button text']}`;
    }
    return text;
  },

  getBeginButtonText() {
    let text = translations.english['begin button text'];
    if (this.props.language && this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['begin button text']}`;
    }
    return text;
  },

  getLandingPageHTML() {
    let html = translations.english['diagnostic intro text'];
    if this.props.language && this.props.language !== 'english') {
      const textClass = this.props.language === 'arabic' ? 'right-to-left arabic-title-div' : '';
      html += `<br/><div class="${textClass}">${translations[this.props.language]['diagnostic intro text']}</div>`;
    }
    return html;
  },

  renderButton() {
    let onClickFn,
      text;
    if (this.props.session) {
      // resume session if one is passed
      onClickFn = this.resume;
      text = <span>{this.getResumeButtonText()}</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.props.begin;
      text = <span>{this.getBeginButtonText()}</span>;
    }
    return (
      <ResumeOrBeginButton text={text} onClickFn={onClickFn} />
    );
  },

  render() {
    return (
      <div className="landing-page">
        <div dangerouslySetInnerHTML={{ __html: this.getLandingPageHTML(), }} />
        {this.renderButton()}
      </div>
    );
  },

});
