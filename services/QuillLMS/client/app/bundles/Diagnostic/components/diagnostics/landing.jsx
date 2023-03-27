import React from 'react';

import { ResumeOrBeginButton } from '../../../Shared/index';

export default class Landing extends React.Component {

  resume = () => {
    const { resumeActivity, session, } = this.props
    resumeActivity(session);
  }

  renderButton = () => {
    const { session, begin, } = this.props
    let onClickFn,
      text;
    if (session) {
      // resume session if one is passed
      onClickFn = this.resume;
      text = <span>Resume</span>;
    } else {
      // otherwise begin new session
      onClickFn = begin;
      text = <span>Begin</span>;
    }
    return (
      <ResumeOrBeginButton onClickFn={onClickFn} text={text} />
    );
  }

  getLandingPageHTML = () => {
    const { landingPageHtml, questionCount, } = this.props
    if (landingPageHtml && landingPageHtml !== '<br/>') {
      return landingPageHtml
    } else {
      return (
        <div>
          <h1>You&#39;re working on the Quill Placement Activity </h1>
          <p>
          You&#39;re about to answer {questionCount || '22'} questions about writing sentences.
          Don&#39;t worry, it&#39;s not a test. It&#39;s just to figure out what you know.
          </p>
          <p className="second-p">
          Some of the questions might be about things you haven&#39;t learned yet—that&#39;s okay!
          Just answer them as best as you can.
          Once you&#39;re finished, Quill will create a learning plan just for you!
          </p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="landing-page">
        <div dangerouslySetInnerHTML={{ __html: this.getLandingPageHTML(), }} />
        {this.renderButton()}
      </div>
    );
  }

}
