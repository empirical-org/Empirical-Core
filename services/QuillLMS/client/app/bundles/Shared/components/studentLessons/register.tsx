import * as React from 'react';

class Register extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      showIntro: false,
      hasSentenceFragment: this.hasSentenceFragment(),
    }
  }

  componentDidMount() {
    const { previewMode } = this.props;
    if(previewMode) {
      this.startActivity();
    }
  }

  landingPageHtmlHasText(){
    const { lesson, } = this.props
    // strips out everything nested betwee < and >.
    // we should also not allow draft js to send text-less answers from
    // the lp editor
    return lesson.landingPageHtml.replace(/(<([^>]+)>)/ig, "").length > 0;
  }

  startActivity = () => {
    const { lesson, startActivity, } = this.props
    if (lesson.landingPageHtml && this.landingPageHtmlHasText()) {
      this.setState({ showIntro: true, });
    } else {
      startActivity();
    }
  }

  handleStartLessonClick = () => {
    const { startActivity, } = this.props
    startActivity();
  }

  resume = () => {
    const { resumeActivity, session, } = this.props
    resumeActivity(session);
  }

  hasSentenceFragment = () => {
    const { lesson, } = this.props
    const { questions } = lesson;
    for (let i = 0; i < questions.length; i+=1) {
      if (questions[i].questionType === "sentenceFragments") {
        return true;
      }
    }
    return false;
  }

  renderButton = () => {
    const { session, } = this.props
    let onClickFn,
      text;
    if (session) {
      // resume session if one is passed
      onClickFn = this.resume;
      text = <span>Resume</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.startActivity;
      text = <span>Begin</span>;
    }
    return (
      <button className="quill-button focus-on-light primary contained large" onClick={onClickFn} type="button">
        {text}
      </button>
    );
  }

  renderIntro = () => {
    const { lesson, } = this.props
    const { showIntro, hasSentenceFragment, } = this.state
    if (showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: lesson.landingPageHtml, }} />
          <button className="quill-button focus-on-light large primary contained" onClick={this.handleStartLessonClick} type="button">Start activity</button>
        </div>
      );
    } else if (hasSentenceFragment) {
      return (
        <div className="container">
          <h2 className="title is-3 register">
            Welcome to Quill Connect Fragments!
          </h2>
          <div className="register-container">
            <ul className="register-list">
              <li>Add to the group of words to make a complete sentence.</li>
              <li>Add the number of words shown in the directions.</li>
              <li>There is often more than one correct answer.</li>
              <li>Remember to use correct spelling, capitalization, and punctuation!</li>
            </ul>
            {this.renderButton()}
            <br />
          </div>
        </div>
      );
    } else {
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
  }

  render() {
    return (
      <section
        className="student"
        style={{
          paddingTop: 20,
        }}
      >
        {this.renderIntro()}
      </section>
    );
  }
}

export { Register };

