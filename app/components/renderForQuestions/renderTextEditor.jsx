import React from 'react'
import handleFocus from './handleFocus.js'
import Textarea from 'react-textarea-autosize'

export default React.createClass({

  render: function() {
    console.log("rendering text editor")
    return (
      <div className="control">
        <Textarea className={this.props.className} onFocus={handleFocus}
                  defaultValue={this.props.defaultValue} onChange={this.props.handleChange}
                  placeholder="Type your answer here. Rememeber, your answer should be just one sentence." />
      </div>
    )
  }
})
