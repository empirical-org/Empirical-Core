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
  getInitialState: function () {
    return {
      sorting: "count",
      ascending: false,
      visibleStatuses: {
        "Optimal": true,
        "Sub-Optimal": true,
        "Common Error": true,
        "Unmatched": true
      },
      expanded: {}
    }
  },

  // expand: function (responseKey) {
  //   debugger
  //   var newState = this.state.expanded;
  //   newState[responseKey] = !newState[responseKey];
  //   this.setState({expanded: newState})
  // },

  expand: function (responseKey) {
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
      return this.state.visibleStatuses[labels[response.statusCode]]
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
    var responses = this.gatherVisibleResponses()
    var responsesListItems = _.sortBy(responses, (resp) =>
        {return resp[this.state.sorting] || 0 }
      )
    return <ResponseList
      responses={responsesListItems}
      getResponse={this.getResponse}
      getChildResponses={this.getChildResponses}
      states={this.props.states}
      questionID={questionID}
      dispatch={this.props.dispatch}
      admin={this.props.admin}
      expanded={this.state.expanded}
      expand={this.expand}
      ascending={this.state.ascending}/>
  },

  toggleResponseSort: function (field) {
    if (field === this.props.sorting) {
      this.dispatch(actions.toggleResponseSort(field));
    }
    // (field === this.state.sorting ? this.setState({ascending: !this.state.ascending}) : this.setState({sorting: field, ascending: false}));
  },

  renderSortingFields: function () {
    return <ResponseSortFields
      sorting={this.state.sorting}
      ascending={this.state.ascending}
      toggleResponseSort={this.toggleResponseSort}/>
  },

  toggleField: function (status) {
    var toggledStatus = {};
    var newVisibleStatuses = {};
    toggledStatus[status] = !this.state.visibleStatuses[status];
    _.extend(newVisibleStatuses, this.state.visibleStatuses, toggledStatus);

    this.props.dispatch(actions.toggleStatusField(newVisibleStatuses))
    // this.setState({visibleStatuses: newVisibleStatuses});
  },

  renderStatusToggleMenu: function () {
    return (
      <ResponseToggleFields
        labels={labels}
        toggleField={this.toggleField}
        visibleStatuses={this.state.visibleStatuses} />   
    )
  },

  // collapseAllResponses: function () {
  //   this.setState({expanded: {}});
  // },

  collapseAllResponses: function () {
    this.props.dispatch(actions.collapseAllResponses());
  },

  expandAllResponses: function () {
    const responses = this.responsesWithStatus();
    var newExpandedState = this.state.expanded;
    for (var i = 0; i < responses.length; i++) {
      newExpandedState[responses[i].key] = true;
    };
    // this.setState({expanded: newState});
    this.props.dispatch(actions.expandAllResponses(newExpandedState));
  },

  renderExpandCollapseAll: function () {
    var text, handleClick;
    if (Object.keys(this.state.expanded).length === 0) {
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
    sorting: state.sorting,
    ascending: state.ascending,
    visibleStatuses: state.visibleStatuses,
    expanded: state.expanded
  }
}

export default connect(select)(Responses)
