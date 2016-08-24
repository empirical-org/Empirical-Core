import React from 'react'
import { connect } from 'react-redux'
import ResponseComponent from '../questions/responseComponent.jsx'
import Modal from '../modal/modal.jsx'
import EditForm from './sentenceFragmentForm.jsx'
import fragmentActions from '../../actions/sentenceFragments.js'
import C from '../../constants'

const SentenceFragment = React.createClass({
  getInitialState: function() {
    if(this.props.sentenceFragments.hasreceiveddata) {
      const fragment = this.props.sentenceFragments.data[this.props.params.sentenceFragmentID]
      return {
        prompt: fragment.prompt,
        questionText: fragment.questionText,
        isFragment: fragment.isFragment,
        optimalResponseText: fragment.optimalResponseText ? fragment.optimalResponseText : "",
        needsIdentification: fragment.needsIdentification ? fragment.needsIdentification : true
      }
    } else {
      return {
        prompt: "",
        questionText: "",
        optimalResponseText: "",
        needsIdentification: true
      }
    }
  },

  cancelEditingSentenceFragment: function() {
    this.props.dispatch(fragmentActions.cancelSentenceFragmentEdit(this.props.params.sentenceFragmentID))
  },

  startEditingSentenceFragment: function() {
    this.props.dispatch(fragmentActions.startSentenceFragmentEdit(this.props.params.sentenceFragmentID))
  },

  saveSentenceFragmentEdits: function() {
    this.props.dispatch(fragmentActions.submitSentenceFragmentEdit(this.props.params.sentenceFragmentID, this.state))
  },

  handleChange: function (key, e) {
    switch (key) {
      case 'prompt':
        this.setState({prompt: e.target.value})
        break;
      case 'questionText':
        this.setState({questionText: e.target.value})
        break;
      case 'optimalResponseText':
        this.setState({optimalResponseText: e.target.value})
        break;
      case 'isFragment':
        this.setState({isFragment: e.target.checked})
        break;
      case 'needsIdentification':
        this.setState({needsIdentification: e.target.checked})
      default:
        return
    }
  },

  renderEditForm: function() {
    if(this.props.sentenceFragments.states[this.props.params.sentenceFragmentID]===C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm data={this.props.sentenceFragments.data[this.props.params.sentenceFragmentID]}
                      handleChange={this.handleChange} submit={this.saveSentenceFragmentEdits}/>
          </div>
        </Modal>
      )
    }
  },

  render() {
    console.log("props: ", this.props)
    const {data, states, hasreceiveddata} = this.props.sentenceFragments;
    const {sentenceFragmentID} = this.props.params
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      )
    } else if (data[sentenceFragmentID]) {
      return (
        <div>
          <p>{data[sentenceFragmentID].questionText}</p>
          {this.renderEditForm()}
          <button className="button is-info" onClick={this.startEditingSentenceFragment}>Edit</button>
          <ResponseComponent
          question={data[sentenceFragmentID]}
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
    routing: state.routing
  }
}

export default connect(select)(SentenceFragment)
