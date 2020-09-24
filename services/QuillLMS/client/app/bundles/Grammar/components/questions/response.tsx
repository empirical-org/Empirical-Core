import * as React from 'react';
import * as _ from 'underscore';
import * as jsDiff from 'diff'

import * as questionActions from '../../actions/questions';
import TextEditor from '../shared/textEditor'
import { EditorState, ContentState } from 'draft-js'
import ResponseList from './responseList';
import ConceptResults from './conceptResults'
import getBoilerplateFeedback from './boilerplateFeedback';
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
} from '../../../Shared/index'

export default class Response extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = this.initialState()

    this.initialState = this.initialState.bind(this)
    this.deleteResponse = this.deleteResponse.bind(this)
    this.editResponse = this.editResponse.bind(this)
    this.cancelResponseEdit = this.cancelResponseEdit.bind(this)
    this.viewFromResponses = this.viewFromResponses.bind(this)
    this.cancelFromResponseView = this.cancelFromResponseView.bind(this)
    this.viewToResponses = this.viewToResponses.bind(this)
    this.cancelToResponseView = this.cancelToResponseView.bind(this)
    this.updateResponse = this.updateResponse.bind(this)
    this.unmatchResponse = this.unmatchResponse.bind(this)
    this.getErrorsForAttempt = this.getErrorsForAttempt.bind(this)
    this.rematchResponse = this.rematchResponse.bind(this)
    this.applyDiff = this.applyDiff.bind(this)
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this)
    this.deleteConceptResult = this.deleteConceptResult.bind(this)
    this.addResponseToMassEditArray = this.addResponseToMassEditArray.bind(this)
    this.removeResponseFromMassEditArray = this.removeResponseFromMassEditArray.bind(this)
    this.clearResponsesFromMassEditArray = this.clearResponsesFromMassEditArray.bind(this)
    this.onMassSelectCheckboxToggle = this.onMassSelectCheckboxToggle.bind(this)
    this.toggleCheckboxCorrect = this.toggleCheckboxCorrect.bind(this)
    this.handleConceptChange = this.handleConceptChange.bind(this)
    this.getParentResponse = this.getParentResponse.bind(this)
    this.renderConceptResults = this.renderConceptResults.bind(this)
    this.renderResponseContent = this.renderResponseContent.bind(this)
    this.renderResponseFooter = this.renderResponseFooter.bind(this)
    this.renderResponseHeader = this.renderResponseHeader.bind(this)
    this.cardClasses = this.cardClasses.bind(this)
    this.headerClasses = this.headerClasses.bind(this)
    this.renderChildResponses = this.renderChildResponses.bind(this)
    this.renderToResponsePathways = this.renderToResponsePathways.bind(this)
    this.renderFromResponsePathways = this.renderFromResponsePathways.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!_.isEqual(nextProps.response, this.props.response)) {
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

  initialState() {
    const response = this.props.response
    const actions = questionActions
    let conceptResults = {}
    if (response.concept_results) {
      if (typeof response.concept_results === 'string') {
        conceptResults = JSON.parse(response.concept_results)
      } else {
        conceptResults = response.concept_results
      }
    }
    return {
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

  deleteResponse(rid: string) {
    if (window.confirm('Are you sure?')) {
      this.props.dispatch(deleteResponse(this.props.questionID, rid));
      this.props.dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  }

  editResponse(rid: string) {
    this.props.dispatch(this.state.actions.startResponseEdit(this.props.questionID, rid));
  }

  cancelResponseEdit(rid: string) {
    this.setState(this.initialState())
    this.props.dispatch(this.state.actions.cancelResponseEdit(this.props.questionID, rid));
  }

  viewFromResponses(rid: string) {
    this.props.dispatch(this.state.actions.startFromResponseView(this.props.questionID, rid));
  }

  cancelFromResponseView(rid: string) {
    this.props.dispatch(this.state.actions.cancelFromResponseView(this.props.questionID, rid));
  }

  viewToResponses(rid: string) {
    this.props.dispatch(this.state.actions.startToResponseView(this.props.questionID, rid));
  }

  cancelToResponseView(rid: string) {
    this.props.dispatch(this.state.actions.cancelToResponseView(this.props.questionID, rid));
  }

  updateResponse(rid: string) {
    const newResp = {
      weak: false,
      feedback: this.state.feedback !== '<br/>' ? this.state.feedback : '',
      optimal: this.refs.newResponseOptimal.checked,
      author: null,
      parent_id: null,
      concept_results: Object.keys(this.state.conceptResults) && Object.keys(this.state.conceptResults).length ? this.state.conceptResults : null
    };
    this.props.dispatch(submitResponseEdit(rid, newResp, this.props.questionID));
  }

  unmatchResponse(rid: string) {
    const { modelConceptUID, concept_uid } = this.props.question
    const defaultConceptUID = modelConceptUID || concept_uid
    const newResp = {
      weak: false,
      feedback: null,
      optimal: null,
      author: null,
      parent_id: null,
      concept_results: {[defaultConceptUID]: false}
    }
    this.props.dispatch(submitResponseEdit(rid, newResp, this.props.questionID));
  }

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...ActionTypes.ERROR_TYPES);
  }

  rematchResponse(rid: string) {
    this.props.getMatchingResponse(rid);
  }

  applyDiff(answer = '', response = '') {
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

  handleFeedbackChange(e) {
    if (e === 'Select specific boilerplate feedback') {
      this.setState({ feedback: '', });
    } else {
      this.setState({ feedback: e, });
    }
  }

  deleteConceptResult(crid) {
    if (confirm('Are you sure?')) {
      const conceptResults = Object.assign({}, this.state.conceptResults || {});
      delete conceptResults[crid];
      this.setState({conceptResults})
    }
  }

  addResponseToMassEditArray(responseKey) {
    this.props.dispatch(massEdit.addResponseToMassEditArray(responseKey));
  }

  removeResponseFromMassEditArray(responseKey) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  clearResponsesFromMassEditArray() {
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
  }

  onMassSelectCheckboxToggle(responseKey) {
    if (this.props.massEdit.selectedResponses.includes(responseKey)) {
      this.removeResponseFromMassEditArray(responseKey);
    } else {
      this.addResponseToMassEditArray(responseKey);
    }
  }

  toggleCheckboxCorrect(key) {
    const data = this.state;
    data.conceptResults[key] = !data.conceptResults[key]
    this.setState(data);
  }

  handleConceptChange(e) {
    const concepts = this.state.conceptResults;
    if (Object.keys(concepts).length === 0 || !concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = this.props.response.optimal;
      this.setState({conceptResults: concepts});
    }
  }

  getParentResponse(parentId) {
    const callback = (responses) => {
      this.setState({
        parent: _.filter(responses, (resp) => resp.id === parentId)[0]
      })
    }
    return getGradedResponsesWithCallback(this.props.questionID, callback);
  }

  renderConceptResults(mode) {
    return (<ConceptResults
      conceptResults={this.state.conceptResults}
      concepts={this.props.concepts}
      deleteConceptResult={this.deleteConceptResult}
      handleConceptChange={this.handleConceptChange}
      key={Object.keys(this.state.conceptResults).length}
      mode={mode}
      response={this.props.response}
      toggleCheckboxCorrect={this.toggleCheckboxCorrect}
    />)
  }

  renderResponseContent(isEditing, response) {
    let content;
    let parentDetails;
    let childDetails;
    let pathwayDetails;
    if (!this.props.expanded) {
      return;
    }
    if (response.parentID || response.parent_id) {
      const parent = this.state.parent;
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
            boilerplate={this.state.selectedBoilerplate}
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handleFeedbackChange}
            text={this.state.feedback || ''}
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

  renderResponseFooter(isEditing, response) {
    if (!this.props.readOnly || !this.props.expanded) {
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
    if (this.props.response.statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={this.rematchResponse.bind(null, response.key)} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  }

  renderResponseHeader(response) {
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
    const checked = this.props.massEdit.selectedResponses.includes(response.id) ? 'checked' : '';
    return (
      <div className={bgColor} style={{ display: 'flex', alignItems: 'center', }}>
        <input checked={checked} onChange={() => this.onMassSelectCheckboxToggle(response.id)} style={{ marginLeft: '15px', }} type="checkbox" />
        <header className={`card-content ${this.headerClasses()}`} onClick={() => this.props.expand(response.key)} style={{ flexGrow: '1', }}>
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
    if (this.props.expanded) {
      return 'has-bottom-margin has-top-margin';
    }
  }

  headerClasses() {
    if (!this.props.expanded) {
      return 'unexpanded';
    }
    return 'expanded';
  }

  renderChildResponses(isViewingChildResponses, key) {
    if (isViewingChildResponses) {
      return (
        <Modal close={this.cancelChildResponseView.bind(null, key)}>
          <ResponseList
            admin={false}
            ascending={this.props.ascending}
            dispatch={this.props.dispatch}
            expand={this.props.expand}
            expanded={this.props.allExpanded}
            getChildResponses={this.props.getChildResponses}
            getResponse={this.props.getResponse}
            questionID={this.props.questionID}
            responses={this.props.getChildResponses(key)}
            showPathways={false}
            states={this.props.states}
          />
        </Modal>
      );
    }
  }

  renderToResponsePathways(isViewingToResponses, key) {
    if (isViewingToResponses) {
      return (
        <Modal close={this.cancelToResponseView.bind(null, key)}>
          <ResponseList
            admin={false}
            ascending={this.props.ascending}
            dispatch={this.props.dispatch}
            expand={this.props.expand}
            expanded={this.props.allExpanded}
            getChildResponses={this.props.getChildResponses}
            getResponse={this.props.getResponse}
            questionID={this.props.questionID}
            responses={this.props.toPathways(this.props.response.key)}
            showPathways={false}
            states={this.props.states}
          />
        </Modal>
      );
    }
  }

  renderFromResponsePathways(isViewingFromResponses, key) {
    if (isViewingFromResponses) {
      const pathways = this.props.printPathways(this.props.response.key);
      let initialCount;
      const resps = _.reject(hashToCollection(pathways), fromer => fromer.initial === true);
      if (_.find(pathways, { initial: true, })) {
        initialCount = (
          <p style={{ color: 'white', }}>First attempt: {_.find(pathways, { initial: true, }).pathCount}</p>
        );
      }
      return (
        <Modal close={this.cancelFromResponseView.bind(null, key)}>
          {initialCount}
          <br />
          <ResponseList
            admin={false}
            ascending={this.props.ascending}
            dispatch={this.props.dispatch}
            expand={this.props.expand}
            expanded={this.props.allExpanded}
            getChildResponses={this.props.getChildResponses}
            getResponse={this.props.getResponse}
            questionID={this.props.questionID}
            responses={resps}
            showPathways={false}
            states={this.props.states}
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
        {this.renderFromResponsePathways(isViewingFromResponses, response.key)}
        {this.renderToResponsePathways(isViewingToResponses, response.key)}
      </div>
    );
  }
}
