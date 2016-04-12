import React from 'react'

export default React.createClass({
  stateSpecificClass: function (stateName) {
    if (this.props.sorting === stateName) {
      return " is-active"
    }
  },

  renderAscendingArrow: function (stateName) {
    if (this.props.sorting === stateName) {
      return this.props.ascending ? "^" : "v"
    }
  },

  renderSortField: function (displayName, stateName) {
    return (
      <li className={this.stateSpecificClass(stateName)}>
        <a onClick={this.props.toggleResponseSort.bind(null, stateName)}>
          {displayName} {this.renderAscendingArrow(stateName)}
        </a>
      </li>
    )
  },

  render: function () {
    return (
      <ul>
        {this.renderSortField('Submissions', 'count')}
        {this.renderSortField('Text', 'text')}
        {this.renderSortField('Created At', 'createdAt')}
        {this.renderSortField('Status', 'statusCode')}
      </ul>
    );
  }

})
