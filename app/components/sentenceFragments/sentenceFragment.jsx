import React from 'react'
import { connect } from 'react-redux'
import ResponseComponent from '../questions/responseComponent.jsx'
import Modal from '../modal/modal.jsx'
import EditForm from './sentenceFragmentForm.jsx'
import fragmentActions from '../../actions/sentenceFragments.js'
import C from '../../constants'
import {Link} from 'react-router'
import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses.js'


const SentenceFragment = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
    };
  },

  componentWillMount() {
    const questionID = this.props.params.sentenceFragmentID;
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
    const questionID = this.props.params.sentenceFragmentID;
    this.props.dispatch(stopListeningToResponses(questionID))
  },

  getResponses: function () {
    return this.state.responses
  },

  cancelEditingSentenceFragment: function() {
    this.props.dispatch(fragmentActions.cancelSentenceFragmentEdit(this.props.params.sentenceFragmentID))
  },

  startEditingSentenceFragment: function() {
    this.props.dispatch(fragmentActions.startSentenceFragmentEdit(this.props.params.sentenceFragmentID))
  },

  deleteSentenceFragment: function() {
    this.props.dispatch(fragmentActions.deleteSentenceFragment(this.props.params.sentenceFragmentID))
  },

  saveSentenceFragmentEdits: function(data) {
    this.props.dispatch(fragmentActions.submitSentenceFragmentEdit(this.props.params.sentenceFragmentID, data))
  },

  renderEditForm: function() {
    if(this.props.sentenceFragments.states[this.props.params.sentenceFragmentID]===C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm mode="Edit" data={this.props.sentenceFragments.data[this.props.params.sentenceFragmentID]}
                      submit={this.saveSentenceFragmentEdits} concepts={this.props.concepts}/>
          </div>
        </Modal>
      )
    }
  },

  render() {
    const {data, states, hasreceiveddata} = this.props.sentenceFragments;
    const {sentenceFragmentID} = this.props.params
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      )
    } else if (data[sentenceFragmentID]) {
      // console.log("conceptID: ", this.props.sentenceFragments.data[this.props.params.sentenceFragmentID].conceptID)

      return (
        <div>
          <h4 className="title">{data[sentenceFragmentID].prompt}</h4>
          {this.renderEditForm()}
          <div className="button-group">
            <button className="button is-info" onClick={this.startEditingSentenceFragment}>Edit Fragment</button>
            <Link to={"admin/sentence-fragments"}>
              <button className="button is-danger" onClick={this.deleteSentenceFragment}>Delete Fragment</button>
            </Link>
          </div>
          <br />
          <ResponseComponent
          question={data[sentenceFragmentID]}
          responses={this.getResponses()}
          questionID={sentenceFragmentID}
          states={states}
          dispatch={this.props.dispatch}
          admin={true}
          mode={"sentenceFragment"}/>
        </div>
      )
    } else {
      return (
        <h1>404</h1>
      )
    }

  }
})

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    concepts: state.concepts,
    routing: state.routing,
    // responses: state.responses
  }
}

export default connect(select)(SentenceFragment)
