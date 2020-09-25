import * as React from 'react';

import { countSentences } from '../../lib/countSentences';

export interface Question {
  id:number;
  prompt:string;
  order:number;
  instructions?:string;
}

export interface Props {
  question: Question;
  number: number;
  submission: string;
  complete: boolean | null;
  updateSubmission: Function;
  updateCompleteness: Function;
  submitResponse: Function;
  reset: Function;
}

export interface State {
  error: string|null
}

class QuestionCard extends React.Component<Props, State> {
  constructor(props){
    super(props);
    this.state = {error: null}
  }

  renderCardBackground(complete:boolean, error:string|null) {
    let classes = 'card-status card-status-left'
    if (error) {
      classes += ' bg-warning'
    } else if (complete) {
      classes += ' bg-teal'
    } else {
      classes += ' bg-blue'
    }
    return (
      <div className={classes} />
    )
  }

  renderSubmitButton(complete:boolean, clickSubmitButton){
    if (complete) return (
      <button className='btn btn-success' onClick={(e) => e.preventDefault()}>
        Submitted
      </button>
    )
    return (<button className='btn btn-primary' onClick={clickSubmitButton}>Submit</button>)
  }

  renderInstructions(question) {
    if (question.instructions) {
      return (<div className="card-sub-header">
        <p className="instructions">{question.instructions}</p>
      </div>)
    }
  }

  render() {

    const {number, question, submission, complete, updateSubmission, updateCompleteness, submitResponse, reset} = this.props;
    const clickSubmitButton = (e) => {
      this.setState({error: null})
      e.preventDefault();
      if (submission === question.prompt) return this.setState({error: "You need to complete the sentence."})
      if (countSentences(submission) > 1) return this.setState({error: "You only need to write one sentence."})
      if (countSentences(submission) < 1) return this.setState({error: "You need to write something."})
      submitResponse({variables: {text: submission, question_id: question.id}});
      updateCompleteness(question.id);
    }
    return (
      <div className="card question-wrapper">
        {this.renderCardBackground(complete, this.state.error)}
        <div className="card-header">
          <h3 className="card-title">Question {number + 1}</h3>
        </div>
        {this.renderInstructions(question)}
        <div className="card-body p-0">
          <textarea className="form-control question" onChange={e => updateSubmission(e.target.value, question)} value={submission} />
        </div>
        <div className="card-footer d-fl-r jc-sb">
          <div className="m-r-1 d-fl-r ai-c">{this.state.error}</div>
          <div>
            <button
              className='btn btn-link m-r-1'
              onClick={(e) => {
              e.preventDefault();
              reset();
            }}
            >Reset</button>
            {this.renderSubmitButton(complete, clickSubmitButton)}
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionCard
