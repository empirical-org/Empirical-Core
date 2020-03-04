import * as React from 'react';

interface IntroProps {
  startActivity: () => void;
  activity: any;
  session: any;
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

  landingPageHtmlHasText = () => {
    const { activity, } = this.props
    // strips out everything nested betwee < and >.
    // we should also not allow draft js to send text-less answers from
    // the lp editor
    return activity.landingPageHtml.replace(/(<([^>]+)>)/ig, "").length > 0;
  }

  handleNextClick = () => {
    const { activity, startActivity, } = this.props
    if (activity.landingPageHtml && this.landingPageHtmlHasText()) {
      this.setState({ showLandingPage: true, });
    } else {
      startActivity();
    }
  }

  handleStartLessonClick = () => {
    const { startActivity, } = this.props
    startActivity();
  }

  renderButton = () => {
    return (
      <button className="quill-button focus-on-light primary contained large" onClick={this.handleNextClick} type="button">Next</button>
    );
  }

  renderIntro = () => {
    const { activity, } = this.props
    const { showLandingPage, } = this.state
    if (showLandingPage) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: activity.landingPageHtml, }} />
          <button className="quill-button focus-on-light large primary contained" onClick={this.handleStartLessonClick} type="button">Start activity</button>
        </div>
      );
    }
    return (
      <div className="container">
        <h2 className="title is-3 register">
          Welcome to Quill Connect!
        </h2>
        <div className="register-container">
          <ul className="register-list">
            <li>Combine the sentences together into one sentence.</li>
            <li>You may add or remove words.</li>
            <li>There is often more than one correct answer.</li>
            <li>Remember to use correct spelling, capitalization, and punctuation!</li>
          </ul>
          {this.renderButton()}
          <br />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="intro">
        {this.renderIntro()}
      </div>
    );
  }
}
