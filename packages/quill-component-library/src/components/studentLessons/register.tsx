import React from 'react';
const beginArrow = 'https://assets.quill.org/images/icons/begin_arrow.svg';

class Register extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      showIntro: false,
      name: '',
      hasSentenceFragment: this.hasSentenceFragment(),
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.getLessonName = this.getLessonName.bind(this)
    this.landingPageHtmlHasText = this.landingPageHtmlHasText.bind(this)
    this.startActivity = this.startActivity.bind(this)
    this.leaveIntro = this.leaveIntro.bind(this)
    this.resume = this.resume.bind(this)
    this.hasSentenceFragment = this.hasSentenceFragment.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderIntro = this.renderIntro.bind(this)
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, });
  }

  getLessonName() {
    return this.props.lesson.name;
  }

  landingPageHtmlHasText(){
    // strips out everything nested betwee < and >.
    // we should also not allow draft js to send text-less answers from
    // the lp editor
    return this.props.lesson.landingPageHtml.replace(/(<([^>]+)>)/ig, "").length > 0;
  }

  startActivity() {
    if (this.props.lesson.landingPageHtml && this.landingPageHtmlHasText()) {
      this.setState({ showIntro: true, });
    } else {
      this.props.startActivity(this.state.name);
    }
  }

  leaveIntro() {
    this.props.startActivity(this.state.name);
  }

  resume() {
    this.props.resumeActivity(this.props.session);
  }

  hasSentenceFragment() {
    const { questions } = this.props.lesson;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionType === "sentenceFragments") {
        return true;
      }
    }
    return false;
  }

  renderButton() {
    let onClickFn,
      text;
    if (this.props.session) {
      // resume session if one is passed
      onClickFn = this.resume;
      text = <span>Resume</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.startActivity;
      text = <span>Begin</span>;
    }
    return (
      <button className="button student-begin" onClick={onClickFn}>
        {text}
        <img className="begin-arrow" src={beginArrow} />
      </button>
    );
  }

  renderIntro() {
    if (this.state.showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: this.props.lesson.landingPageHtml, }} />
          <button className="button student-begin is-fullwidth" onClick={this.leaveIntro}>Start Lesson</button>
        </div>
      );
    } else if (this.state.hasSentenceFragment) {
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
        className="student" style={{
          paddingTop: 20,
        }}
      >
        {this.renderIntro()}
      </section>
    );
  }
}

export { Register }
