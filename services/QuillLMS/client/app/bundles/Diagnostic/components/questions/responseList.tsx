import { focusPointMatchHelper, incorrectSequenceMatchHelper } from "quill-marking-logic"
import * as React from 'react'
import _ from 'underscore'

import Response from './response'

import { AffectedResponse, isValidRegex } from '../../../Shared/index'
import massEdit from '../../actions/massEdit'
import { Question, FocusPoint, IncorrectSequence } from '../../libs/grading/rematching'

interface ResponseListProps {
  admin: boolean,
  ascending: boolean,
  concepts: Array<Object>,
  dispatch: Function,
  expand: Function,
  expanded: boolean,
  getChildResponses: Function,
  getResponse: Function,
  massEditResponses: Object,
  mode: string,
  question: Question,
  questionID: string,
  responses: Array<Response>,
  selectedFocusPoints: Array<FocusPoint>,
  selectedIncorrectSequences: Array<IncorrectSequence>,
  states: Object,
  updateResponse: Function,
}


const ResponseList = ({admin, ascending, concepts, dispatch, expand, expanded, getChildResponses, getResponse, massEditResponses, mode, question, questionID, responses, selectedFocusPoints, selectedIncorrectSequences, states, updateResponse }: ResponseListProps) => {

  function allResponsesChecked() {
    return !responses.some((r) => {
      return !(
        massEditResponses.selectedResponses.includes(r.key) ||
        massEditResponses.selectedResponses.includes(r.id)
      )
    })
  };

  function addAllResponsesToMassEdit() {
    const keys = responses.map(r => r.id)
    dispatch(massEdit.addResponsesToMassEditArray(keys))
  };

  function removeAllResponsesFromMassEdit() {
    const keys = responses.map(r => r.id)
    dispatch(massEdit.removeResponsesFromMassEditArray(keys))
  };

  function addOrRemoveAllResponsesFromMassEdit() {
    if (allResponsesChecked()) {
      removeAllResponsesFromMassEdit()
    } else {
      addAllResponsesToMassEdit()
    }
  };

  function renderResponse(resp) {
    return (
      <Response
        allExpanded={expanded}
        ascending={ascending}
        concepts={concepts}
        dispatch={dispatch}
        expand={expand}
        expanded={expanded[resp.key]}
        getChildResponses={getChildResponses}
        getResponse={getResponse}
        key={resp.key}
        massEditResponses={massEditResponses}
        mode={mode}
        passedResponse={resp}
        question={question}
        questionID={questionID}
        readOnly={admin}
        responses={responses}
        state={states[questionID]}
        states={states}
        updateParentResponse={(id, response) => updateResponse(id, response)}
      />
    )
  }

  function isValidAndNotEmptyRegex(string) {
    return string.length && isValidRegex(string)
  }

  const responseListItems = responses && responses.map((resp) => {
    if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && selectedIncorrectSequences) {
      const incorrectSequences = selectedIncorrectSequences.filter(isValidAndNotEmptyRegex)
      const anyMatches = incorrectSequences.some(inSeq => incorrectSequenceMatchHelper(resp.text, inSeq.text, inSeq.caseInsensitive))
      if (anyMatches) {
        return <AffectedResponse key={resp.key}>{renderResponse(resp)}</AffectedResponse>
      }
    }
    if (resp && selectedFocusPoints) {
      const focusPoints = selectedFocusPoints.filter(isValidAndNotEmptyRegex)
      const noMatchedFocusPoints = focusPoints.every(fp => !focusPointMatchHelper(resp.text, fp.text))
      if (noMatchedFocusPoints) {
        return <AffectedResponse key={resp.key}>{renderResponse(resp)}</AffectedResponse>
      }
    }

    return renderResponse(resp)
  });



  return (
    <div style={{ marginTop: '20px', }}>
      <span style={{ paddingLeft: '15px', }}>
        <input
          checked={allResponsesChecked()}
          onChange={addOrRemoveAllResponsesFromMassEdit}
          style={{ marginRight: '14px', }}
          type="checkbox"
        />
        Check All Responses On Page
      </span>
      <div>
        {responseListItems}
      </div>
    </div>
  );
}

export default ResponseList
