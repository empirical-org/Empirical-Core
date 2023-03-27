import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';
import _ from 'underscore';
import {
  Modal,
  TextEditor
} from '../../../Shared/index';
import massEdit from '../../actions/massEdit';
import questionActions from '../../actions/questions';
import {
  deleteResponse, getGradedResponsesWithCallback, submitResponseEdit
} from '../../actions/responses';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import ResponseList from './responseList.jsx';

const jsDiff = require('diff');
const C = require('../../constants').default;

interface ResponseObj {
  author: string,
  child_count: number,
  concept: string,
  concept_results: {},
  created_at: string,
  first_attempt_count: number,
  id: number,
  feedback: string,
  optimal: boolean,
  parent_id: number,
  parent_uid: string,
  question_uid: string,
  sortOrder: number,
  spelling_error: boolean,
  statusCode: number,
  text: string,
  uid: string,
  updated_at: string,
  weak: string,
  selectedBoilerplateCategory: string,
  key: string,
}

interface ResponseState {
  feedback: string,
  selectedBoilerplate: string,
  selectedBoilerplateCategory: string,
  selectedConcept: string,
  actions: object,
  parent: ResponseObj,
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
  concepts: {
    data: {},
    hasreceiveddata: boolean,
    states: {},
    submittingnew: boolean,
  },
  dispatch: () => void,
  expand: (responseKey: string) => void,
  expanded: boolean,
  getChildResponses: (responseID: string) => {}[],
  getResponse: (responseID: string) => {},
  getMatchingResponse: (rid) => void,
  questionID: string,
  response: ResponseObj,
  question: {
    modelConceptUID: string,
    conceptID: string,
  },
  massEdit: {
    numSelectedResponse: number,
    selectedResponses: any[],
  },
  mode: string,
  readOnly: boolean,
  state: string,
  states: {}
}

export default class Response extends React.Component<ResponseProps, ResponseState> {

  constructor(props) {
    super(props)

    const { mode, response } = this.props
    const { concept, concept_results, feedback, selectedBoilerplateCategory } = response
    let actions;
    if (mode === 'sentenceFragment') {
      actions = sentenceFragmentActions;
    } else {
      actions = questionActions;
    }
    let conceptResults = {}
    if (concept_results) {
      if (typeof concept_results === 'string') {
        conceptResults = JSON.parse(concept_results)
      } else {
        conceptResults = concept_results
      }
    }
    this.state = {
      feedback: feedback || '',
      selectedBoilerplate: '',
      selectedBoilerplateCategory: selectedBoilerplateCategory || '',
      selectedConcept: concept || '',
      actions,
      parent: null,
      newConceptResult: {
        conceptUID: '',
        correct: true,
      },
      conceptResults
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { response } = this.props
    if (!_.isEqual(nextProps.response, response)) {
      let conceptResults = {}
      let feedback = nextProps.response.feedback
      if (nextProps.response.concept_results) {
        if (typeof nextProps.response.concept_results === 'string') {
          conceptResults = JSON.parse(nextProps.response.concept_results)
        } else {
          conceptResults = nextProps.response.concept_results
        }
      }
      this.setState({ conceptResults, feedback, })
    }
  }

  deleteResponse = (rid) => {
    const { dispatch, questionID } = this.props
    if (window.confirm('Are you sure?')) {
      dispatch(deleteResponse(questionID, rid));
      dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  }

  isSelectedForMassEdit = () => {
    const { massEdit, response } = this.props
    const { selectedResponses } = massEdit
    const { id, key } = response
    return selectedResponses.includes(id) || selectedResponses.includes(key)
  }

  editResponse = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.startResponseEdit(questionID, rid));
  }

  cancelResponseEdit = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.cancelResponseEdit(questionID, rid));
  }

  cancelChildResponseView = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.cancelChildResponseView(questionID, rid));
  }

  viewFromResponses = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.startFromResponseView(questionID, rid));
  }

  cancelFromResponseView = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.cancelFromResponseView(questionID, rid));
  }

  viewToResponses = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.startToResponseView(questionID, rid));
  }

  cancelToResponseView = (rid) => {
    const { actions } = this.state
    const { dispatch, questionID } = this.props
    dispatch(actions.cancelToResponseView(questionID, rid));
  }

  updateResponse = (rid) => {
    const { conceptResults, feedback } = this.state
    const { dispatch, questionID } = this.props
    const newResp = {
      weak: false,
      feedback: feedback,
      optimal: this.refs.newResponseOptimal.checked,
      author: null,
      parent_id: null,
      concept_results: Object.keys(conceptResults) && Object.keys(conceptResults).length ? conceptResults : null
    };
    dispatch(submitResponseEdit(rid, newResp, questionID));
  }

  unmatchResponse = (rid) => {
    const { dispatch, question, questionID } = this.props
    const { modelConceptUID, conceptID, } = question
    const defaultConceptUID = modelConceptUID || conceptID
    const newResp = {
      weak: false,
      feedback: null,
      optimal: null,
      author: null,
      parent_id: null,
      concept_results: { [defaultConceptUID]: false, },
    }
    dispatch(submitResponseEdit(rid, newResp, questionID));
  }

  getErrorsForAttempt = (attempt) => {
    return _.pick(attempt, ...C.ERROR_TYPES);
  }

  rematchResponse = (rid) => {
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
    if (confirm('Are you sure?')) {
      const conceptResults = Object.assign({}, this.state.conceptResults || {});
      delete conceptResults[crid];
      this.setState({ conceptResults }, (() => {}))
    }
  }

  chooseBoilerplateCategory = (e) => {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  }

  chooseSpecificBoilerplateFeedback = (e) => {
    this.setState({ selectedBoilerplate: e.target.value, });
  }

  boilerplateCategoriesToOptions = () => {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
    ));
  }

  boilerplateSpecificFeedbackToOptions = (selectedCategory) => {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
    ));
  }

  addResponseToMassEditArray = (responseKey) => {
    const { dispatch } = this.props
    dispatch(massEdit.addResponseToMassEditArray(responseKey));
  }

  removeResponseFromMassEditArray = (responseKey) => {
    const { dispatch } = this.props
    dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  clearResponsesFromMassEditArray = () => {
    const { dispatch } = this.props
    dispatch(massEdit.clearResponsesFromMassEditArray());
  }

  onMassSelectCheckboxToggle = (responseKey) => {
    if (this.isSelectedForMassEdit()) {
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
    const { conceptResults } = this.state
    const { response } = this.props
    const { optimal } = response
    let newConcepts = conceptResults;
    if (Object.keys(newConcepts).length === 0 || !newConcepts.hasOwnProperty(e.value)) {
      newConcepts[e.value] = optimal;
      this.setState({conceptResults: newConcepts});
    }
  }

  getParentResponse = (parent_id) => {
    const { questionID } = this.props
    const callback = (responses) => {
      this.setState({
        parent: _.filter(responses, (resp) => resp.id === parent_id)[0]
      })
    }
    return getGradedResponsesWithCallback(questionID, callback);
  }

  renderConceptResults = (mode) => {
    const { response, concepts } = this.props
    const conceptResults = Object.assign({}, this.state.conceptResults)
    let components
    if (conceptResults) {
      if (mode === 'Editing') {
        const conceptResultsPlus = Object.assign(conceptResults, {null: response.optimal})
        components = Object.keys(conceptResultsPlus).map(uid => {
          const concept = _.find(concepts.data['0'], { uid, });
          return (
            <ConceptSelectorWithCheckbox
              checked={conceptResults[uid]}
              currentConceptUID={uid}
              deleteConceptResult={() => this.deleteConceptResult(uid)}
              handleSelectorChange={this.handleConceptChange}
              key={uid}
              onCheckboxChange={() => this.toggleCheckboxCorrect(uid)}
              selectorDisabled={uid === null || uid === 'null' ? false : true}
            />
          )
        });
      } else {
        components = Object.keys(conceptResults).map(uid => {
          const concept = _.find(concepts.data['0'], { uid, });
          if (concept) {
          // hacky fix for the problem where concept result uids are being returned with string value 'false' rather than false
            return  (
              <li key={uid}>
                {concept.displayName} {conceptResults[uid] && conceptResults[uid] !== 'false' ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
                {'\t'}
              </li>
            )
          }
        });
      }
      return _.values(components);
    }
  }

  renderResponseContent = (isEditing, response) => {
    const { expanded } = this.props
    const { parent, selectedBoilerplate, feedback } = this.state
    let content;
    let parentDetails;
    let childDetails;
    let authorDetails;
    if (!expanded) {
      return;
    }
    if (response.parentID || response.parent_id) {
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
          {authorDetails}
          {childDetails}
        </div>);
    }

    return (
      <div className="card-content">
        {content}
      </div>
    );
  }

  renderResponseFooter = (isEditing, response) => {
    const { expanded, readOnly } = this.props
    const { key, statusCode } = response
    if (!readOnly || !expanded) {
      return;
    }
    let buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" key="cancel" onClick={() => this.cancelResponseEdit(key)} >Cancel</a>),
        (<a className="card-footer-item" key="unmatch" onClick={() => this.unmatchResponse(key)} >Unmatch</a>),
        (<a className="card-footer-item" key="update" onClick={() => this.updateResponse(key)} >Update</a>)
      ];
    } else {
      buttons = [
        (<a className="card-footer-item" key="edit" onClick={() => this.editResponse(key)} >Edit</a>),
        (<a className="card-footer-item" key="delete" onClick={() => this.deleteResponse(key)} >Delete</a>)
      ];
    }
    if (statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={() => this.rematchResponse(key)} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}
      </footer>
    );
  }

  renderResponseHeader = (response) => {
    const { expand } = this.props
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
    const checked = this.isSelectedForMassEdit() ? 'checked' : '';
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

  cardClasses = () => {
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
    if (isViewingChildResponses) {
      const { ascending, dispatch, expand, allExpanded, getChildResponses, getResponse, questionID, states } = this.props
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
    const isEditing = (state === (`${C.START_RESPONSE_EDIT}_${response.key}`));
    const isViewingChildResponses = (state === (`${C.START_CHILD_RESPONSE_VIEW}_${response.key}`));
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
