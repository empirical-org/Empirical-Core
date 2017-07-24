import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import diagnosticQuestionActions from '../../actions/diagnosticQuestions';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import C from '../../constants';
import ResponseComponent from '../questions/responseComponent.jsx';
import Cues from '../renderForQuestions/cues.jsx';
import icon from '../../img/question_icon.svg';
import activeComponent from 'react-router-active-component';
import EditForm from './diagnosticQuestionForm.jsx';
import Modal from '../modal/modal.jsx';
const NavLink = activeComponent('li');

import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses.js';

const DiagnosticQuestion = React.createClass({

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

  startEditingDiagnosticQuestion() {
    this.props.dispatch(diagnosticQuestionActions.startQuestionEdit(this.props.params.questionID));
  },

  saveQuestionEdits(vals) {
    this.props.dispatch(diagnosticQuestionActions.submitQuestionEdit(this.props.params.questionID, vals));
  },

  cancelEditingQuestion() {
    this.props.dispatch(diagnosticQuestionActions.cancelQuestionEdit(this.props.params.questionID));
  },

  getResponses() {
    return this.state.responses;
  },

  deleteDiagnosticQuestion() {
    this.props.dispatch(diagnosticQuestionActions.deleteQuestion(this.props.params.questionID));
  },

  renderEditForm() {
    const { data, } = this.props.diagnosticQuestions,
      { questionID, } = this.props.params;
    const question = (data[questionID]);
    if (this.props.diagnosticQuestions.states[questionID] === C.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditForm question={question} submit={this.saveQuestionEdits} itemLevels={this.props.itemLevels} concepts={this.props.concepts} />
        </Modal>
      );
    }
  },

  render() {
    const { data, states, hasreceiveddata, } = this.props.diagnosticQuestions;
    const { questionID, } = this.props.params;
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      );
    } else if (data[questionID]) {
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/diagnostic-questions/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>
      return (
        <div>
          {this.renderEditForm()}
          <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} style={{ marginBottom: 0, }} />
          <Cues getQuestion={() => data[questionID]} />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <div className="button-group" style={{ marginTop: 10, }}>
            <button className="button is-info" onClick={this.startEditingDiagnosticQuestion}>Edit Question</button>
          </div>

          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/diagnostic-questions/${questionID}/responses`}>Responses</NavLink>
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
    concepts: state.concepts,
    diagnosticQuestions: state.diagnosticQuestions,
    itemLevels: state.itemLevels,
    routing: state.routing,
    massEdit: state.massEdit
  };
}

export default connect(select)(DiagnosticQuestion);
