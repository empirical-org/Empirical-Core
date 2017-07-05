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
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSubmission = this.submitSubmission.bind(this);
  }

  submitSubmission() {
    this.props.handleStudentSubmission(this.state.response);
    this.setState({submitted: true})
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
      const textBoxDisabled = this.state.submitted ? true : false;
      return (
        <TextEditor
          defaultValue={''}
          value={this.state.response}
          disabled={textBoxDisabled}
          checkAnswer={this.submitSubmission}
          hasError={undefined}
          handleChange={this.handleChange}
          placeholder="Type your answer here."
        />
      );
    }
  }

  renderInstructions() {
    if (this.state.submitted) {
      return <div className="feedback-row">
          <p><i className="fa fa-check-circle" aria-hidden="true"></i>Great Work! Please wait as your teacher reviews your answer...</p>
        </div>
    } else if (this.props.data.play.instructions) {
      return <div className="feedback-row">
          <img src={icon} />
          <p>{this.props.data.play.instructions}</p>
        </div>
    }
  }

  renderCues() {
    if (this.props.data.play.cues) {
      return (
        <Cues
          getQuestion={() => ({
            cues: this.props.data.play.cues,
          })
        }
          displayArrowAndText={false}
        />
      )
    } else {
      return (
        <span></span>
      )
    }


  }

  render() {
    console.log(this.props.data);
    return (
      <div>
        <RenderSentenceFragments prompt={this.props.data.play.prompt} />
        {this.renderCues()}
        {this.renderInstructions()}
        {this.modeAppropriateRender()}
        <div className="question-button-group">
          <button disabled={this.state.submitted} onClick={this.submitSubmission} className="button student-submit">Submit</button>
        </div>

      </div>
    );
  }

}

export default SingleAnswer;
