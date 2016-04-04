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

  updateResponse: function (rid) {
    var newResp = {
      feedback: this.refs.newResponseFeedback.value,
      optimal: this.refs.newResponseOptimal.checked
    }
    this.props.dispatch(questionActions.submitResponseEdit(this.props.questionID, rid, newResp))
  },

  incrementResponse: function (rid) {
    this.props.dispatch(questionActions.incrementResponseCount(this.props.questionID, rid));
  },

  removeLinkToParentID: function (rid) {
    this.props.dispatch(questionActions.removeLinkToParentID(this.props.questionID, rid));
  },

  renderResponseContent: function (isEditing, response) {
    var content;
    var parentDetails;
    if (response.parentID) {
      const parent = this.props.getResponse(response.parentID)
      if (isEditing) {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<button className="button is-danger" onClick={this.removeLinkToParentID.bind(null, response.key)}>Remove Link to Parent </button>),
          (<br />)]
      } else {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />)]
      }
    }

    if (isEditing) {
      content =
        <div className="content">
          {parentDetails}
          <label className="label">Feedback</label>
          <p className="control">
            <input className="input" type="text" defaultValue={response.feedback} ref="newResponseFeedback"></input>
          </p>
          <p className="control">
            <label className="checkbox">
              <input ref="newResponseOptimal" defaultChecked={response.optimal} type="checkbox" />
              Optimal?
            </label>
          </p>
        </div>
    } else {
      content =
        <div className="content">
          {parentDetails}
          <strong>Feedback:</strong> {response.feedback}
          <br />
          <strong>Grade:</strong> { response.optimal ? 'Optimal' : 'Sub-optimal' }
          <br />
          <small>
            Submissions: { response.count ? response.count : 0 }
          </small>
        </div>
    }

    return (
      <div className="card-content">
        {content}
      </div>
    )
  },

  renderResponseFooter: function (isEditing, response) {
    var buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" onClick={this.cancelResponseEdit.bind(null, response.key)} key='cancel' >Cancel</a>),
        (<a className="card-footer-item" onClick={this.incrementResponse.bind(null, response.key)} key='increment' >Increment</a>),
        (<a className="card-footer-item" onClick={this.updateResponse.bind(null, response.key)} key='update' >Update</a>)
      ]
    } else {
      buttons = [
        (<a className="card-footer-item" onClick={this.editResponse.bind(null, response.key)} key='edit' >Edit</a>),
        (<a className="card-footer-item" onClick={this.deleteResponse.bind(null, response.key)} key='delete' >Delete</a>)
      ]
    }
    return (
      <footer className="card-footer">
        {buttons}
      </footer>
    )
    // Return the Edit and Delete button if not editing, and
    // the Cancel and Save button if editing.
  },

  render: function () {
    const {response, states, questionID} = this.props;

    const isEditing = (states[questionID] === (C.START_RESPONSE_EDIT + "_" + response.key));

    return (
      <div className="card is-fullwidth has-bottom-margin">
        <header className="card-header">
          <p className="card-header-title">
            {response.text}
          </p>
        </header>
        {this.renderResponseContent(isEditing, response)}
        {this.renderResponseFooter(isEditing, response)}
      </div>
    )

  }

})
