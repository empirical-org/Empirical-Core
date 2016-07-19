import React from 'react'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'


export default React.createClass ({

  propTypes: {
    feedbackText: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {newFeedbackText: this.props.feedbackText};
  },

  submitNewFeedback: function (e) {
    e.preventDefault();
    if(this.state.newFeedbackText !== '') {
      this.props.dispatch(feedbackActions.submitConceptsFeedbackEdit(this.props.feedbackID.feedbackID, {
        feedbackText: this.state.newFeedbackText})
      )
    }
    // this.setState({feedbackText: this.refs.newFeedbackText.value})
  },

  handleChange: function (e) {
    this.setState({newFeedbackText: e.target.value})
  },

  cancelEdit: function() {
    this.props.dispatch(actions.cancelConceptsFeedbackEdit(this.props.feedbackID.feedbackID))
  },

  render: function () {
    console.log(this.props)
    return (
      <form className="box" onSubmit={this.submitNewFeedback}>
        <h6 className="control subtitle">New Feedback</h6>

        <label className="label">Enter the feedback associated with the concept</label>
        <p className="control">
          <input className="input" type="text"  value={this.state.newFeedbackText} onChange={this.handleChange}></input>
        </p>
        <button type="submit" className="button is-primary">Submit</button>
        <button className="button is-danger" onClick={this.cancelEdit}>Cancel</button>
      </form>
    )
  }

  })
