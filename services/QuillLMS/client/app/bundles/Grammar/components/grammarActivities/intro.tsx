import * as React from 'react';

interface IntroProps {
  startActivity: () => void;
  activity: any;
  previewMode: boolean;
  session: any;
  language: string;
  availableLanguages: string[];
  translate: (language: string) => string;
}

interface IntroState {
  showLandingPage: boolean;
}

export default class Intro extends React.Component<IntroProps, IntroState> {
  constructor(props: IntroProps) {
    super(props)

    this.state = {
      showLandingPage: false,
    }
  }

  componentDidMount() {
    const { activity, previewMode } = this.props;
    if(previewMode) {
      this.handleNextClick();
    }
    if (activity && activity.landingPageHtml && this.landingPageHtmlHasText()) {
      this.handleSetShowLandingPage();
    }
  }

  handleSetShowLandingPage = () => {
    this.setState({ showLandingPage: true, });
  }

  landingPageHtmlHasText = () => {
    const { activity, } = this.props
    // strips out everything nested betwee < and >.
    // we should also not allow draft js to send text-less answers from
    // the lp editor
    return activity.landingPageHtml.replace(/(<([^>]+)>)/ig, "").length > 0;
  }

  translatedText = () => {
    const { activity, language } = this.props;

    // Proofreader does not actually set the activity on props, so bail
    if (!activity) return false

    const { translations, } = activity;
    return translations && translations[language];
  }

  handleNextClick = () => {
    const { activity, startActivity, } = this.props
    if (activity && activity.landingPageHtml && this.landingPageHtmlHasText()) {
      this.setState({ showLandingPage: true, });
    } else {
      startActivity();
    }
  }

  handleStartLessonClick = () => {
    const { startActivity, } = this.props
    startActivity();
  }

  renderButton = (hasLandingPage: boolean, showTranslatedButton: boolean) => {
    const { translate } = this.props
    let buttonText = hasLandingPage ? 'Start activity' : 'Begin'
    if(showTranslatedButton) {
      buttonText = translate(`buttons^${buttonText.toLowerCase()}`)
    }
    if(hasLandingPage) {
      return <button className="quill-button-archived focus-on-light large primary contained" onClick={this.handleStartLessonClick} type="button">{buttonText}</button>
    }
    return <button className="quill-button-archived focus-on-light primary contained large" onClick={this.handleNextClick} type="button">{buttonText}</button>
  }

  renderIntro = () => {
    const { activity, language, availableLanguages } = this.props
    const { showLandingPage, } = this.state
    const translatedText = this.translatedText()
    const showTranslatedButton = language && availableLanguages && availableLanguages.includes(language)
    if (showLandingPage) {
      return (
        <div className="intro landing-page">
          <div dangerouslySetInnerHTML={{ __html: activity.landingPageHtml, }} />
          {translatedText && (
            <React.Fragment>
              <hr />
              <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: translatedText }} />
            </React.Fragment>
          )}
          {this.renderButton(showLandingPage, showTranslatedButton)}
        </div>
      );
    }
    return (
      <div className="intro welcome-page">
        <h1>Welcome to Quill Grammar!</h1>
        <p>Follow the instructions for each prompt.</p>
        <br />
        <p>Use the example as a guide.</p>
        <br />
        <p>Type your sentence into the box.</p>
        <br />
        <p>Remember to use correct spelling, capitalization, and punctuation!</p>
        {this.renderButton(showLandingPage, showTranslatedButton)}
      </div>
    );
  }

  render() {
    return (
      <div className="intro-container">
        {this.renderIntro()}
      </div>
    );
  }
}
