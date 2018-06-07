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

  renderQuestions(questions:Array<Question>, submissions: Submissions) {
    return questions.map((a) => {
      return (
        <textarea className="form-control" value={submissions[a.id]}/>
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

