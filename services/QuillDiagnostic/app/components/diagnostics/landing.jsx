import React from 'react';

import { ResumeOrBeginButton } from 'quill-component-library/dist/componentLibrary';

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
      text = <span>Resume</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.props.begin;
      text = <span>Begin</span>;
    }
    return (
      <ResumeOrBeginButton text={text} onClickFn={onClickFn} />
    );
  },

  render() {
    return (
      <div className="landing-page">
        <h1>You're working on the Quill Placement Activity </h1>
        <p>
          You're about to answer {this.props.questionCount || '22'} questions about writing sentences.
          Don't worry, it's not a test. It's just to figure out what you know.
        </p>
        <p className="second-p">
          Some of the questions might be about things you haven't learned yet—that's okay!
          Just answer them as best as you can.
          Once you're finished, Quill will create a learning plan just for you!
        </p>
        {this.renderButton()}
      </div>
    );
  },

});
