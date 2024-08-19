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
    const { previewMode, lesson } = this.props;
    if (previewMode) {
      this.startActivity();
    }
  }

  handleSetShowIntro = () => {
    this.setState({ showIntro: true, });
  }

  landingPageHtmlHasText(){
    const { lesson, } = this.props
    // strips out everything nested betwee < and >.
    // we should also not allow draft js to send text-less answers from
    // the lp editor
    return lesson.landingPageHtml.replace(/(<([^>]+)>)/ig, "").length > 0;
  }

  startActivity = () => {
    const { showIntro, } = this.state
    const { lesson, startActivity, } = this.props
    if (lesson.landingPageHtml && this.landingPageHtmlHasText() && !showIntro) {
      this.setState({ showIntro: true, });
    } else {
      startActivity();
    }
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

  renderButton = (showIntro) => {
    const { session, translate, showTranslation } = this.props
    let onClickFn, text;

    if (session) {
      // resume session if one is passed
      onClickFn = this.resume;
      text = showTranslation ? translate('buttons^resume') : 'Resume'
    } else if (showIntro) {
      // this and the following conditional have the same action because the function handles what should happen next  
      onClickFn = this.startActivity;
      text = showTranslation ? translate('buttons^begin') : 'Begin'
    } else {
      // otherwise begin new session
      onClickFn = this.startActivity;
      text = showTranslation ? translate('buttons^start activity') : 'Start activity'
    }
    return (
      <button className="quill-button-archived focus-on-light primary contained large" onClick={onClickFn} type="button">
        {text}
      </button>
    );
  }

  translatedText = (): string => {
    const { lesson, language} = this.props;
    const { translations, } = lesson;
    return translations && translations[language];
  }


  renderIntro = () => {
    const { lesson } = this.props
    const { showIntro, hasSentenceFragment, } = this.state
    const translatedText = this.translatedText()
    if (showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: lesson.landingPageHtml, }} />
          {translatedText && (
            <React.Fragment>
              <hr />
              <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: translatedText }} />
            </React.Fragment>
          )}
          {this.renderButton(showIntro)}
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
            {this.renderButton(showIntro)}
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
            {this.renderButton(showIntro)}
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
