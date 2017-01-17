import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import diagnosticQuestionActions from '../../actions/diagnosticQuestions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'
import ResponseComponent from '../questions/responseComponent.jsx'
import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses.js'

const DiagnosticQuestion =  React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
    };
  },

  componentWillMount() {
    const { questionID, } = this.props.params;
    // this.props.dispatch(loadResponseDataAndListen(questionID));
    listenToResponsesWithCallback(
      questionID,
      (data) => {
        this.setState({
          responses: data,
          loadedResponses: true
        })
      }
    )
  },

  componentWillUnmount: function () {
    console.log("Unmounting");
    const questionID = this.props.params.questionID;
    this.props.dispatch(stopListeningToResponses(questionID))
  },

  getResponses: function () {
    return this.state.responses
  },

  render: function () {
    const {data, states, hasreceiveddata} = this.props.diagnosticQuestions;
    const {questionID} = this.props.params
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      )
    } else if (data[questionID]) {
      return (
        <div>
          <h4 className="title">{data[questionID].text}</h4>
          <div className="button-group">
            <button className="button is-info" onClick={this.startEditingDiagnosticQuestion}>Edit Question</button>
            <Link to={"admin/sentence-fragments"}>
              <button className="button is-danger" onClick={this.deleteDiagnosticQuestion}>Delete Question</button>
            </Link>
          </div>
          <br />
          <ResponseComponent
          question={data[questionID]}
          responses={this.getResponses()}
          questionID={questionID}
          states={states}
          dispatch={this.props.dispatch}
          admin={true}
          mode={"diagnosticQuestion"}/>
        </div>
      )
    } else {
      return (
        <h1>404</h1>
      )
    }

  },

})


function select(state) {
  return {
    concepts: state.concepts,
    diagnosticQuestions: state.diagnosticQuestions,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(DiagnosticQuestion)
