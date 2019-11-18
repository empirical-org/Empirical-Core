import React from 'react';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import diagnosticQuestionActions from '../../actions/diagnosticQuestions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import ConceptSelector from '../shared/conceptSelector.jsx';
import {
  Modal,
  TextEditor,
  hashToCollection
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import ResponseList from './responseList.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import massEdit from '../../actions/massEdit';
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox.jsx';
import {
  deleteResponse,
  submitResponseEdit,
  incrementResponseCount,
  removeLinkToParentID,
  deleteConceptResult,
  getGradedResponsesWithCallback,
} from '../../actions/responses';

const jsDiff = require('diff');
const C = require('../../constants').default;

const feedbackStrings = C.FEEDBACK_STRINGS;

export default React.createClass({

  getInitialState() {
    const response = this.props.response
    let actions;
    if (this.props.mode === 'sentenceFragment') {
      actions = sentenceFragmentActions;
    } else {
      actions = questionActions;
    }
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
      conceptResults
    };
  },


  componentWillReceiveProps(nextProps) {
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
  },

  deleteResponse(rid) {
    if (window.confirm('Are you sure?')) {
      this.props.dispatch(deleteResponse(this.props.questionID, rid));
      this.props.dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  },

  editResponse(rid) {
    this.props.dispatch(this.state.actions.startResponseEdit(this.props.questionID, rid));
  },

  cancelResponseEdit(rid) {
    this.props.dispatch(this.state.actions.cancelResponseEdit(this.props.questionID, rid));
  },

  viewChildResponses(rid) {
    this.props.dispatch(this.state.actions.startChildResponseView(this.props.questionID, rid));
  },

  cancelChildResponseView(rid) {
    this.props.dispatch(this.state.actions.cancelChildResponseView(this.props.questionID, rid));
  },

  viewFromResponses(rid) {
    this.props.dispatch(this.state.actions.startFromResponseView(this.props.questionID, rid));
  },

  cancelFromResponseView(rid) {
    this.props.dispatch(this.state.actions.cancelFromResponseView(this.props.questionID, rid));
  },

  viewToResponses(rid) {
    this.props.dispatch(this.state.actions.startToResponseView(this.props.questionID, rid));
  },

  cancelToResponseView(rid) {
    this.props.dispatch(this.state.actions.cancelToResponseView(this.props.questionID, rid));
  },

  updateResponse(rid) {
    const newResp = {
      weak: false,
      feedback: this.state.feedback,
      optimal: this.refs.newResponseOptimal.checked,
      author: null,
      parent_id: null,
      concept_results: Object.keys(this.state.conceptResults) && Object.keys(this.state.conceptResults).length ? this.state.conceptResults : null
    };
    this.props.dispatch(submitResponseEdit(rid, newResp, this.props.questionID));
  },

  unmatchResponse(rid) {
    const { modelConceptUID, conceptID, } = this.props.question
    const defaultConceptUID = modelConceptUID || conceptID
    const newResp = {
      weak: false,
      feedback: null,
      optimal: null,
      author: null,
      parent_id: null,
      concept_results: { [defaultConceptUID]: false, },
    }
    this.props.dispatch(submitResponseEdit(rid, newResp, this.props.questionID));
  },

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  },

  markAsWeak(rid) {
    const vals = { weak: true, };
    this.props.dispatch(
      submitResponseEdit(rid, vals, this.props.questionID)
    );
  },

  unmarkAsWeak(rid) {
    const vals = { weak: false, };
    this.props.dispatch(
      submitResponseEdit(rid, vals, this.props.questionID)
    );
  },

  rematchResponse(rid) {
    this.props.getMatchingResponse(rid);
  },

  incrementResponse(rid) {
    const qid = this.props.questionID;
    this.props.dispatch(incrementResponseCount(qid, rid));
  },

  removeLinkToParentID(rid) {
    this.props.dispatch(submitResponseEdit(rid, { optimal: false, author: null, parent_id: null }, this.props.questionID));
  },

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
  },

  handleFeedbackChange(e) {
    if (e === 'Select specific boilerplate feedback') {
      this.setState({ feedback: '', });
    } else {
      this.setState({ feedback: e, });
    }
  },

  deleteConceptResult(crid) {
    if (confirm('Are you sure?')) {
      let conceptResults = Object.assign({}, this.state.conceptResults || {});
      delete conceptResults[crid];
      this.setState({conceptResults: conceptResults})
    }
  },

  chooseBoilerplateCategory(e) {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  },

  chooseSpecificBoilerplateFeedback(e) {
    this.setState({ selectedBoilerplate: e.target.value, });
  },

  boilerplateCategoriesToOptions() {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
      ));
  },

  boilerplateSpecificFeedbackToOptions(selectedCategory) {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
      ));
  },

  addResponseToMassEditArray(responseKey) {
    this.props.dispatch(massEdit.addResponseToMassEditArray(responseKey));
  },

  removeResponseFromMassEditArray(responseKey) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  },

  clearResponsesFromMassEditArray() {
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
  },

  onMassSelectCheckboxToggle(responseKey) {
    if (this.props.massEdit.selectedResponses.includes(responseKey)) {
      this.removeResponseFromMassEditArray(responseKey);
    } else {
      this.addResponseToMassEditArray(responseKey);
    }
  },

  toggleCheckboxCorrect(key) {
    const data = this.state;
    data.conceptResults[key] = !data.conceptResults[key]
    this.setState(data);
  },

  handleConceptChange(e){
    const concepts = this.state.conceptResults;
    if (Object.keys(concepts).length === 0 || !concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = this.props.response.optimal;
      this.setState({conceptResults: concepts});
    }
  },

  getParentResponse(parent_id) {
    const callback = (responses) => {
      this.setState({
        parent: _.filter(responses, (resp) => resp.id === parent_id)[0]
      })
    }
    return getGradedResponsesWithCallback(this.props.questionID, callback);
  },

  renderBoilerplateCategoryDropdown() {
    const style = { marginRight: '20px', };
    return (
      <span className="select" style={style}>
        <select className="boilerplate-feedback-dropdown" onChange={this.chooseBoilerplateCategory} ref="boilerplate">
          <option className="boilerplate-feedback-dropdown-option">Select boilerplate feedback category</option>
          {this.boilerplateCategoriesToOptions()}
        </select>
      </span>
    );
  },

  renderBoilerplateCategoryOptionsDropdown() {
    const selectedCategory = _.find(getBoilerplateFeedback(), { description: this.state.selectedBoilerplateCategory, });
    if (selectedCategory) {
      return (
        <span className="select">
          <select className="boilerplate-feedback-dropdown" onChange={this.chooseSpecificBoilerplateFeedback} ref="boilerplate">
            <option className="boilerplate-feedback-dropdown-option">Select specific boilerplate feedback</option>
            {this.boilerplateSpecificFeedbackToOptions(selectedCategory)}
          </select>
        </span>
      );
    }
    return (<span />);
  },

  renderConceptResults(mode) {
    const conceptResults = Object.assign({}, this.state.conceptResults)
    let components
    if (conceptResults) {
      if (mode === 'Editing') {
      const conceptResultsPlus = Object.assign(conceptResults, {null: this.props.response.optimal})
      components = Object.keys(conceptResultsPlus).map(uid => {
        const concept = _.find(this.props.concepts.data['0'], { uid, });
          return (<ConceptSelectorWithCheckbox
            checked={conceptResults[uid]}
            currentConceptUID={uid}
            deleteConceptResult={() => this.deleteConceptResult(uid)}
            handleSelectorChange={this.handleConceptChange}
            key={uid}
            onCheckboxChange={() => this.toggleCheckboxCorrect(uid)}
            selectorDisabled={uid === null || uid === 'null' ? false : true}
          />)
      });
    } else {
      components = Object.keys(conceptResults).map(uid => {
        const concept = _.find(this.props.concepts.data['0'], { uid, });
        if (concept) {
          // hacky fix for the problem where concept result uids are being returned with string value 'false' rather than false
          return  (<li key={uid}>
            {concept.displayName} {conceptResults[uid] && conceptResults[uid] !== 'false' ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
            {'\t'}
          </li>)
        }
      });
    }
      return _.values(components);
    }
  },

  renderResponseContent(isEditing, response) {
    let content;
    let parentDetails;
    let childDetails;
    let pathwayDetails;
    let authorDetails;
    if (!this.props.expanded) {
      return;
    }
    if (!response.parentID && !response.parent_id) {
      childDetails = (
        <a className="button is-outlined has-top-margin" key="view" onClick={this.viewChildResponses.bind(null, response.key)} >View Children</a>
      );
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
          (<button className="button is-danger" onClick={this.removeLinkToParentID.bind(null, response.key)}>Remove Link to Parent </button>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
          (<br />),
          (<br />)
          ];
      }
    }

    if (this.props.showPathways) {
      pathwayDetails = (<span> <a
        className="button is-outlined has-top-margin"
        key="from"
        onClick={this.printResponsePathways.bind(null, this.props.key)}
      >
                         From Pathways
      </a> <a
        className="button is-outlined has-top-margin"
        key="to"
        onClick={this.toResponsePathways}
      >
                            To Pathways
      </a></span>);
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
          <label className="label">Boilerplate feedback</label>
          <div className="boilerplate-feedback-dropdown-container">
            {this.renderBoilerplateCategoryDropdown()}
            {this.renderBoilerplateCategoryOptionsDropdown()}
          </div>

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
          {pathwayDetails}
        </div>);
    }

    return (
      <div className="card-content">
        {content}
      </div>
    );
  },

  renderResponseFooter(isEditing, response) {
    if (!this.props.readOnly || !this.props.expanded) {
      return;
    }
    let buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" key="cancel" onClick={this.cancelResponseEdit.bind(null, response.key)} >Cancel</a>),
        (<a className="card-footer-item" key="unmatch" onClick={this.unmatchResponse.bind(null, response.key)} >Unmatch</a>),
        (<a className="card-footer-item" key="increment" onClick={this.incrementResponse.bind(null, response.key)} >Increment</a>),
        (<a className="card-footer-item" key="update" onClick={this.updateResponse.bind(null, response.key)} >Update</a>)
      ];
    } else {
      buttons = [
        (<a className="card-footer-item" key="edit" onClick={this.editResponse.bind(null, response.key)} >Edit</a>),
        (<a className="card-footer-item" key="delete" onClick={this.deleteResponse.bind(null, response.key)} >Delete</a>)
      ];
    }
    if (this.props.response.statusCode === 3) {
      if (this.props.response.weak) {
        buttons = buttons.concat([(<a className="card-footer-item" key="weak" onClick={this.unmarkAsWeak.bind(null, response.key)} >Unmark as weak</a>)]);
      } else {
        buttons = buttons.concat([(<a className="card-footer-item" key="weak" onClick={this.markAsWeak.bind(null, response.key)} >Mark as weak</a>)]);
      }
    }
    if (this.props.response.statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={this.rematchResponse.bind(null, response.key)} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  },

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
  },

  cardClasses() {
    if (this.props.expanded) {
      return 'has-bottom-margin has-top-margin';
    }
  },

  headerClasses() {
    if (!this.props.expanded) {
      return 'unexpanded';
    }
    return 'expanded';
  },

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
  },

  printResponsePathways() {
    this.viewFromResponses(this.props.response.key);
    // this.props.printPathways(this.props.response.key);
  },

  toResponsePathways() {
    this.viewToResponses(this.props.response.key);
    // this.props.printPathways(this.props.response.key);
  },

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
  },

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
  },

  render() {
    const { response, state, } = this.props;
    const isEditing = (state === (`${C.START_RESPONSE_EDIT}_${response.key}`));
    const isViewingChildResponses = (state === (`${C.START_CHILD_RESPONSE_VIEW}_${response.key}`));
    const isViewingFromResponses = (state === (`${C.START_FROM_RESPONSE_VIEW}_${response.key}`));
    const isViewingToResponses = (state === (`${C.START_TO_RESPONSE_VIEW}_${response.key}`));
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
  },
});
