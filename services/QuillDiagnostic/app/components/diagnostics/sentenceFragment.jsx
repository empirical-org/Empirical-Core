import React, { Component } from 'react';
import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponent';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { question } = this.props;
    const { identified, key }  = question;
    if (key !== nextProps.question.key) {
      return true;
    } else if (identified !== nextProps.question.identified) {
      return true;
    }
    return false;
  }

  handleAttemptSubmission = () => {
    const { submitted } = this.state;
    const { nextQuestion } = this.props;
    if (submitted === false) {
      this.setState(
        { submitted: true, },
        nextQuestion()
      );
    }
  };

  render() {
    return (
      <SentenceFragmentTemplate {...this.props} handleAttemptSubmission={this.handleAttemptSubmission} />
    );
  }
}

export default PlaySentenceFragment;
