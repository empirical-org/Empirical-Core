import React from 'react';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import EditForm from './sentenceFragmentForm.jsx';
import ResponseComponent from '../questions/responseComponent.jsx';
import fragmentActions from '../../actions/sentenceFragments';
import {
  submitOptimalResponses,
  listenToResponsesWithCallback
} from '../../actions/responses';
import C from '../../constants';
import FocusPointsContainer from '../focusPoints/focusPointsContainer.jsx';
import EditFocusPointsContainer from '../focusPoints/editFocusPointsContainer.jsx';
import NewFocusPointsContainer from '../focusPoints/newFocusPointsContainer.jsx';
import IncorrectSequenceContainer from '../incorrectSequence/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from '../incorrectSequence/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from '../incorrectSequence/newIncorrectSequenceContainer.jsx';
import ResponseComponentWrapper from '../questions/responseRouteWrapper.jsx';
import ChooseModelContainer from './chooseModelContainer.jsx';
import TestQuestionContainer from './testSentenceFragmentContainer';
import MassEditContainer from '../questions/massEditContainer.jsx';
import { Modal, UploadOptimalResponses, } from '../../../Shared/index'

const icon = `${process.env.CDN_URL}/images/icons/direction.svg`

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

  getQuestion = () => {
    const { sentenceFragments, match } = this.props
    const { params } = match
    const { questionID } = params
    const { data } = sentenceFragments
    return data[questionID];
  }

  cancelEditingSentenceFragment = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    dispatch(fragmentActions.cancelSentenceFragmentEdit(questionID));
  }

  closeModal = () => {
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  handleEditFragmentClick = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    dispatch(fragmentActions.startSentenceFragmentEdit(questionID));
  }

  handleUploadOptimalResponsesClick = () => {
    this.setState({ uploadingNewOptimalResponses: true, });
  }

  saveSentenceFragmentEdits = (data) => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    dispatch(fragmentActions.submitSentenceFragmentEdit(questionID, data));
  }

  submitOptimalResponses(responses) {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const conceptUID = this.getQuestion().conceptID
    dispatch(submitOptimalResponses(questionID, conceptUID, responses, concepts))
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  renderEditForm = () => {
    const { sentenceFragments, match, concepts, } = this.props
    const { data, states } = sentenceFragments
    const { params } = match
    const { questionID } = params
    if (states[questionID] === C.EDITING_SENTENCE_FRAGMENT) {
      return (
        <Modal close={this.cancelEditingSentenceFragment}>
          <div className="box">
            <h6 className="title is-h6">Edit Sentence Fragment</h6>
            <EditForm
              concepts={concepts}
              data={data[questionID]}
              mode="Edit"
              submit={this.saveSentenceFragmentEdits}
            />
          </div>
        </Modal>
      );
    }
  }

  renderResponseComponent(data, states, questionID) {
    const { dispatch, } = this.props
    const { responses } = this.state
    if (responses) {
      return (
        <ResponseComponent
          admin
          dispatch={dispatch}
          mode='sentenceFragment'
          question={data[questionID]}
          questionID={questionID}
          responses={responses}
          states={states}
        />
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

  render = () => {
    const { sentenceFragments, match, massEdit } = this.props
    const { data, hasreceiveddata, } = sentenceFragments;
    const { params } = match
    const { questionID } = params;
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      );
    } else if (data[questionID]) {
      const activeLink = massEdit.numSelectedResponses > 1
        ? <NavLink activeClassName="is-active" to='mass-edit'>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
        : <li style={{color: "#a2a1a1"}}>Mass Edit ({massEdit.numSelectedResponses})</li>
      return (
        <div className="admin-container">
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
              <NavLink activeClassName="is-active" to={`${match.url}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to='test'>Play Question</NavLink>
              <NavLink activeClassName="is-active" to='choose-model'>{data[questionID].modelConceptUID ? 'Edit' : 'Add'} Model Concept</NavLink>
              <NavLink activeClassName="is-active" to='focus-points'>{data[questionID].focusPoints ? 'Edit' : 'Add'} Focus Points</NavLink>
              <NavLink activeClassName="is-active" to='incorrect-sequences'>{data[questionID].incorrectSequences ? 'Edit' : 'Add'} Incorrect Sequences</NavLink>
              {activeLink}
            </ul>
          </div>
          <Switch>
            <Route component={EditIncorrectSequenceContainer} path={`${match.path}/incorrect-sequences/:incorrectSequenceID/edit`} />
            <Route component={NewIncorrectSequenceContainer} path={`${match.path}/incorrect-sequences/new`} />
            <Route component={IncorrectSequenceContainer} path={`${match.path}/incorrect-sequences`} />
            <Route component={EditFocusPointsContainer} path={`${match.path}/focus-points/:focusPointID/edit`} />
            <Route component={NewFocusPointsContainer} path={`${match.path}/focus-points/new`} />
            <Route component={FocusPointsContainer} path={`${match.path}/focus-points`} />
            <Route component={TestQuestionContainer} path={`${match.path}/test`} />
            <Route component={ChooseModelContainer} path={`${match.path}/choose-model`} />
            <Route component={MassEditContainer} path={`${match.path}/mass-edit`} />
            <Route component={ResponseComponentWrapper} path={`${match.path}/responses`} />
          </Switch>
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

export default withRouter(connect(select)(SentenceFragment));
