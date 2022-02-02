import React from 'react';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import { EditorState, ContentState } from 'draft-js'
import ResponseList from './responseList.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import massEdit from '../../actions/massEdit';
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox.jsx';
import {
  deleteResponse,
  submitResponseEdit,
  getGradedResponsesWithCallback,
} from '../../actions/responses';
import {
  Modal,
  TextEditor,
  hashToCollection
} from '../../../Shared/index'

const jsDiff = require('diff');
const C = require('../../constants').default;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const response = props.response
    let actions;
    if (props.mode === 'sentenceFragment') {
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
      conceptResults
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { response } = nextProps;
    const { concept_results, } = response;
    if (!_.isEqual(response, this.props.response)) {
      let conceptResults = {}
      if (concept_results) {
        if (typeof concept_results === 'string') {
          conceptResults = JSON.parse(concept_results)
        } else {
          conceptResults = concept_results
        }
      }
      this.setState({conceptResults})
    }
  }

  deleteResponse = (rid) => {
    const { dispatch, questionID } = this.props;
    if (window.confirm('Are you sure?')) {
      dispatch(deleteResponse(questionID, rid));
      dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  }

  editResponse = (rid) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.startResponseEdit(questionID, rid));
  }

  cancelResponseEdit = (rid) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelResponseEdit(questionID, rid));
  }

  cancelChildResponseView = (rid) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelChildResponseView(questionID, rid));
  }

  cancelFromResponseView = (rid) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelFromResponseView(questionID, rid));
  }

  cancelToResponseView = (rid) => {
    const { dispatch, questionID } = this.props
    const { actions } = this.state
    dispatch(actions.cancelToResponseView(questionID, rid));
  }

  updateResponse = (rid) => {
    const { dispatch, questionID } = this.props
    const { conceptResults, feedback } = this.state
    const newResp = {
      weak: false,
      feedback,
      optimal: this.refs.newResponseOptimal.checked,
      author: null,
      parent_id: null,
      concept_results: Object.keys(conceptResults) && Object.keys(conceptResults).length ? conceptResults : null
    };
    dispatch(submitResponseEdit(rid, newResp, questionID));
  };

  unmatchResponse = (rid) => {
    const { dispatch, question, questionID } = this.props;
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
  };

  getErrorsForAttempt = (attempt) => {
    return _.pick(attempt, ...C.ERROR_TYPES);
  };

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
  };

  handleFeedbackChange = (e) => {
    if (e === 'Select specific boilerplate feedback') {
      this.setState({ feedback: '', });
    } else {
      this.setState({ feedback: e, });
    }
  };

  deleteConceptResult = (crid) => {
    if (confirm('Are you sure?')) {
      let conceptResults = Object.assign({}, this.state.conceptResults || {});
      delete conceptResults[crid];
      this.setState({conceptResults: conceptResults})
    }
  };

  chooseBoilerplateCategory = (e) => {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  };

  chooseSpecificBoilerplateFeedback = (e) => {
    this.setState({ selectedBoilerplate: e.target.value, });
  };

  boilerplateCategoriesToOptions = () => {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
    ));
  };

  boilerplateSpecificFeedbackToOptions = (selectedCategory) => {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
    ));
  };

  addResponseToMassEditArray = (responseKey) => {
    const { dispatch } = this.props;
    dispatch(massEdit.addResponseToMassEditArray(responseKey));
  };

  removeResponseFromMassEditArray = (responseKey) => {
    const { dispatch } = this.props;
    dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  };

  clearResponsesFromMassEditArray = () => {
    const { dispatch } = this.props;
    dispatch(massEdit.clearResponsesFromMassEditArray());
  };

  onMassSelectCheckboxToggle = (responseKey) => {
    const { massEdit } = this.props;
    const { selectedResponses } = massEdit;
    if (selectedResponses.includes(responseKey)) {
      this.removeResponseFromMassEditArray(responseKey);
    } else {
      this.addResponseToMassEditArray(responseKey);
    }
  };

  toggleCheckboxCorrect = (key) => {
    const data = this.state;
    data.conceptResults[key] = !data.conceptResults[key]
    this.setState(data);
  };

  handleConceptChange = (e) => {
    const { conceptResults } = this.state;
    const { response } = this.props;
    const { optimal } = response;
    const concepts = conceptResults;
    if (Object.keys(concepts).length === 0 || !concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = optimal;
      this.setState({conceptResults: concepts});
    }
  };

  getParentResponse = (parent_id) => {
    const callback = (responses) => {
      this.setState({
        parent: _.filter(responses, (resp) => resp.id === parent_id)[0]
      })
    }
    return getGradedResponsesWithCallback(this.props.questionID, callback);
  };

  renderConceptResults = (mode) => {
    const conceptResults = Object.assign({}, this.state.conceptResults)
    let components
    if (conceptResults) {
      if (mode === 'Editing') {
        const conceptResultsPlus = Object.assign(conceptResults, {null: this.props.response.optimal})
        components = Object.keys(conceptResultsPlus).map(uid => {
          const concept = _.find(this.props.concepts.data['0'], { uid, });
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
          const concept = _.find(this.props.concepts.data['0'], { uid, });
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
  };

  renderResponseContent = (isEditing, response) => {
    let content;
    let parentDetails;
    let childDetails;
    let pathwayDetails;
    let authorDetails;
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
  };

  renderResponseFooter = (isEditing, response) => {
    if (!this.props.readOnly || !this.props.expanded) {
      return;
    }
    let buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" key="cancel" onClick={() => this.cancelResponseEdit(response.key)} >Cancel</a>),
        (<a className="card-footer-item" key="unmatch" onClick={() => this.unmatchResponse(response.key)} >Unmatch</a>),
        (<a className="card-footer-item" key="update" onClick={() => this.updateResponse(response.key)} >Update</a>)
      ];
    } else {
      buttons = [
        (<a className="card-footer-item" key="edit" onClick={() => this.editResponse(response.key)} >Edit</a>),
        (<a className="card-footer-item" key="delete" onClick={() => this.deleteResponse(response.key)} >Delete</a>)
      ];
    }
    if (this.props.response.statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={() => this.rematchResponse(response.key)} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  };

  renderResponseHeader = (response) => {
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
  };

  cardClasses = () => {
    if (this.props.expanded) {
      return 'has-bottom-margin has-top-margin';
    }
  };

  headerClasses = () => {
    if (!this.props.expanded) {
      return 'unexpanded';
    }
    return 'expanded';
  };

  renderChildResponses = (isViewingChildResponses, key) => {
    if (isViewingChildResponses) {
      return (
        <Modal close={() => this.cancelChildResponseView(key)}>
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
            states={this.props.states}
          />
        </Modal>
      );
    }
  };

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
