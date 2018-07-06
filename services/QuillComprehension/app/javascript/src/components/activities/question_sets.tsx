import React from 'react';
import { chooseQuestionSet } from '../../actions/activities';

export interface QuestionSet {
  id:number;
  prompt:string;
  order:number
}

interface AppProps {
  questionSetId: string|null;
  questionSets: Array<QuestionSet>;
  chooseQuestionSet: (questionSetId:number) => void;
}

class QuestionSets extends React.Component<AppProps, any> {

  renderOptions(questionSets:Array<QuestionSet>, chooseQuestionSet:(questionSetId:number) => void)  {
    return questionSets.map((qs, i) => {
      const margin = i === questionSets.length - 1 ? "" : "m-r-1"
      return (
        <div className={`card ${margin}`} key={qs.id} onClick={() => chooseQuestionSet(qs.id)}>
          <div className="card-body">
            <p className="question-set-prompt">{qs.prompt}</p>
          </div>
        </div>
      )
    })
  }

  render() {
    const {questionSets, chooseQuestionSet} = this.props
    return (
      <div className="card question-wrapper">
        <div className="card-header">
          <h3 className="card-title">Choose Your Position On The Issue</h3>
        </div>
        <div className="card-body">
          <div className="question-wrapper d-fl-r ai-sb jc-c">
            {this.renderOptions(questionSets, chooseQuestionSet)}
          </div>
        </div>
        <div className="card-footer d-fl-r jc-sb">
        <div className="m-r-1 d-fl-r ai-c">When you have made your decision, click done.</div>
          <button className="btn btn-primary" onClick={() => {}}>Done</button>
        </div>
      </div>
    );
  }

}

export default QuestionSets