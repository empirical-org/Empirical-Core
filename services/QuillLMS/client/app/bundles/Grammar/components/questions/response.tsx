import * as React from 'react';
import * as _ from 'underscore';
import * as jsDiff from 'diff'
import { EditorState, ContentState } from 'draft-js'

import ResponseList from './responseList';
import ConceptResults from './conceptResults'
import getBoilerplateFeedback from './boilerplateFeedback';

import * as questionActions from '../../actions/questions';
import * as massEdit from '../../actions/massEdit';
import {
  deleteResponse,
  submitResponseEdit,
  getGradedResponsesWithCallback,
} from '../../actions/responses';
import { ActionTypes } from '../../actions/actionTypes';
import {
  hashToCollection,
  Modal,
  TextEditor,
} from '../../../Shared/index'

interface ResponseState {
  feedback: string,
  selectedBoilerplate: string,
  selectedBoilerplateCategory: string,
  selectedConcept: string,
  actions: {},
  parent: {},
  newConceptResult: {
    conceptUID: string,
    correct: boolean,
  },
  conceptResults: {},
}

interface ResponseProps {
  admin: boolean,
  allExpanded: boolean,
  ascending: boolean,
  concepts: {},
  dispatch: () => void,
  expand: boolean,
  expanded: boolean,
  getChildResponses: Function,
  getResponse: Function,
  getMatchingResponse: Function,
  questionID: string,
  response: Response,
  question: {},
  massEdit: {
    numSelectedResponse: number,
    selectedResponses: any[],
  },
  readOnly: boolean,
  state: string,
  states: {}
}


export default class extends React.Component<ResponseProps, ResponseState> {
  constructor(props) {
    super(props)

    const response = props.response
    const actions = questionActions
    let conceptResults = {}
    if (response.concept_results) {
      if (typeof response.concept_results === 'string') {
        conceptResults = JSON.parse(response.concept_results)
      } else {
        conceptResults = response.concept_results
      }
    }
    this.state = {
      feedback: response.feedback || '',
      selectedBoilerplate: '',
      selectedBoilerplateCategory: response.selectedBoilerplateCategory || '',
      selectedConcept: response.concept || '',
      actions,
      parent: null,
      newConceptResult: {
        conceptUID: '',
        correct: true,
      },
      conceptResults,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { response } = nextProps;
    if (!_.isEqual(response, response)) {
      let conceptResults = {}
      if (nextProps.response.concept_results) {
        if (typeof nextProps.response.concept_results === 'string') {
          conceptResults = JSON.parse(nextProps.response.concept_results)
        } else {
          conceptResults = nextProps.response.concept_results
        }
      }
      this.setState({conceptResults})
    }
  }

  deleteResponse = (rid: string) => {
    const { dispatch, questionID } = this.props
    if (window.confirm('Are you sure?')) {
      dispatch(deleteResponse(questionID, rid));
      dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  }

  editResponse = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.startResponseEdit(questionID, rid));
  }

  cancelResponseEdit = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelResponseEdit(questionID, rid));
  }

  viewFromResponses = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.startFromResponseView(questionID, rid));
  }

  cancelFromResponseView = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelFromResponseView(questionID, rid));
  }

  viewToResponses = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.startToResponseView(questionID, rid));
  }

  cancelToResponseView = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelToResponseView(questionID, rid));
  }

  updateResponse = (rid: string) => {
    const { dispatch, questionID } = this.props
    const { conceptResults, feedback } = this.state
    const newResp = {
      weak: false,
      feedback: feedback !== '<br/>' ? feedback : '',
      optimal: this.refs.newResponseOptimal.checked,
      author: null,
      parent_id: null,
      concept_results: Object.keys(conceptResults) && Object.keys(conceptResults).length ? conceptResults : null
    };
    dispatch(submitResponseEdit(rid, newResp, questionID));
  }

  unmatchResponse = (rid: string) => {
    const { dispatch, question, questionID } = this.props;
    const { modelConceptUID, concept_uid, } = question
    const defaultConceptUID = modelConceptUID || concept_uid
    const newResp = {
      weak: false,
      feedback: null,
      optimal: null,
      author: null,
      parent_id: null,
      concept_results: {[defaultConceptUID]: false}
    }
    dispatch(submitResponseEdit(rid, newResp, questionID));
  }

  getErrorsForAttempt = (attempt) => {
    return _.pick(attempt, ...ActionTypes.ERROR_TYPES);
  }

  rematchResponse = (rid: string) => {
    const { getMatchingResponse } = this.props
    getMatchingResponse(rid);
  }

  applyDiff = (answer = '', response = '') => {
    const diff = jsDiff.diffWords(response, answer);
    const spans = diff.map((part) => {
      const fontWeight = part.added ? 'bold' : 'normal';
      const fontStyle = part.removed ? 'oblique' : 'normal';
      const divStyle = {
        fontWeight,
        fontStyle,
      };
      return <span style={divStyle}>{part.value}</span>;
    });
    return spans;
  }

  handleFeedbackChange = (e) => {
    if (e === 'Select specific boilerplate feedback') {
      this.setState({ feedback: '', });
    } else {
      this.setState({ feedback: e, });
    }
  }

  deleteConceptResult = (crid) => {
    const { conceptResults } = this.state
    if (confirm('Are you sure?')) {
      const conceptResults = Object.assign({}, conceptResults || {});
      delete conceptResults[crid];
      this.setState({conceptResults})
    }
  }

  addResponseToMassEditArray = (responseKey) => {
    const { dispatch } = this.props;
    dispatch(massEdit.addResponseToMassEditArray(responseKey));
  }

  removeResponseFromMassEditArray = (responseKey) => {
    const { dispatch } = this.props;
    dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  clearResponsesFromMassEditArray = () => {
    const { dispatch } = this.props;
    dispatch(massEdit.clearResponsesFromMassEditArray());
  }

  onMassSelectCheckboxToggle = (responseKey) => {
    const { massEdit } = this.props;
    if (massEdit.selectedResponses.includes(responseKey)) {
      this.removeResponseFromMassEditArray(responseKey);
    } else {
      this.addResponseToMassEditArray(responseKey);
    }
  }

  toggleCheckboxCorrect = (key) => {
    const data = this.state;
    data.conceptResults[key] = !data.conceptResults[key]
    this.setState(data);
  }

  handleConceptChange = (e) => {
    const { conceptResults } = this.state;
    const { response } = this.props;
    const { optimal } = response;
    const concepts = conceptResults;
    if (Object.keys(concepts).length === 0 || !concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = optimal;
      this.setState({conceptResults: concepts});
    }
  }

  getParentResponse = (parentId) => {
    const { questionID } = this.props
    const callback = (responses) => {
      this.setState({
        parent: _.filter(responses, (resp) => resp.id === parentId)[0]
      })
    }
    return getGradedResponsesWithCallback(questionID, callback);
  }

  renderConceptResults = (mode) => {
    const { conceptResults } = this.state
    const { concepts, response } = this.props
    return (
      <ConceptResults
        conceptResults={conceptResults}
        concepts={concepts}
        deleteConceptResult={this.deleteConceptResult}
        handleConceptChange={this.handleConceptChange}
        key={Object.keys(conceptResults).length}
        mode={mode}
        response={response}
        toggleCheckboxCorrect={this.toggleCheckboxCorrect}
      />
    )
  }

  renderResponseContent = (isEditing, response) => {
    let content;
    let parentDetails;
    let childDetails;
    let pathwayDetails;
    const { expanded } = this.props
    const { selectedBoilerplate, feedback } = this.state
    if (!expanded) {
      return;
    }
    if (response.parentID || response.parent_id) {
      const { parent } = this.state
      if (!parent) {
        this.getParentResponse(response.parentID || response.parent_id)
        parentDetails = [
          (<p>Loading...</p>),
          (<br />)
        ]
      } else {
        const diffText = this.applyDiff(parent.text, response.text);
        parentDetails = [
          (<span><strong>Parent Text:</strong> {parent.text}</span>),
          (<br />),
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
          (<br />),
          (<br />)
        ];
      }
    }

    if (isEditing) {
      content =
        (<div className="content">
          {parentDetails}
          <label className="label">Feedback</label>
          <TextEditor
            boilerplate={selectedBoilerplate}
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handleFeedbackChange}
            text={feedback || ''}
          />

          <br />

          <div className="box">
            <label className="label">Concept Results</label>
            {this.renderConceptResults('Editing')}
          </div>

          <p className="control">
            <label className="checkbox">
              <input defaultChecked={response.optimal} ref="newResponseOptimal" type="checkbox" />
              Optimal?
            </label>
          </p>
        </div>);
    } else {
      content =
        (<div className="content">
          {parentDetails}
          <strong>Feedback:</strong> <br />
          <div dangerouslySetInnerHTML={{ __html: response.feedback, }} />
          <br />
          <label className="label">Concept Results</label>
          <ul>
            {this.renderConceptResults('Viewing')}
          </ul>
          {childDetails}
          {pathwayDetails}
        </div>);
    }

    return (
      <div className="card-content">
        {content}
      </div>
    );
  }

  renderResponseFooter = (isEditing, response) => {
    const { readOnly, expanded, response } = this.props
    if (!readOnly || !expanded) {
      return;
    }
    let buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" key="cancel" onClick={this.cancelResponseEdit.bind(null, response.key)} >Cancel</a>),
        (<a className="card-footer-item" key="unmatch" onClick={this.unmatchResponse.bind(null, response.key)} >Unmatch</a>),
        (<a className="card-footer-item" key="update" onClick={this.updateResponse.bind(null, response.key)} >Update</a>)
      ];
    } else {
      buttons = [
        (<a className="card-footer-item" key="edit" onClick={this.editResponse.bind(null, response.key)} >Edit</a>),
        (<a className="card-footer-item" key="delete" onClick={this.deleteResponse.bind(null, response.key)} >Delete</a>)
      ];
    }
    if (response.statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={this.rematchResponse.bind(null, response.key)} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  }

  renderResponseHeader = (response) => {
    const { massEdit, expand } = this.props
    let bgColor;
    let icon;
    const headerCSSClassNames = ['human-optimal-response', 'human-sub-optimal-response', 'algorithm-optimal-response', 'algorithm-sub-optimal-response', 'not-found-response'];
    bgColor = headerCSSClassNames[response.statusCode];
    if (response.weak) {
      icon = '⚠️';
    }
    const authorStyle = { marginLeft: '10px', };
    const showTag = response.author && (response.statusCode === 2 || response.statusCode === 3)
    const author = showTag ? <span className="tag is-dark" style={authorStyle}>{response.author}</span> : undefined;
    const checked = massEdit.selectedResponses.includes(response.id) ? 'checked' : '';
    return (
      <div className={bgColor} style={{ display: 'flex', alignItems: 'center', }}>
        <input checked={checked} onChange={() => this.onMassSelectCheckboxToggle(response.id)} style={{ marginLeft: '15px', }} type="checkbox" />
        <header className={`card-content ${this.headerClasses()}`} onClick={() => expand(response.key)} style={{ flexGrow: '1', }}>
          <div className="content">
            <div className="media">
              <div className="media-content">
                <p><span style={{ whiteSpace: 'pre-wrap' }}>{response.text}</span> {author}</p>
              </div>
              <div className="media-right" style={{ textAlign: 'right', }}>
                <figure className="image is-32x32">
                  <span>{ icon } { response.first_attempt_count ? response.first_attempt_count : 0 }</span>
                </figure>
              </div>
              <div className="media-right" style={{ textAlign: 'right', }}>
                <figure className="image is-32x32">
                  <span>{ icon } { response.count ? response.count : 0 }</span>
                </figure>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  cardClasses() {
    const { expanded } = this.props
    if (expanded) {
      return 'has-bottom-margin has-top-margin';
    }
  }

  headerClasses = () => {
    const { expanded } = this.props
    if (!expanded) {
      return 'unexpanded';
    }
    return 'expanded';
  }

  renderChildResponses = (isViewingChildResponses, key) => {
    const { ascending, dispatch, expand, allExpanded, getChildResponses, getResponse, questionID, states } = this.props
    if (isViewingChildResponses) {
      return (
        <Modal close={this.cancelChildResponseView.bind(null, key)}>
          <ResponseList
            admin={false}
            ascending={ascending}
            dispatch={dispatch}
            expand={expand}
            expanded={allExpanded}
            getChildResponses={getChildResponses}
            getResponse={getResponse}
            questionID={questionID}
            responses={getChildResponses(key)}
            states={states}
          />
        </Modal>
      );
    }
  }

  render() {
    const { response, state, } = this.props;
    const isEditing = (state === (`${ActionTypes.START_RESPONSE_EDIT}_${response.id}`));
    const isViewingChildResponses = (state === (`${ActionTypes.START_CHILD_RESPONSE_VIEW}_${response.key}`));
    const isViewingFromResponses = (state === (`${ActionTypes.START_FROM_RESPONSE_VIEW}_${response.key}`));
    const isViewingToResponses = (state === (`${ActionTypes.START_TO_RESPONSE_VIEW}_${response.key}`));
    return (
      <div className={`card is-fullwidth ${this.cardClasses()}`}>
        {this.renderResponseHeader(response)}
        {this.renderResponseContent(isEditing, response)}
        {this.renderResponseFooter(isEditing, response)}
        {this.renderChildResponses(isViewingChildResponses, response.key)}
      </div>
    );
  }
}
