import React from 'react'
import C from '../../constants'
import questionActions from '../../actions/questions'

export default React.createClass({
  deleteResponse: function (rid) {
    this.props.dispatch(questionActions.deleteResponse(this.props.questionID, rid))
  },

  editResponse: function (rid) {
    this.props.dispatch(questionActions.startResponseEdit(this.props.questionID, rid))
  },

  // cancel editing function ^^^^
  cancelResponseEdit: function (rid) {
    this.props.dispatch(questionActions.cancelResponseEdit(this.props.questionID, rid))
  },

  render: function () {
    const {response, states, questionID} = this.props;
    if (states[questionID] === (C.START_RESPONSE_EDIT + "_" + response.key)) {
      return (
        <div className="card-editing-wrapper">
          <p>Editing...</p>
          <button onClick={this.cancelResponseEdit.bind(null, response.key)}>Cancel</button>
        </div>
      )
    } else {
      return (
        <div className="card is-fullwidth has-bottom-margin">
          <header className="card-header">
            <p className="card-header-title">
              {response.text}
            </p>
          </header>
          <div className="card-content">
            <div className="content">
              <strong>Feedback:</strong> {response.feedback}
              <br />
              <strong>Grade:</strong> { response.optimal ? 'Optimal' : 'Sub-optimal' }
              <br />
              <small>
                Submissions: { response.count ? response.count : 0 }
              </small>
            </div>
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" onClick={this.editResponse.bind(null, response.key)}>Edit</a>
            <a className="card-footer-item" onClick={this.deleteResponse.bind(null, response.key)}>Delete</a>
          </footer>
        </div>
      )
    }
  }

})
