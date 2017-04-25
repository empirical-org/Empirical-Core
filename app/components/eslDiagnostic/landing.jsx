import React from 'react';
import beginArrow from '../../img/begin_arrow.svg';

import translations from '../../libs/translations/index.js';
export default React.createClass({

  resume() {
    this.props.resumeActivity(this.props.session);
  },

  renderButton() {
    let onClickFn,
      text;
    if (this.props.session) {
      // resume session if one is passed
      onClickFn = this.resume;
      // HARDCODED
      text = <span>{translations.english['resume button text']} / {translations.spanish['resume button text']}</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.props.begin;
      // HARDCODED
      text = <span>{translations.english['begin button text']} / {translations.spanish['begin button text']}</span>;
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
        <div dangerouslySetInnerHTML={{ __html: translations.english['diagnostic intro text'], }} />
        <br />
        <div dangerouslySetInnerHTML={{ __html: translations.spanish['diagnostic intro text'], }} />
        {this.renderButton()}
      </div>
    );
  },

});
