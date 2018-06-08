import * as React from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const SUBMIT_RESPONSE = gql`
  mutation submitResponse($text: String!, $question_id: ID!)  {
    createNewResponse(text: $text, question_id: $question_id) {
      id
      text
      submissions
    }
  }
`;

export interface Question {
  id:number;
  prompt:string;
  order:number;
}

export interface Submissions {
  [key:number]: string
}

export interface CompleteHash {
  [key:number]: boolean
}
export interface AppProps {
  questions: Array<Question>
}

export interface AppState {
  submissions: Submissions
  complete: CompleteHash
}

export default class AppComponent extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      submissions: {},
      complete: {},
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
          <Mutation mutation={SUBMIT_RESPONSE}>
            {(submitResponse, { data }) => (
              <button className='btn btn-primary' onClick={(e) => {
                e.preventDefault();
                submitResponse({variables: {text: this.state.submissions[a.id], question_id: a.id}});
                const newState = {complete: {}};
                newState.complete[a.id] = true
                this.setState(Object.assign(this.state, newState));
              }}>Submit</button>
            )}
          </Mutation>
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

