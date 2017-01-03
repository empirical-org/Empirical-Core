import React from 'react';
import beginArrow from '../../img/begin_arrow.svg';

export default React.createClass({
  getInitialState() {
    return {
      showIntro: false,
      name: '',
    };
  },

  // componentWillMount() {
  //   this.props.getResponses(this.props.lesson.questions);
  // },

  handleNameChange(e) {
    this.setState({ name: e.target.value, });
  },

  getLessonName() {
    return this.props.lesson.name;
  },

  startActivity() {
    if (this.props.lesson.landingPageHtml) {
      this.setState({ showIntro: true, });
    } else {
      this.props.startActivity(this.state.name);
    }
  },

  leaveIntro() {
    this.props.startActivity(this.state.name);
  },

  resume() {
    this.props.resumeActivity(this.props.session);
  },

  // renderResume: function () {
  //   if (this.props.session) {
  //     return (
  //       <button className="button student-begin is-fullwidth" onClick={this.resume}>Resume</button>
  //     )
  //   }
  // },
  //
  // renderBegin: function (){
  //   return (
  //     <button className="button student-begin is-fullwidth" onClick={this.startActivity}>Start</button>{this.renderResume()}
  //   )
  // },

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
  },

  renderIntro() {
    if (this.state.showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: this.props.lesson.landingPageHtml, }} />
          <button className="button student-begin is-fullwidth" onClick={this.leaveIntro}>Start Lesson</button>
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
  },

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
  },
});
