import React from 'react'
import Response from './response.jsx'
import AffectedResponse from './affectedResponse.jsx'
import _ from 'underscore'

export default React.createClass({

  renderResponse: function(resp) {
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
  },

  render: function () {
    var responseListItems = this.props.responses.map((resp) => {
      if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && this.props.selectedIncorrectSequences) {
        const anyMatches = this.props.selectedIncorrectSequences.some(inSeq => inSeq.length > 0 && new RegExp(inSeq).test(resp.text))
        if (anyMatches) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }
      if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && this.props.selectedFocusPoints) {
        const noneMatch = !this.props.selectedFocusPoints.some(fp => fp.length > 0 && new RegExp(fp).test(resp.text))
        if (noneMatch) {
          return <AffectedResponse key={resp.key}>{this.renderResponse(resp)}</AffectedResponse>
        }
      }

      return (this.renderResponse(resp))
    });

    return (
      <div>
        {responseListItems}
      </div>
    );
  }
})
