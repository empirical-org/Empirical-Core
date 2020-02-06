import React from 'react';
import { ResumeOrBeginButton } from 'quill-component-library/dist/componentLibrary';

export class LandingPage extends React.Component {

  resume = () => {
    const { resumeActivity, session } = this.props;
    resumeActivity(session);
  }

  renderButton = () => {
    const { begin, session, translate } = this.props;
    const onClickFn = session ? this.resume : begin;
    const text = session ? <span>{translate('buttons.continue')}</span> : <span>{translate('buttons.continue')}</span>;
    return <ResumeOrBeginButton onClickFn={onClickFn} text={text} />
  }

  render() {
    const { language, translate } = this.props;
    const className = language === 'arabic' ? 'right-to-left' : '';
    return (
      <div className="landing-page">
        <div className="intro-container">
          <h1>Quill Placement Activity</h1>
          <p>{"You're about to answer 21 questions about writing sentences. Don't worry, it's not a test. It's just to figure out what you know."}</p>
          <p>{"Some of the questions might be about things you haven't learned yet — that's okay! Just answer them as best as you can. Once you're finished, Quill will create a learning plan just for you!"}</p>
        </div>
        {language !== 'english' && <div>
          <h1 className={className}>{translate('intro.header')}</h1>
          <p className={className}>{translate('intro.text')}</p>
        </div>}
        {this.renderButton()}
      </div>
    );
  }
};

export default LandingPage;