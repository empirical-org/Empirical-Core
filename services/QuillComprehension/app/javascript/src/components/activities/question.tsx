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

  renderSubmitButton(complete:boolean, clickSubmitButton){
    if (complete) return (
      <button className='btn btn-success' onClick={(e) => e.preventDefault()}>
        Submitted
      </button>
    )
    return (<button className='btn btn-primary' onClick={clickSubmitButton}>Submit</button>)
  }

  render() {

    const {number, question, submission, complete, updateSubmission, updateCompleteness, submitResponse, reset} = this.props;
    const clickSubmitButton = (e) => {
      e.preventDefault();
      submitResponse({variables: {text: submission, question_id: question.id}});
      updateCompleteness(question.id);
    }
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
            {this.renderSubmitButton(complete, clickSubmitButton)}
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionCard