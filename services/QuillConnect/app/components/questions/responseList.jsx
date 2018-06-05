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

  focusPointMatchHelper: function (responseString, focusPointParticle) {
    // Given a focus point and a response string, return
    const match_list = focusPointParticle.split('&&'); // => "Dog&&Cat" => ['Dog', 'Cat']
    return _.every(match_list, m => new RegExp(m, 'i').test(responseString));
  },

  render: function () {
    var responseListItems = this.props.responses.map((resp) => {
      if (resp && resp.statusCode !== 1 && resp.statusCode !== 0 && this.props.selectedIncorrectSequences) {
        const anyMatches = this.props.selectedIncorrectSequences.some(inSeq => inSeq.length > 0 && new RegExp(inSeq).test(resp.text))
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
      <div>
        {responseListItems}
      </div>
    );
  }
})
