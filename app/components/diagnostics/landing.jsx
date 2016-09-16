import React from 'react'
import beginArrow from '../../img/begin_arrow.svg'
export default React.createClass({

  render: function () {
    return (
      <div className="landing-page">
        <h1>You're working on the Quill Placement Activity </h1>
        <p>
          You're about to answer 22 questions about writing sentences.
          Don't worry, it's not a test. It's just to figure out what you know.
        </p>
        <p className="second-p">
          Some of the questions might be about things you haven't learned yet—that's okay!
          Just answer them as best as you can.
          Once you're finished, Quill will create a learning plan just for you!
        </p>
        <button className="button student-begin" onClick={this.props.begin}>
          Begin <img className="begin-arrow" src={beginArrow}/>
        </button>
      </div>
    )
  },

})
