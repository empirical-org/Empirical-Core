import React from 'react'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'
import { connect } from 'react-redux'

export default React.createClass ({

  propTypes: {
    feedbackText: React.PropTypes.string.isRequired,
    feedbackID: React.PropTypes.string.isRequired,
    submitNewFeedback: React.PropTypes.func.isRequired,
    cancelEdit: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {newFeedbackText: this.props.feedbackText};
  },

  handleChange: function (e) {
    this.setState({newFeedbackText: e.target.value})
  },

  submit: function(){
    this.props.submitNewFeedback(this.props.feedbackID, this.state.newFeedbackText)
  },

  cancel: function() {
    this.props.cancelEdit(this.props.feedbackID)
  },

  render: function () {
    return (
      <form className="box" onSubmit={this.submit}>
        <h6 className="control subtitle">New Feedback</h6>

        <label className="label">Enter the feedback associated with the concept</label>
        <p className="control">
          <input className="input" type="text"  value={this.state.newFeedbackText} onChange={this.handleChange}></input>
        </p>
        <button type="submit" className="button is-primary">Submit</button>
        <button className="button is-danger" onClick={this.cancel}>Cancel</button>
      </form>
    )
  }

})
