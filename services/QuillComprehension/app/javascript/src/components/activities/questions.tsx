import * as React from 'react';
import {connect} from 'react-redux'
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import * as R from 'ramda'

import QuestionCard from './question';

import {updateSubmission, completeQuestion} from '../../actions/activities'
import {ActivitiesState} from '../../reducers/activities'

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
  instructions?:string;
}

export interface Submissions {
  [key:number]: string
}

export interface CompleteHash {
  [key:number]: boolean
}
export interface AppProps extends DispatchFromProps,StateFromProps {
  questions: Array<Question>
}

export interface AppState {
}

class QuestionComponent extends React.Component<AppProps, any> {
  constructor(props) {
    super(props);
    props.questions.forEach((question) => {
      props.updateSubmission(question.id, question.prompt)
    })
    this.updateSubmission = this.updateSubmission.bind(this);
  };


  updateSubmission(newValue:string, question:Question) {
    const prompt = question.prompt;
    const promptLength = prompt.length
    if (newValue.substr(0, promptLength) === prompt) {
      this.props.updateSubmission(question.id, newValue);
    }
  }

  allComplete(questions:Array<Question>, completedQuestions:CompleteHash): boolean{
    let complete = true;
    questions.forEach((question) => {
      complete = !!completedQuestions[question.id] && complete
    })
    return complete
  }

  orderQuestions(questions:Array<Question>):Array<Question> {
    const sortByOrder = R.sortBy(R.prop('order'));
    return sortByOrder(questions)
  }

  renderQuestions(questions:Array<Question>, submissions: Submissions) {
    return this.orderQuestions(questions).map((a, i) => {
      return (
        <Mutation key={a.id} mutation={SUBMIT_RESPONSE}>
          {(submitResponse, { data }) => (
            <QuestionCard
              complete={this.props.activities.complete[a.id]}
              number={i}
              question={a}
              reset={() => {this.props.resetQuestion(a)}}
              submission={this.props.activities.submissions[a.id]}
              submitResponse={submitResponse}
              updateCompleteness={this.props.markQuestionAsComplete}
              updateSubmission={this.updateSubmission}
            />
          )}
        </Mutation>
      )
    })
  }

  render() {
    if (this.allComplete(this.props.questions, this.props.activities.complete)) {
      return (
        <div className="article-card">
          <p>Thanks for playing! Your unique code is: <strong>{Math.random().toString(36).substring(2)}</strong></p>
        </div>
      )
    }
    return (
      <div>
        {this.renderQuestions(this.props.questions, this.props.activities.submissions)}
      </div>
    );
  }
}

interface StateFromProps {
  activities: ActivitiesState
}

interface DispatchFromProps {
  resetQuestion: (question:Question) => void;
  updateSubmission: (questionId:number, submission:string) => void;
  markQuestionAsComplete: (questionId:number) => void;
}

const mapStateToProps = state => {
  return {
    activities: state.activities
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetQuestion: (question:Question) => {
      dispatch(updateSubmission(question.id, question.prompt))
    },
    updateSubmission: (questionId:number, submission:string) => {
      dispatch(updateSubmission(questionId, submission))
    },
    markQuestionAsComplete: (questionId:number) => {
      dispatch(completeQuestion(questionId))
    },
  }
}

export default connect<StateFromProps, DispatchFromProps, {questions: Array<Question>}>(mapStateToProps,mapDispatchToProps)(QuestionComponent)
