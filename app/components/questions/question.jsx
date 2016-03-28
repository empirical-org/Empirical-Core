import React from 'react'
import { connect } from 'react-redux'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'

const Question = React.createClass({

  // renderQuestions: function () {
  //   const {data} = this.props.concepts;
  //   const keys = _.keys(data);
  //   return keys.map((key) => {
  //     console.log(key, data, data[key])
  //     return (<li><Link to={'/admin/concepts/' + key}>{data[key].name}</Link></li>)
  //   })
  // },

  deleteQuestion: function () {
    this.props.dispatch(actions.deleteQuestion(this.props.params.questionID))
  },

  submitNewQuestion: function () {
    this.props.dispatch(questionActions.submitNewQuestion({prompt: this.refs.newQuestionPrompt.value, questionID: this.props.params.questionID}))
  },

  render: function (){
    console.log(this.props.questions)
    const {data} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      return (
        <div>
          <p>Question: {data[questionID].prompt}</p>
          <label className="label">Response text</label>
          <p className="control">
            <input className="input" type="text" ref="newResponse"></input>
          </p>
          <label className="label">Feedback</label>
          <p className="control">
            <input className="input" type="text" ref="newFeedback"></input>
          </p>
          <p className="control">
            <label className="checkbox">
              <input type="checkbox" />
              Optimal?
            </label>
          </p>

          <button className="button is-primary" onClick={this.submitNewResponse}>Add Response</button>
          <br/>
          <button className="button is-danger" onClick={this.deleteQuestion}>Delete Question</button>
        </div>
      )
    } else if (this.props.questions.hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <p>404: No Question Found</p>
      )
    }

  }
})

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Question)
