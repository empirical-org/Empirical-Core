import React from 'react'
import Response from './response.jsx'

export default React.createClass({

  render: function () {
    var responseListItems = this.props.responses.map((resp) => {
      return (
          <Response
          response={resp}
          getResponse={this.props.getResponse}
          state={this.props.states[this.props.questionID]}
          questionID={this.props.questionID}
          dispatch={this.props.dispatch}
          key={resp.key}
          readOnly={this.props.admin}
          expanded={this.props.expanded[resp.key]}
          expand={this.props.expand}/>
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
