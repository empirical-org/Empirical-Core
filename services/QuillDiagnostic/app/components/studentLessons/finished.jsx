import React from 'react';
import { Link } from 'react-router';
const C = require('../../constants').default;
import rootRef from '../../libs/firebase';
const sessionsRef = rootRef.child('sessions');
import { Spinner } from 'quill-component-library/dist/componentLibrary';

export default React.createClass({
  getInitialState() {
    return {
      sessionKey: '',
    };
  },

  componentDidMount() {
    const values = {
      name: this.props.name || 'Anonymous',
      lessonID: this.props.lessonID,
      questions: this.props.data.answeredQuestions,
    };
    const sessionRef = sessionsRef.push(values, (error) => {
      this.setState({ sessionKey: sessionRef.key, });
    });
    this.props.saveToLMS();
  },

  getLessonName() {
    return this.props.lesson.name;
  },

  endActivity() {
    this.props.endActivity();
  },

  renderErrorState() {
    return (
      <div className="landing-page">
        <h1>We Couldn't Save Your Lesson.</h1>
        <p>
          Your results could not be saved. <br />Make sure you are connected to the internet.<br />
          You can attempt to save again using the button below.<br />
          If the issue persists, ask your teacher to contact Quill.<br />
          Please provide the following URL to help us solve the problem.
        </p>
        <p><code style={{ fontSize: 14, }}>
          {window.location.href}
        </code></p>
        <button className="button is-info is-large" onClick={this.props.saveToLMS}>Retry</button>
      </div>
    );
  },

  render() {
    if (this.props.error) {
      return this.renderErrorState();
    } else {
      return (
        <div className="landing-page">
          <h1>You've completed the lesson</h1>
          <p>
            Your results are being saved now.
            You'll be redirected automatically once they are saved.
          </p>
          <Spinner />
        </div>
      );
    }
  },
});
