import React from 'react';
import activeComponent from 'react-router-active-component';
import { connect } from 'react-redux';
import { Modal, UploadOptimalResponses } from 'quill-component-library/dist/componentLibrary';

import EditForm from './sentenceFragmentForm.jsx';
import ResponseComponent from '../questions/responseComponent.jsx';
import fragmentActions from '../../actions/sentenceFragments.js';
import {
  submitOptimalResponses,
  listenToResponsesWithCallback
} from '../../actions/responses';
import C from '../../constants';

const icon = 'https://assets.quill.org/images/icons/question_icon.svg'

const NavLink = activeComponent('li');

const SentenceFragment = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      uploadingNewOptimalResponses: false
    };
  },

  componentWillMount() {
    const questionID = this.props.params.questionID;
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

  getQuestion() {
    const { data, } = this.props.sentenceFragments;
    const { questionID, } = this.props.params;
    return data[questionID];
  },

  getResponses() {
    return this.state.responses;
  },

  startUploadingNewOptimalResponses() {
    this.setState({ uploadingNewOptimalResponses: true, });
  },

  cancelEditingSentenceFragment() {
    this.props.dispatch(fragmentActions.cancelSentenceFragmentEdit(this.props.params.questionID));
  },

  startEditingSentenceFragment() {
    this.props.dispatch(fragmentActions.startSentenceFragmentEdit(this.props.params.questionID));
  },

  saveSentenceFragmentEdits(data) {
    this.props.dispatch(fragmentActions.submitSentenceFragmentEdit(this.props.params.questionID, data));
  },

  submitOptimalResponses(responseStrings) {
    const conceptUID = this.getQuestion().conceptID
    this.props.dispatch(submitOptimalResponses(this.props.params.questionID, conceptUID, responseStrings))
    this.setState({ uploadingNewOptimalResponses: false, })
  },

  renderEditForm() {
    if (this.props.sentenceFragments.states[this.props.params.questionID] === C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm
              concepts={this.props.concepts}
              data={this.props.sentenceFragments.data[this.props.params.questionID]}
              mode="Edit"
              submit={this.saveSentenceFragmentEdits}
            />
          </div>
        </Modal>
      );
    }
  },

  renderUploadNewOptimalResponsesForm() {
    if (this.state.uploadingNewOptimalResponses) {
      return (
        <Modal close={() => { this.setState({ uploadingNewOptimalResponses: false, }); }}>
          <UploadOptimalResponses submitOptimalResponses={this.submitOptimalResponses} />
        </Modal>
      );
    }
  },

  renderResponseComponent(data, states, questionID) {
    if (this.getResponses()) {
      return (
        <ResponseComponent
          admin
          dispatch={this.props.dispatch}
          mode={'sentenceFragment'}
          question={data[questionID]}
          questionID={questionID}
          responses={this.getResponses()}
          states={states}
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
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>
      return (
        <div>
          {this.renderEditForm()}
          {this.renderUploadNewOptimalResponsesForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }}/>
            <h4 className="title" style={{color: '#00c2a2'}}>Flag: {data[questionID].flag}</h4>
          </div>
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <div className="button-group" style={{ marginTop: 10, }}>
            <button className="button is-info" onClick={this.startEditingSentenceFragment}>Edit Fragment</button>
            <button className="button is-info" onClick={this.startUploadingNewOptimalResponses}>Upload Optimal Responses</button>
          </div>

          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/sentence-fragments/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`admin/sentence-fragments/${questionID}/test`}>Play Question</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/choose-model`}>{data[questionID].modelConceptUID ? 'Edit' : 'Add'} Model Concept</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/focus-points`}>{data[questionID].focusPoints ? 'Edit' : 'Add'} Focus Points</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/incorrect-sequences`}>{data[questionID].incorrectSequences ? 'Edit' : 'Add'} Incorrect Sequences</NavLink>
              {activeLink}
            </ul>
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
    massEdit: state.massEdit,
    // responses: state.responses
  };
}

export default connect(select)(SentenceFragment);
