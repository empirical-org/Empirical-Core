import React from 'react';
import { connect } from 'react-redux';
import ResponseComponent from '../questions/responseComponent.jsx';
import Modal from '../modal/modal.jsx';
import EditForm from './sentenceFragmentForm.jsx';
import fragmentActions from '../../actions/sentenceFragments.js';
import C from '../../constants';
import { Link } from 'react-router';
import icon from '../../img/question_icon.svg';

import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses.js';

const SentenceFragment = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
    };
  },

  componentWillMount() {
    const questionID = this.props.params.questionID;
    // this.props.dispatch(loadResponseDataAndListen(questionID));
    listenToResponsesWithCallback(
      questionID,
      (data) => {
        this.setState({
          responses: data,
          loadedResponses: true,
        });
      }
    );
  },

  componentWillUnmount() {
    console.log('Unmounting');
    const questionID = this.props.params.questionID;
    this.props.dispatch(stopListeningToResponses(questionID));
  },

  getResponses() {
    return this.state.responses;
  },

  cancelEditingSentenceFragment() {
    this.props.dispatch(fragmentActions.cancelSentenceFragmentEdit(this.props.params.questionID));
  },

  startEditingSentenceFragment() {
    this.props.dispatch(fragmentActions.startSentenceFragmentEdit(this.props.params.questionID));
  },

  deleteSentenceFragment() {
    this.props.dispatch(fragmentActions.deleteSentenceFragment(this.props.params.questionID));
  },

  saveSentenceFragmentEdits(data) {
    this.props.dispatch(fragmentActions.submitSentenceFragmentEdit(this.props.params.questionID, data));
  },

  renderEditForm() {
    if (this.props.sentenceFragments.states[this.props.params.questionID] === C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm
              mode="Edit" data={this.props.sentenceFragments.data[this.props.params.questionID]}
              submit={this.saveSentenceFragmentEdits} concepts={this.props.concepts}
            />
          </div>
        </Modal>
      );
    }
  },

  renderResponseComponent(data, states, questionID) {
    if (this.getResponses()) {
      return (
        <ResponseComponent
          question={data[questionID]}
          responses={this.getResponses()}
          questionID={questionID}
          states={states}
          dispatch={this.props.dispatch}
          admin
          mode={'sentenceFragment'}
        />
      );
    }
  },

  render() {
    const { data, states, hasreceiveddata, } = this.props.sentenceFragments;
    const { questionID, } = this.props.params;
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      );
    } else if (data[questionID]) {
      // console.log("conceptID: ", this.props.sentenceFragments.data[this.props.params.questionID].conceptID)

      return (
        <div>
          {this.renderEditForm()}
          <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} style={{ marginBottom: 0, }} />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <div className="button-group" style={{ marginTop: 10, }}>
            <button className="button is-info" onClick={this.startEditingSentenceFragment}>Edit Fragment</button>
            <Link to={'admin/sentence-fragments'}>
              <button className="button is-danger" onClick={this.deleteSentenceFragment}>Delete Fragment</button>
            </Link>
          </div>
          <br />
          {this.props.children}
        </div>
      );
    } else {
      return (
        <h1>404</h1>
      );
    }
  },
});

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    concepts: state.concepts,
    routing: state.routing,
    // responses: state.responses
  };
}

export default connect(select)(SentenceFragment);
