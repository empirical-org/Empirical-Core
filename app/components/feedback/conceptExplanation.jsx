import React from 'react'

export default React.createClass({

  render: function () {
    return (
      <div className="concept-explanation">
        <div className="concept-explanation-title" dangerouslySetInnerHTML={{__html: this.props.title}}></div>
        <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: this.props.description}}></div>
        <div className="concept-explanation-see-write">
          <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: this.props.leftBox}}></div>
          <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: this.props.rightBox}}></div>
        </div>
        <div className="concept-explanation-remember" dangerouslySetInnerHTML={{__html: this.props.rememberTo}}></div>
      </div>
    )
  },

})
