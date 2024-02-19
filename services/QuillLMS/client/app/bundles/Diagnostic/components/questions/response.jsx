import * as React from 'react'
import * as jsDiff from 'diff'

import { ContentState, EditorState } from 'draft-js'
import _ from 'underscore'

import {
  Modal,
  TextEditor
} from '../../../Shared/index'
import massEdit from '../../actions/massEdit'
import questionActions from '../../actions/questions'
import {
  deleteResponse,
  getGradedResponsesWithCallback,
  submitResponseEdit,
} from '../../actions/responses'
import sentenceFragmentActions from '../../actions/sentenceFragments.ts'
import C from '../../constants'
import { rematchOne } from '../../libs/grading/rematching.ts'
import { getStatusForResponse } from '../../../Shared/index'

import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox.jsx'

import getBoilerplateFeedback from './boilerplateFeedback.jsx'
import ResponseList from './responseList.jsx'


const Response = ({allExpanded, ascending, concepts, conceptID, expand, expanded, mode, passedResponse, responses, dispatch, getChildResponses, getResponse, massEdit, question, questionID, readOnly, state, states}) => {
  const [response, setResponse] = React.useState(passedResponse)
  const [feedback, setFeedback] = React.useState(response.feedback || '')
  const [selectedBoilerplate, setSelectedBoilerplate] = React.useState('')
  const [selectedBoilerplateCategory, setSelectedBoilerplateCategory] = React.useState(response.selectedBoilerplateCategory || '')
  const [selectedConcept, setSelectedConcept] = React.useState(response.concept || '')
  const [parent, setParent] = React.useState(null)
  const [newConceptResult, setNewConceptResult] = React.useState({
    conceptUID: '',
    correct: true,
  })

  let conceptResults = {}
  if (passedResponse.concept_results) {
    if (typeof response.concept_results === 'string') {
      conceptResults = JSON.parse(response.concept_results)
    } else {
      conceptResults = response.concept_results
    }
  }
  const [conceptResultsState, setConceptResults] = React.useState(conceptResults)
  const [actions, setActions] = React.useState(mode === 'sentenceFragment' ? sentenceFragmentActions : questionActions)
  const [statusCode, setStatusCode] = React.useState(getStatusForResponse(response))

  React.useEffect(() => {
    const { concept_results, } = response;
    let conceptResults = {}
    if (concept_results) {
      if (typeof concept_results === 'string') {
        conceptResults = JSON.parse(concept_results)
      } else {
        conceptResults = concept_results
      }
    }
    setConceptResults(conceptResults)
    setStatusCode(getStatusForResponse(response))
  }, [response])

  function deleteResponse(rid) {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteResponse(questionID, rid));
      dispatch(massEdit.removeResponseFromMassEditArray(rid));
    }
  }

  function editResponse(rid) {
    dispatch(actions.startResponseEdit(questionID, rid));
  }

  function cancelResponseEdit(rid) {
    dispatch(actions.cancelResponseEdit(questionID, rid));
  }

  function cancelChildResponseView(rid) {
    dispatch(actions.cancelChildResponseView(questionID, rid));
  }

  function cancelFromResponseView(rid) {
    dispatch(actions.cancelFromResponseView(questionID, rid));
  }

  function cancelToResponseView(rid) {
    dispatch(actions.cancelToResponseView(questionID, rid));
  }

  function updateResponse(rid) {
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

  function unmatchResponse(rid) {
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

  function getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  };

  function rematchResponse() {
    rematchOne(response, mode, question, questionID, rerenderResponse);
  };

  function applyDiff(answer = '', response = '') {
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

  function handleFeedbackChange(e) {
    if (e === 'Select specific boilerplate feedback') {
      setFeedback('')
    } else {
      setFeedback(e)
    }
  };

  function deleteConceptResult(crid) {
    if (confirm('Are you sure?')) {
      let conceptResults = Object.assign({}, conceptResults || {});
      delete conceptResults[crid];
      setConceptResults(conceptResults)
    }
  };

  function chooseBoilerplateCategory(e) {
    setSelectedBoilerplateCategory(e.target.value)
  };

  function chooseSpecificBoilerplateFeedback(e, setSelectedBoilerplate) {
    setSelectedBoilerplate(e.target.value);
  }

  function boilerplateCategoriesToOptions(getBoilerplateFeedback) {
    return getBoilerplateFeedback().map(category => (
      <option key={category.id} className="boilerplate-feedback-dropdown-option">{category.description}</option>
    ));
  }

  function boilerplateSpecificFeedbackToOptions(selectedCategory) {
    return selectedCategory.children.map(childFeedback => (
      <option key={childFeedback.id} className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
    ));
  }

  function addResponseToMassEditArray(responseKey, dispatch, massEdit) {
    dispatch(massEdit.addResponseToMassEditArray(responseKey));
  }

  function removeResponseFromMassEditArray(responseKey, dispatch, massEdit) {
    dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  function clearResponsesFromMassEditArray(dispatch, massEdit) {
    dispatch(massEdit.clearResponsesFromMassEditArray());
  }

  function onMassSelectCheckboxToggle(responseKey, massEdit, addResponseToMassEditArray, removeResponseFromMassEditArray) {
    const { selectedResponses } = massEdit;
    if (selectedResponses.includes(responseKey)) {
      removeResponseFromMassEditArray(responseKey);
    } else {
      addResponseToMassEditArray(responseKey);
    }
  }

  function toggleCheckboxCorrect(key, conceptResults, setConceptResults) {
    const updatedResults = { ...conceptResults, [key]: !conceptResults[key] };
    setConceptResults(updatedResults);
  }

  function handleConceptChange(e, conceptResults, setConceptResults, response) {
    const concepts = { ...conceptResults };
    if (Object.keys(concepts).length === 0 || !concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = response.optimal;
      setConceptResults(concepts);
    }
  }

  function getParentResponse(parent_id, questionID, setParent, getGradedResponsesWithCallback) {
    const callback = (responses) => {
      setParent(responses.find(resp => resp.id === parent_id));
    };
    getGradedResponsesWithCallback(questionID, callback);
  }

  function rerenderResponse(newResponse) {
    setResponse(newResponse)
  }

  function renderConceptResults(mode) {
    const conceptResultsTemp = Object.assign({}, conceptResults)
    let components
    if (conceptResultsTemp) {
      if (mode === 'Editing') {
        const conceptResultsPlus = Object.assign(conceptResultsTemp, {null: response.optimal})
        components = Object.keys(conceptResultsPlus).map(uid => {
          const concept = _.find(concepts.data['0'], { uid, });
          return (
            <ConceptSelectorWithCheckbox
              checked={conceptResultsTemp[uid]}
              currentConceptUID={uid}
              deleteConceptResult={() => deleteConceptResult(uid)}
              handleSelectorChange={handleConceptChange}
              key={uid}
              onCheckboxChange={() => toggleCheckboxCorrect(uid)}
              selectorDisabled={uid === null || uid === 'null' ? false : true}
            />
          )
        });
      } else {
        components = Object.keys(conceptResultsTemp).map(uid => {
          const concept = _.find(concepts.data['0'], { uid, });
          if (concept) {
          // hacky fix for the problem where concept result uids are being returned with string value 'false' rather than false
            return  (
              <li key={uid}>
                {concept.displayName} {conceptResultsTemp[uid] && conceptResultsTemp[uid] !== 'false' ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
                {'\t'}
              </li>
            )
          }
        });
      }
      return _.values(components);
    }
  };

  function renderResponseContent(isEditing, response) {
    let content;
    let parentDetails;
    let childDetails;
    let pathwayDetails;
    let authorDetails;
    if (!expanded) {
      return;
    }
    if (response.parentID || response.parent_id) {
      const parent = parent;
      if (!parent) {
        getParentResponse(response.parentID || response.parent_id)
        parentDetails = [
          (<p>Loading...</p>),
          (<br />)
        ]
      } else {
        const diffText = applyDiff(parent.text, response.text);
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
            handleTextChange={handleFeedbackChange}
            text={feedback || ''}
          />

          <br />

          <div className="box">
            <label className="label">Concept Results</label>
            {renderConceptResults('Editing')}
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
            {renderConceptResults('Viewing')}
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

  function renderResponseFooter(isEditing, response) {
    if (!readOnly || !expanded) {
      return;
    }
    let buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" key="cancel" onClick={() => cancelResponseEdit(response.key)} >Cancel</a>),
        (<a className="card-footer-item" key="unmatch" onClick={() => unmatchResponse(response.key)} >Unmatch</a>),
        (<a className="card-footer-item" key="update" onClick={() => updateResponse(response.key)} >Update</a>)
      ];
    } else {
      buttons = [
        (<a className="card-footer-item" key="edit" onClick={() => editResponse(response.key)} >Edit</a>),
        (<a className="card-footer-item" key="delete" onClick={() => deleteResponse(response.key)} >Delete</a>)
      ];
    }
    if (statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" key="rematch" onClick={() => rematchResponse()} >Rematch</a>)]);
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  };

  function renderResponseHeader(response) {
    let bgColor;
    let icon;
    const headerCSSClassNames = ['human-optimal-response', 'human-sub-optimal-response', 'algorithm-optimal-response', 'algorithm-sub-optimal-response', 'not-found-response'];
    console.log(response);
    bgColor = headerCSSClassNames[statusCode];
    if (response.weak) {
      icon = '⚠️';
    }
    const authorStyle = { marginLeft: '10px', };
    const showTag = response.author && (statusCode === 2 || statusCode === 3)
    const author = showTag ? <span className="tag is-dark" style={authorStyle}>{response.author}</span> : undefined;
    const checked = massEdit.selectedResponses.includes(response.id) ? 'checked' : '';
    return (
      <div className={bgColor} style={{ display: 'flex', alignItems: 'center', }}>
        <input checked={checked} onChange={() => onMassSelectCheckboxToggle(response.id)} style={{ marginLeft: '15px', }} type="checkbox" />
        <header className={`card-content ${headerClasses()}`} onClick={() => expand(response.key)} style={{ flexGrow: '1', }}>
          <div className="content">
            <div className="media">
              <div className="media-content">
                <p><pre>{response.text}</pre> {author}</p>
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

  function cardClasses() {
    if (expanded) {
      return 'has-bottom-margin has-top-margin';
    }
  };

  function headerClasses() {
    if (!expanded) {
      return 'unexpanded';
    }
    return 'expanded';
  };

  function renderChildResponses(isViewingChildResponses, key) {
    if (isViewingChildResponses) {
      return (
        <Modal close={() => cancelChildResponseView(key)}>
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
  };

  const isEditing = (state === (`${C.START_RESPONSE_EDIT}_${response.key}`));
  const isViewingChildResponses = (state === (`${C.START_CHILD_RESPONSE_VIEW}_${response.key}`));

  return (
    <div className={`card is-fullwidth ${cardClasses()}`}>
      {renderResponseHeader(response)}
      {renderResponseContent(isEditing, response)}
      {renderResponseFooter(isEditing, response)}
      {renderChildResponses(isViewingChildResponses, response.key)}
    </div>
  )
}

export default Response