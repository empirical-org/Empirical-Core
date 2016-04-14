import React from 'react'
import C from '../../constants'
import questionActions from '../../actions/questions'
import Question from '../../libs/question'
const jsDiff = require('diff');
import Modal from '../modal/modal.jsx'
import ResponseList from './responseList.jsx'
import _ from 'underscore'

const feedbackStrings = {
  punctuationError: "punctuation error",
  typingError: "spelling mistake",
  caseError: "capitalization error"
}

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

  viewChildResponses: function (rid) {
    this.props.dispatch(questionActions.startChildResponseView(this.props.questionID, rid))
  },

  cancelChildResponseView: function (rid) {
    this.props.dispatch(questionActions.cancelChildResponseView(this.props.questionID, rid))
  },

  updateResponse: function (rid) {
    var newResp = {
      feedback: this.refs.newResponseFeedback.value,
      optimal: this.refs.newResponseOptimal.checked
    }
    this.props.dispatch(questionActions.submitResponseEdit(this.props.questionID, rid, newResp))
  },

  updateRematchedResponse: function (rid, vals) {
    this.props.dispatch(questionActions.submitResponseEdit(this.props.questionID, rid, vals))
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError')
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return "You have made a " + feedbackStrings[key] + "."
      }
    }))
    return errorComponents[0]
  },

  rematchResponse: function (rid) {
    var newResponse = this.props.getMatchingResponse(rid)
    console.log("new resp: ", newResponse)
    if (!newResponse.found) {
      console.log("Not found")
      var newValues = {
        text: this.props.response.text,
        count: this.props.response.count
      }
      this.props.dispatch(
        questionActions.setUpdatedResponse(this.props.questionID, rid, newValues)
      )
      return
    }
    if (newResponse.response.key === this.props.response.parentID) {
      console.log("No Change")
    }
    else {
      console.log("Changed response")
      var newErrorResp = {
        parentID: newResponse.response.key,
        feedback: this.generateFeedbackString(newResponse)
      }
      this.updateRematchedResponse(rid, newErrorResp)
    }
    // this.updateReponseResource(response)
    // this.submitResponse(response)
    // this.setState({editing: false})
  },

  incrementResponse: function (rid) {
    this.props.dispatch(questionActions.incrementResponseCount(this.props.questionID, rid));
  },

  removeLinkToParentID: function (rid) {
    this.props.dispatch(questionActions.removeLinkToParentID(this.props.questionID, rid));
  },

  applyDiff: function (answer, response) {
    answer = answer || '';
    response = response || '';
    var diff = jsDiff.diffWords(response, answer);
    var spans = diff.map(function (part) {
      var fontWeight = part.added ? 'bold' : 'normal';
      var fontStyle = part.removed ? 'oblique' : 'normal';
      var divStyle = {
        fontWeight,
        fontStyle
      };
      return <span style={divStyle}>{part.value}</span>;
    });
    return spans;
  },

  renderResponseContent: function (isEditing, response) {
    var content;
    var parentDetails;
    var childDetails;
    if (!this.props.expanded) {
      return
    }
    if (!response.parentID) {
      childDetails = (<a className="button is-outlined has-top-margin" onClick={this.viewChildResponses.bind(null, response.key)} key='view' >View Children</a>)
    }


    if (response.parentID) {
      const parent = this.props.getResponse(response.parentID);
      const diffText = this.applyDiff(parent.text, response.text);
      if (isEditing) {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<button className="button is-danger" onClick={this.removeLinkToParentID.bind(null, response.key)}>Remove Link to Parent </button>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
          (<br />)]
      } else {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<span><strong>Parent Text:</strong> {parent.text}</span>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
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
          <br/>
          {childDetails}
        </div>
    }

    return (
      <div className="card-content">
        {content}
      </div>
    )
  },

  renderResponseFooter: function (isEditing, response) {
    if (!this.props.readOnly || !this.props.expanded) {
      return
    }
    var buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" onClick={this.cancelResponseEdit.bind(null, response.key)} key='cancel' >Cancel</a>),
        (<a className="card-footer-item" onClick={this.incrementResponse.bind(null, response.key)} key='increment' >Increment</a>),
        (<a className="card-footer-item" onClick={this.rematchResponse.bind(null, response.key)} key='rematch' >Rematch</a>),
        (<a className="card-footer-item" onClick={this.updateResponse.bind(null, response.key)} key='update' >Update</a>)
      ]
    } else {
      buttons = [
        (<a className="card-footer-item" onClick={this.editResponse.bind(null, response.key)} key='edit' >Edit</a>),
        (<a className="card-footer-item" onClick={this.rematchResponse.bind(null, response.key)} key='rematch' >Rematch</a>),
        (<a className="card-footer-item" onClick={this.deleteResponse.bind(null, response.key)} key='delete' >Delete</a>)
      ]
    }
    return (
      <footer className="card-footer">
        {buttons}
      </footer>
    );
  },

  responseIsCommonError: function (response) {
    return (response.feedback.includes("punctuation") || response.feedback.includes("spelling")) || response.feedback.includes("typo")
  },

  renderResponseHeader: function (response) {
    var bgColor;
    if (!response.feedback) {
      bgColor = "not-found-response";
    } else if (!!response.parentID) {
      bgColor = "common-error-response";
    } else {
      bgColor = (response.optimal ? "optimal-response" : "sub-optimal-response");
    }

    return (
      <header className={"card-content " + bgColor + " " + this.headerClasses()} onClick={this.props.expand.bind(null, response.key)}>
        <div className="content">
          <div className="media">
            <div className="media-content">
              <p>{response.text}</p>
            </div>
            <div className="media-right">
              <figure className="image is-32x32">
                <span>{ response.count ? response.count : 0 }</span>
              </figure>
            </div>
          </div>
        </div>
      </header>
    );
  },

  cardClasses: function () {
    if (this.props.expanded) {
      return "has-bottom-margin has-top-margin"
    }
  },

  headerClasses: function () {
    if (!this.props.expanded) {
      return "unexpanded"
    } else {
      return "expanded"
    }
  },

  renderChildResponses: function (isViewingChildResponses, key) {
    if (isViewingChildResponses) {
      return (
        <Modal close={this.cancelChildResponseView.bind(null, key)}>
          <ResponseList
            responses={this.props.getChildResponses(key)}
            getResponse={this.props.getResponse}
            getChildResponses={this.props.getChildResponses}
            states={this.props.states}
            questionID={this.props.questionID}
            dispatch={this.props.dispatch}
            admin={false}
            expanded={this.props.allExpanded}
            expand={this.props.expand}
            ascending={this.props.ascending}/>
        </Modal>
      )
    }
  },

  render: function () {
    const {response, state} = this.props;
    const isEditing = (state === (C.START_RESPONSE_EDIT + "_" + response.key));
    const isViewingChildResponses = (state === (C.START_CHILD_RESPONSE_VIEW + "_" + response.key));

    return (
      <div className={"card is-fullwidth " + this.cardClasses()}>
        {this.renderResponseHeader(response)}
        {this.renderResponseContent(isEditing, response)}
        {this.renderResponseFooter(isEditing, response)}
        {this.renderChildResponses(isViewingChildResponses, response.key)}
      </div>
    )
  }
})
