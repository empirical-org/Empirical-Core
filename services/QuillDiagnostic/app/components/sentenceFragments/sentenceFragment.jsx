import React from 'react';
import { connect } from 'react-redux';
import ResponseComponent from '../questions/responseComponent.jsx';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import EditForm from './sentenceFragmentForm.jsx';
import fragmentActions from '../../actions/sentenceFragments.js';
import C from '../../constants';
import { Link } from 'react-router';
import icon from `${process.env.QUILL_CDN}/images/icons/question_icon.svg`;

import {
  listenToResponsesWithCallback
} from '../../actions/responses.js';
import activeComponent from 'react-router-active-component';
const NavLink = activeComponent('li');

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

  getResponses() {
    return this.state.responses;
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
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>
      return (
        <div>
          {this.renderEditForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }}/>
            <h4 style={{color: '#00c2a2'}} className="title">Flag: {data[questionID].flag}</h4>
          </div>
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <div className="button-group" style={{ marginTop: 10, }}>
            <button className="button is-info" onClick={this.startEditingSentenceFragment}>Edit Fragment</button>
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
