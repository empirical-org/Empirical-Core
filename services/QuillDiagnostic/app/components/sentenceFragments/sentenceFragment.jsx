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

const icon = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`

const NavLink = activeComponent('li');

class SentenceFragment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      uploadingNewOptimalResponses: false
    }
  }

  componentWillMount() {
    const { params, } = this.props
    listenToResponsesWithCallback(
      params.questionID,
      (data) => {
        this.setState({
          responses: data,
          loadedResponses: true,
        });
      }
    );
  }

  getQuestion = () => {
    const { sentenceFragments, params, } = this.props
    return sentenceFragments.data[params.questionID];
  }

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  handleUploadOptimalResponsesClick = () => {
    this.setState({ uploadingNewOptimalResponses: true, });
  }

  cancelEditingSentenceFragment = () => {
    const { dispatch, params, } = this.props
    dispatch(fragmentActions.cancelSentenceFragmentEdit(params.questionID));
  }

  handleEditFragmentClick = () => {
    const { dispatch, params, } = this.props
    dispatch(fragmentActions.startSentenceFragmentEdit(params.questionID));
  }

  saveSentenceFragmentEdits(data) {
    const { dispatch, params, } = this.props
    dispatch(fragmentActions.submitSentenceFragmentEdit(params.questionID, data));
  }

  submitOptimalResponses(responseStrings) {
    const { dispatch, params, } = this.props

    const conceptUID = this.getQuestion().conceptID
    dispatch(submitOptimalResponses(params.questionID, conceptUID, responseStrings))
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  closeModal = () => {
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  renderEditForm = () => {
    const { sentenceFragments, params, concepts, } = this.props
    if (sentenceFragments.states[params.questionID] === C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm
              concepts={concepts}
              data={sentenceFragments.data[params.questionID]}
              mode="Edit"
              submit={this.saveSentenceFragmentEdits}
            />
          </div>
        </Modal>
      );
    }
  }

  renderUploadNewOptimalResponsesForm = () => {
    const { uploadingNewOptimalResponses, } = this.state
    if (!uploadingNewOptimalResponses) { return }

    return (
      <Modal close={this.closeModal}>
        <UploadOptimalResponses submitOptimalResponses={this.submitOptimalResponses} />
      </Modal>
    );
  }

  renderResponseComponent(data, states, questionID) {
    const { dispatch, } = this.props
    if (this.getResponses()) {
      return (
        <ResponseComponent
          admin
          dispatch={dispatch}
          mode='sentenceFragment'
          question={data[questionID]}
          questionID={questionID}
          responses={this.getResponses()}
          states={states}
        />
      );
    }
  }

  render = () => {
    const { sentenceFragments, params, massEdit, children, } = this.props
    const { data, states, hasreceiveddata, } = sentenceFragments;
    const { questionID, } = params;
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      );
    } else if (data[questionID]) {
      // console.log("conceptID: ", sentenceFragments.data[params.questionID].conceptID)
      const activeLink = massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/sentence-fragments/${questionID}/mass-edit`}>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({massEdit.numSelectedResponses})</li>
      return (
        <div>
          {this.renderEditForm()}
          {this.renderUploadNewOptimalResponsesForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
            <h4 className="title" style={{color: '#00c2a2'}}>Flag: {data[questionID].flag}</h4>
          </div>
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img alt="Directions Icon" className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <div className="button-group" style={{ marginTop: 10, }}>
            <button className="button is-info" onClick={this.handleEditFragmentClick} type="button">Edit Fragment</button>
            <button className="button is-info" onClick={this.handleUploadOptimalResponsesClick} type="button">Upload Optimal Responses</button>
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
          {children}
        </div>
      );
    } else {
      return (
        <h1>404</h1>
      );
    }
  }
}

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    concepts: state.concepts,
    routing: state.routing,
    massEdit: state.massEdit
  };
}

export default connect(select)(SentenceFragment);
