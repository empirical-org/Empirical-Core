import * as React from 'react';

export interface Question {
  id:number;
  prompt:string;
  order:number;
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

class QuestionCard extends React.Component<Props, any> {
  renderCardBackground(complete:boolean) {
    const classes:string = `card-status card-status-left ${ complete ? 'bg-teal' : 'bg-blue' }` 
    return (
      <div className={classes}></div>
    )
  }

  render() {

    const {number, question, submission, complete, updateSubmission, updateCompleteness, submitResponse, reset} = this.props;
    return (
      <div className="card question-wrapper">
        {this.renderCardBackground(complete)}
        <div className="card-header">
          <h3 className="card-title">Question {number + 1}</h3>
        </div>
        <div className="card-body">
          <textarea className="form-control" value={submission} onChange={e => updateSubmission(e.target.value, question)}/>
        </div>
        <div className="card-footer d-fl-r jc-sb">
          <div className="m-r-1"><p></p></div>
          <div>
            <button className='btn btn-link m-r-1' onClick={(e) => {
              e.preventDefault();
              reset();
            }}>Reset</button>
            <button className='btn btn-primary' onClick={(e) => {
              e.preventDefault();
              submitResponse({variables: {text: submission, question_id: question.id}});
              updateCompleteness(question.id);
            }}>Submit</button></div>
        </div>
      </div>
    );
  }
}

export default QuestionCard