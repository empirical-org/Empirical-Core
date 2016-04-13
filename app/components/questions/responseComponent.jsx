import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/responses'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import ResponseList from './responseList.jsx'
import ResponseSortFields from './responseSortFields.jsx'
import ResponseToggleFields from './responseToggleFields.jsx'


const labels = ["Optimal", "Sub-Optimal", "Common Error", "Unmatched"]
const colors = ["#F5FAEF", "#FFF9E8", "#FFF0F2", "#F6ECF8"]

const Responses = React.createClass({
  // getInitialState: function () {
  //   return {
  //     sorting: "count",
  //     ascending: false,
  //     visibleStatuses: {
  //       "Optimal": true,
  //       "Sub-Optimal": true,
  //       "Common Error": true,
  //       "Unmatched": true
  //     },
  //     expanded: {}
  //   }
  // },

  expand: function (responseKey) {
  //   debugger
  //   var newState = this.state.expanded;
  //   newState[responseKey] = !newState[responseKey];
  //   this.setState({expanded: newState})

    this.props.dispatch(actions.toggleExpandSingleResponse(responseKey));
  },

  responsesWithStatus: function () {
    var responses = hashToCollection(this.props.question.responses)
    return responses.map((response) => {
      var statusCode;
      if (!response.feedback) {
        statusCode = 3;
      } else if (!!response.parentID) {
        statusCode = 2;
      } else {
        statusCode = (response.optimal ? 0 : 1);
      }
      response.statusCode = statusCode
      return response
    })
  },

  responsesGroupedByStatus: function () {
    return _.groupBy(this.responsesWithStatus(), 'statusCode')
  },

  gatherVisibleResponses: function () {
    var responses = this.responsesWithStatus();
    return _.filter(responses, (response) => {
      return this.props.responses.visibleStatuses[labels[response.statusCode]]
    });
  },

  getResponse: function (responseID) {
    var responses = hashToCollection(this.props.question.responses)
    return _.find(responses, {key: responseID})
  },

  getChildResponses: function (responseID) {
    var responses = hashToCollection(this.props.question.responses)
    return _.where(responses, {parentID: responseID})
  },

  renderResponses: function () {
    const {questionID} = this.props;
    var responses = this.gatherVisibleResponses();
    var responsesListItems = _.sortBy(responses, (resp) =>
        {return resp[this.props.responses.sorting] || 0 }
      )
    return <ResponseList
      responses={responsesListItems}
      getResponse={this.getResponse}
      getChildResponses={this.getChildResponses}
      states={this.props.states}
      questionID={questionID}
      dispatch={this.props.dispatch}
      admin={this.props.admin}
      expanded={this.props.responses.expanded}
      expand={this.expand}
      ascending={this.props.responses.ascending}/>
  },

  toggleResponseSort: function (field) {
    if (field === this.props.responses.sorting) {
      this.props.dispatch(actions.toggleResponseSort(field));
    }
    // (field === this.state.sorting ? this.setState({ascending: !this.state.ascending}) : this.setState({sorting: field, ascending: false}));
  },

  renderSortingFields: function () {
    return <ResponseSortFields
      sorting={this.props.responses.sorting}
      ascending={this.props.responses.ascending}
      toggleResponseSort={this.toggleResponseSort}/>
  },

  toggleField: function (status) {
    // var toggledStatus = {};
    // var newVisibleStatuses = {};
    // toggledStatus[status] = !this.props.visibleStatuses[status];
    // _.extend(newVisibleStatuses, this.state.visibleStatuses, toggledStatus);

    this.props.dispatch(actions.toggleStatusField(status))
    // this.setState({visibleStatuses: newVisibleStatuses});
  },

  renderStatusToggleMenu: function () {
    return (
      <ResponseToggleFields
        labels={labels}
        toggleField={this.toggleField}
        visibleStatuses={this.props.responses.visibleStatuses} />   
    )
  },

  collapseAllResponses: function () {
  //   this.setState({expanded: {}});
    this.props.dispatch(actions.collapseAllResponses());
  },

  expandAllResponses: function () {
    const responses = this.responsesWithStatus();
    var newExpandedState = this.props.responses.expanded;
    for (var i = 0; i < responses.length; i++) {
      newExpandedState[responses[i].key] = true;
    };
    // this.setState({expanded: newState});
    this.props.dispatch(actions.expandAllResponses(newExpandedState));
  },

  allClosed: function () {
    var expanded = this.props.responses.expanded;
    for (var i in expanded) {
        if (expanded[i] === true) return false;
    }
    return true;
  },

  renderExpandCollapseAll: function () {
    var text, handleClick;

    if (this.allClosed()) {
      handleClick = this.expandAllResponses;
      text = "Expand All";
    } else {
      handleClick = this.collapseAllResponses;
      text = "Close All";
    }
    return <a className="button is-fullwidth" onClick={handleClick}> {text} </a>
  },

  render: function () {
    return (
      <div>
        <div className="tabs is-toggle is-fullwidth">
          {this.renderSortingFields()}
        </div>
        <div className="tabs is-toggle is-fullwidth">
          {this.renderStatusToggleMenu()}
        </div>
        <div className="columns">
          <div className="column">
            {this.renderExpandCollapseAll()}
          </div>
        </div>
        {this.renderResponses()}
      </div>
    )
  }
})

function select(state) {
  return {
    responses: state.responses
  }
}

export default connect(select)(Responses);
