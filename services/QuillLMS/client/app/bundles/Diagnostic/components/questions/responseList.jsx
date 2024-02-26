import { focusPointMatchHelper, incorrectSequenceMatchHelper } from "quill-marking-logic"
import * as React from 'react'
import _ from 'underscore'

import { AffectedResponse, isValidRegex } from '../../../Shared/index'

import massEdit from '../../actions/massEdit'
import Response from './response'

const ResponseList = ({updateResponse, selectedFocusPoints, selectedIncorrectSequences, passedResponses, massEdit, dispatch, expanded, conceptID, concepts, conceptsFeedback, expand, getChildResponses, getMatchingResponse, getResponse, mode, question, questionID, admin, states}) => {
  const [responses, setResponses] = React.useState(passedResponses);

  React.useEffect(() => {
    setResponses(passedResponses)
  }, [passedResponses])

  function allResponsesChecked() {
    return !responses.some((r) => {
      return !(
        massEdit.selectedResponses.includes(r.key) ||
        massEdit.selectedResponses.includes(r.id)
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
        conceptID={conceptID}
        concepts={concepts}
        conceptsFeedback={conceptsFeedback}
        dispatch={dispatch}
        expand={expand}
        expanded={expanded[resp.key]}
        getChildResponses={getChildResponses}
        getMatchingResponse={getMatchingResponse}
        getResponse={getResponse}
        key={resp.key}
        massEditResponses={massEdit}
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

  const responseListItems = responses.map((resp) => {
    if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && selectedIncorrectSequences) {
      const incorrectSequences = selectedIncorrectSequences.filter(isValidAndNotEmptyRegex)
      const anyMatches = incorrectSequences.some(inSeq => incorrectSequenceMatchHelper(resp.text, inSeq))
      if (anyMatches) {
        return <AffectedResponse key={resp.key}>{renderResponse(resp)}</AffectedResponse>
      }
    }
    if (resp && selectedFocusPoints) {
      const focusPoints = selectedFocusPoints.filter(isValidAndNotEmptyRegex)
      const noMatchedFocusPoints = focusPoints.every(fp => !focusPointMatchHelper(resp.text, fp))
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
