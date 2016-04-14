import React from 'react'
import Response from './response.jsx'

export default React.createClass({

  render: function () {
    var responseListItems = this.props.responses.map((resp) => {
      return (
          <Response
          response={resp}
          responses={this.props.responses}
          getResponse={this.props.getResponse}
          getChildResponses={this.props.getChildResponses}
          states={this.props.states}
          state={this.props.states[this.props.questionID]}
          questionID={this.props.questionID}
          dispatch={this.props.dispatch}
          key={resp.key}
          readOnly={this.props.admin}
          allExpanded={this.props.expanded}
          expanded={this.props.expanded[resp.key]}
          expand={this.props.expand}
          getMatchingResponse={this.props.getMatchingResponse}
          printPathways={this.props.printPathways} />
      )
    })
    if (this.props.ascending) {
      return (
        <div>
          {responseListItems}
        </div>
      );
    } else {
      return (
        <div>
          {responseListItems.reverse()}
        </div>
      );
    }
  }

})
