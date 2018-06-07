import * as React from 'react';

export interface Question {
  id:number;
  prompt:string;
  order:number;
}

export interface Submissions {
  [key:number]: string
}

export interface AppProps {
  questions: Array<Question>
}

export interface AppState {
  submissions: Submissions
}

export default class AppComponent extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      submissions: {}
    }
    props.questions.forEach((question) => {
      this.state.submissions[question.id] = question.prompt
    })
  };

  updateSubmission(newValue:string, question:Question) {
    const prompt = question.prompt;
    const promptLength = prompt.length
    console.log("substring", newValue.substr(0, promptLength))
    if (newValue.substr(0, promptLength) === prompt) {
      const newState = Object.assign({}, this.state)
      newState.submissions[question.id] = newValue
      this.setState(newState)
    }
  }

  renderQuestions(questions:Array<Question>, submissions: Submissions) {
    return questions.map((a, i) => {
      return (
        <div className='form-group' key={i}>
          <label className='form-label'>Question {i +1}</label>
          <textarea className="form-control" value={submissions[a.id]} onChange={e => this.updateSubmission(e.target.value, a)}/>
        </div>
      )
    })
  } 

  render() {
    return (
      <div className="article-card">
        {this.renderQuestions(this.props.questions, this.state.submissions)}
      </div>
    );
  }
}

