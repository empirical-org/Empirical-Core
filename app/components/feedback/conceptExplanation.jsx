import React from 'react'
const book = require('../../img/book_icon.png')

export default React.createClass({

  render: function () {
    return (
      <div className="concept-explanation">
        <div className="concept-explanation-title"><img src={book}/> Here's a Hint <img src={book}/></div>
        <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: this.props.description}}></div>
        <div className="concept-explanation-see-write">
          <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: this.props.leftBox}}></div>
          <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: this.props.rightBox}}></div>
        </div>
        {/*<div className="concept-explanation-remember" dangerouslySetInnerHTML={{__html: this.props.rememberTo}}></div>*/}
      </div>
    )
  },

})
