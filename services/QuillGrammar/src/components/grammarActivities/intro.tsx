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
        <div className="intro landing-page">
          <div dangerouslySetInnerHTML={{ __html: activity.landingPageHtml, }} />
          <button className="quill-button focus-on-light large primary contained" onClick={this.handleStartLessonClick} type="button">Start activity</button>
        </div>
      );
    }
    return (
      <div className="intro welcome-page">
        <h1>Welcome to Quill Grammar!</h1>
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
        <br />
        <p>Vestibulum id ligula porta felis euismod.</p>
        <br />
        <p>Cras sociis natoque penatibus et magnis dis parturient montes.</p>
        <br />
        <p>Donec ullamcorper nulla non metus auctor fringilla!</p>
        {this.renderButton()}
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
