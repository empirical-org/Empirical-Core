import React from 'react'
import Response from './response.jsx'
import { AffectedResponse } from 'quill-component-library/dist/componentLibrary'
import massEdit from '../../actions/massEdit';
import _ from 'underscore'

export default class ResponseList extends React.Component {
  constructor(props) {
    super(props)

    this.addAllResponsesToMassEdit = this.addAllResponsesToMassEdit.bind(this)
  }

  incorrectSequenceMatchHelper(responseString, sequenceParticle) {
    const matchList = sequenceParticle.split('&&');
    return _.every(matchList, m => new RegExp(m).test(responseString));
  }

  focusPointMatchHelper(responseString, sequenceParticle) {
    const matchList = sequenceParticle.split('&&');
    return _.every(matchList, m => new RegExp(m, 'i').test(responseString));
  }

  addAllResponsesToMassEdit(event) {
    const keys = this.props.responses.map(r => r.key)
    this.props.dispatch(massEdit.addResponsesToMassEditArray(keys))
  }

  renderResponse(resp) {
    return <Response
      key={resp.key}
      response={resp}
      responses={this.props.responses}
      getResponse={this.props.getResponse}
      getChildResponses={this.props.getChildResponses}
      states={this.props.states}
      state={this.props.states[this.props.questionID]}
      questionID={this.props.questionID}
      dispatch={this.props.dispatch}
      readOnly={this.props.admin}
      allExpanded={this.props.expanded}
      expanded={this.props.expanded[resp.key]}
      expand={this.props.expand}
      getMatchingResponse={this.props.getMatchingResponse}
      showPathways={this.props.showPathways}
      printPathways={this.props.printPathways}
      toPathways={this.props.toPathways}
      conceptsFeedback={this.props.conceptsFeedback}
      mode={this.props.mode}
      concepts={this.props.concepts}
      conceptID={this.props.conceptID}
      massEdit={this.props.massEdit}
    />
  }

  render() {
    const responseListItems = this.props.responses.map((resp) => {
      if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && this.props.selectedIncorrectSequences) {
        const incorrectSequences = this.props.selectedIncorrectSequences.filter(is => is.length > 0)
        const anyMatches = incorrectSequences.some(inSeq => this.incorrectSequenceMatchHelper(resp.text, inSeq))
        if (anyMatches) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }
      if (resp && this.props.selectedFocusPoints) {
        const focusPoints = this.props.selectedFocusPoints.filter(fp => fp.length > 0)
        const matchAllFocusPoints = focusPoints.some(fp => this.focusPointMatchHelper(resp.text, fp))
        if (matchAllFocusPoints) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }

      return (this.renderResponse(resp))
    });

    return (
      <div style={{ marginTop: '20px', }}>
        <span style={{ paddingLeft: '15px', fontWeight: 'semibold', }}><input style={{ marginRight: '14px', }} type="checkbox" onChange={this.addAllResponsesToMassEdit} />Check All</span>
        <div>
          {responseListItems}
        </div>
      </div>
    );
  }
}
