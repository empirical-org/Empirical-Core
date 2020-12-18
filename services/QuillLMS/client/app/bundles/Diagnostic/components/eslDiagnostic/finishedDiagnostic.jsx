import React from 'react';
import { Spinner } from '../../../Shared/index';
import translations from '../../libs/translations/index.js';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';

export class FinishedDiagnostic extends React.Component {

  componentDidMount() {
    const { saveToLMS } = this.props;
    saveToLMS();
  }

  getCompletedPageHTML() {
    const { language } = this.props;
    let html = translations.english['completion page'];
    if (language !== ENGLISH) {
      const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left arabic-title-div' : '';
      html += `<br/><div class="${textClass}">${translations[language]['completion page']}</div>`;
    }
    return html;
  }

  renderSavedIndicator() {
    const { saved } = this.props;
    return saved ? <div>Saved Diagnostic</div> : <div>Saving Diagnostic</div>;
  }

  renderErrorState() {
    const { error, saveToLMS } = this.props;
    let header, message;
    if (error === "Activity Session Already Completed") {
      header = "This Activity Session Has Already Been Completed"
      message = (<p>
        The activity session with this unique identifier has already been completed.<br />
        In order to redo this activity, you must return to your dashboard and click &quot;Replay Activity&quot;.<br />
        If you believe that you have received this message in error, ask your teacher to contact Quill.<br />
        Please provide the following URL to help us solve the problem.
      </p>)
    } else {
      header = "We Couldn't Save Your Activity Session."
      message = (<p>Your results could not be saved. <br />
        Make sure you are connected to the internet.<br />
        You can attempt to save again using the button below.<br />
        If the issue persists, ask your teacher to contact Quill.<br />
        Please provide the following URL to help us solve the problem.
      </p>)
    }
    return (
      <div className="landing-page">
        <h1>{header}</h1>
        {message}
        <p><code style={{ fontSize: 14, }}>
          {window.location.href}
        </code></p>
        <button className="button is-info is-large" onClick={saveToLMS} type="submit">Retry</button>
      </div>
    );
  }

  renderContent = () => {
    const { diagnosticID, language, translate } = this.props;

    if(diagnosticID === 'ell') {
      return <div dangerouslySetInnerHTML={{ __html: this.getCompletedPageHTML() }} />;
    } else {
      const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
      return(
        <div>
          <div className="landing-page-html">
            <h1>You've completed the Quill Placement Activity</h1>
            <p>Your results are being saved now. You'll be redirected automatically once they are saved.</p>
          </div>
          {language !== ENGLISH && <div className={`landing-page-html ${textClass}`}>
            <h1>{translate('completedDiagnostic^header')}</h1>
            <p>{translate('completedDiagnostic^text')}</p>
          </div>}
        </div>
      );
    }
  }

  render() {
    const { error } = this.props;

    if (error) {
      return this.renderErrorState()
    } else {
      return (
        <div className="landing-page">
          {this.renderContent()}
          <Spinner />
        </div>
      );
    }
  }
};

export default FinishedDiagnostic;
