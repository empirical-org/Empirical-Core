import React, { Component } from 'react';
import Cues from '../../renderForQuestions/cues.jsx';
import RenderSentenceFragments from '../../renderForQuestions/sentenceFragments.jsx';
import icon from '../../../img/question_icon.svg';
import TextEditor from '../../renderForQuestions/renderTextEditor.jsx';

class SingleAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      editing: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSubmission = this.submitSubmission.bind(this);
  }

  submitSubmission() {
    this.props.handleStudentSubmission(this.state.response);
  }

  handleChange(e) {
    this.setState({ editing: true, response: e, });
  }

  renderProject() {
    const { selected_submissions, submissions, } = this.props;
    const selected = Object.keys(selected_submissions).map(key => (
      <li>
        {submissions[key]}
      </li>
    ));
    return (
      <ul>
        {selected}
      </ul>
    );
  }

  modeAppropriateRender() {
    if (this.props.mode === 'PROJECT') {
      return this.renderProject();
    } else {
      return (
        <TextEditor
          className={'textarea is-question is-disabled'} defaultValue={''}
          value={this.state.response}
          disabled={false} checkAnswer={this.submitSubmission}
          hasError={undefined} handleChange={this.handleChange}
          placeholder="Type your answer here."
        />
      );
    }
  }

  render() {
    console.log(this.props.data);
    return (
      <div>
        <RenderSentenceFragments prompt={this.props.data.play.prompt} />
        <Cues
          getQuestion={() => ({
            cues: this.props.data.play.cues,
          })
        }
          displayArrowAndText={false}
        />
        <div className="feedback-row">
          <img src={icon} />
          <p>{this.props.data.play.instructions}</p>
        </div>
        {this.modeAppropriateRender()}

      </div>
    );
  }

}

export default SingleAnswer;
