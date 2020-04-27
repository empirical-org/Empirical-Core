import * as React from 'react'
import _ from 'underscore'
import { AffectedResponse, isValidRegex } from 'quill-component-library/dist/componentLibrary'
import { focusPointMatchHelper, incorrectSequenceMatchHelper } from "quill-marking-logic"

import Response from './response'
import massEdit from '../../actions/massEdit';

export default class ResponseList extends React.Component {
  allResponsesChecked = () => {
    return !this.props.responses.some((r) => {
      return !(
        this.props.massEdit.selectedResponses.includes(r.key) ||
        this.props.massEdit.selectedResponses.includes(r.id)
      )
    })
  };

  addAllResponsesToMassEdit = () => {
    const keys = this.props.responses.map(r => r.id)
    this.props.dispatch(massEdit.addResponsesToMassEditArray(keys))
  };

  removeAllResponsesFromMassEdit = () => {
    const keys = this.props.responses.map(r => r.id)
    this.props.dispatch(massEdit.removeResponsesFromMassEditArray(keys))
  };

  addOrRemoveAllResponsesFromMassEdit = () => {
    if (this.allResponsesChecked()) {
      this.removeAllResponsesFromMassEdit()
    } else {
      this.addAllResponsesToMassEdit()
    }
  };

  renderResponse(resp) {
    return (<Response
      allExpanded={this.props.expanded}
      conceptID={this.props.conceptID}
      concepts={this.props.concepts}
      conceptsFeedback={this.props.conceptsFeedback}
      dispatch={this.props.dispatch}
      expand={this.props.expand}
      expanded={this.props.expanded[resp.key]}
      getChildResponses={this.props.getChildResponses}
      getMatchingResponse={this.props.getMatchingResponse}
      getResponse={this.props.getResponse}
      key={resp.key}
      massEdit={this.props.massEdit}
      mode={this.props.mode}
      printPathways={this.props.printPathways}
      question={this.props.question}
      questionID={this.props.questionID}
      readOnly={this.props.admin}
      response={resp}
      responses={this.props.responses}
      showPathways={this.props.showPathways}
      state={this.props.states[this.props.questionID]}
      states={this.props.states}
      toPathways={this.props.toPathways}
    />)
  }

  isValidAndNotEmptyRegex = (string) => {
    return string.length && isValidRegex(string)
  }

  render() {
    const responseListItems = this.props.responses.map((resp) => {
      if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && this.props.selectedIncorrectSequences) {
        const incorrectSequences = this.props.selectedIncorrectSequences.filter(this.isValidAndNotEmptyRegex)
        const anyMatches = incorrectSequences.some(inSeq => incorrectSequenceMatchHelper(resp.text, inSeq))
        if (anyMatches) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }
      if (resp && this.props.selectedFocusPoints) {
        const focusPoints = this.props.selectedFocusPoints.filter(this.isValidAndNotEmptyRegex)
        const noMatchedFocusPoints = focusPoints.every(fp => !focusPointMatchHelper(resp.text, fp))
        if (noMatchedFocusPoints) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }

      return (this.renderResponse(resp))
    });

    return (
      <div style={{ marginTop: '20px', }}>
        <span style={{ paddingLeft: '15px', }}>
          <input
            checked={this.allResponsesChecked()}
            onChange={this.addOrRemoveAllResponsesFromMassEdit}
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
}
