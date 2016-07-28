import React from 'react'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'
import { connect } from 'react-redux'
import TextEditor from '../questions/textEditor.jsx'

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
    this.setState({newFeedbackText: e})
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
        <label className="label">Feedback</label>

        <TextEditor text={this.state.newFeedbackText} handleTextChange={this.handleChange} />

        <br />
        <button type="submit" className="button is-primary">Submit</button>
        <button className="button is-danger" onClick={this.cancel}>Cancel</button>
      </form>
    )
  }

})
