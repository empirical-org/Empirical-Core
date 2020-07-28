import React from 'react';
import { ResumeOrBeginButton } from 'quill-component-library/dist/componentLibrary';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';

export class LandingPage extends React.Component {

  resume = () => {
    const { resumeActivity, session } = this.props;
    resumeActivity(session);
  }

  renderButton = () => {
    const { begin, session, translate } = this.props;
    const onClickFn = session ? this.resume : begin;
    const text = session ? <span>{translate('buttons^resume')}</span> : <span>{translate('buttons^continue')}</span>;
    return <ResumeOrBeginButton onClickFn={onClickFn} text={text} />
  }

  render() {
    const { language, translate } = this.props;
    const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
    return (
      <div className="landing-page">
        <div className="intro-container">
          <h1>Quill Placement Activity</h1>
          <p>You&apos;re about to answer 22 questions about writing sentences. Don&apos;t worry, it&apos;s not a test. It&apos;s just to figure out what you know.</p>
          <p>Some of the questions might be about things you haven&apos;t learned yet — that&apos;s okay! Just answer them as best as you can. Once you&apos;re finished, Quill will create a learning plan just for you!</p>
        </div>
        {language !== ENGLISH && <div>
          <h1 className={textClass}>{translate('intro^header')}</h1>
          <p className={textClass}>{translate('intro^text')}</p>
        </div>}
        {this.renderButton()}
      </div>
    );
  }
};

export default LandingPage;
