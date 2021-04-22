import React from 'react';

import { ResumeOrBeginButton } from '../../../Shared/index';
import { ENGLISH, rightToLeftLanguages, languageData, languageDataV2} from '../../modules/translation/languagePageInfo';

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

  renderLandingPageText = (language) => {
    const { diagnosticID } = this.props;
    const langData = diagnosticID === 'ell' ? languageData : languageDataV2;
    const landingPageInfo = langData[language].intro[diagnosticID];
    const { header, firstLine, secondLine, thirdLine } = landingPageInfo;
    const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
    // right to left languages only have one line, the first
    const showLine = textClass === '';
    return(
      <div className="intro-container">
        <h1 className={textClass}>{header}</h1>
        <p className={textClass}>{firstLine}</p>
        {showLine && <p>{secondLine}</p>}
        {showLine && <p>{thirdLine}</p>}
      </div>
    )
  }

  render() {
    const { language } = this.props;
    return (
      <div className="landing-page">
        {this.renderLandingPageText(ENGLISH)}
        {language !== ENGLISH && this.renderLandingPageText(language)}
        {this.renderButton()}
      </div>
    );
  }
};

export default LandingPage;
